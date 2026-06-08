package main

import (
	"errors"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

const (
	startingBalance = 300
	boardRows       = 3
	boardCols       = 3
)

var (
	errBetMustBePositive  = errors.New("bet must be positive")
	errBetExceedsBalance  = errors.New("bet cannot exceed current balance")
	errBalanceDepleted    = errors.New("balance is depleted, start a new game")
	errInvalidRequestBody = errors.New("invalid JSON request body")
)

type Game struct {
	mu          sync.Mutex
	balance     int
	reel        []string
	multipliers map[string]int
	rng         *rand.Rand
}

type startResponse struct {
	Balance int `json:"balance"`
}

type spinRequest struct {
	Bet int `json:"bet"`
}

type spinResponse struct {
	Spin         [][]string `json:"spin"`
	WinningLines []int      `json:"winningLines"`
	WinAmount    int        `json:"winAmount"`
	Balance      int        `json:"balance"`
}

func NewGame() *Game {
	symbols := map[string]int{
		"A": 4,
		"B": 8,
		"C": 12,
		"D": 20,
	}

	multipliers := map[string]int{
		"A": 50,
		"B": 30,
		"C": 10,
		"D": 5,
	}

	return &Game{
		balance:     startingBalance,
		reel:        GetSymbolArray(symbols),
		multipliers: multipliers,
		rng:         rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

func (g *Game) Start() startResponse {
	g.mu.Lock()
	defer g.mu.Unlock()

	g.balance = startingBalance
	return startResponse{Balance: g.balance}
}

func (g *Game) Spin(bet int) (spinResponse, error) {
	g.mu.Lock()
	defer g.mu.Unlock()

	if bet <= 0 {
		return spinResponse{}, errBetMustBePositive
	}
	if g.balance <= 0 {
		return spinResponse{}, errBalanceDepleted
	}
	if bet > g.balance {
		return spinResponse{}, errBetExceedsBalance
	}

	g.balance -= bet

	spin := GetSpin(g.reel, boardRows, boardCols, g.rng)
	lineMultipliers := checkWin(spin, g.multipliers)
	winningLines := make([]int, len(lineMultipliers))
	winAmount := 0

	for index, multiplier := range lineMultipliers {
		if multiplier > 0 {
			winningLines[index] = 1
			winAmount += bet * multiplier
		}
	}

	g.balance += winAmount

	return spinResponse{
		Spin:         spin,
		WinningLines: winningLines,
		WinAmount:    winAmount,
		Balance:      g.balance,
	}, nil
}

func checkWin(spin [][]string, multipliers map[string]int) []int {
	lines := make([]int, 0, len(spin))
	for _, row := range spin {
		win := true
		checkSymbol := row[0]
		for _, symbol := range row[1:] {
			if checkSymbol != symbol {
				win = false
				break
			}
		}
		if win {
			lines = append(lines, multipliers[checkSymbol])
			continue
		}
		lines = append(lines, 0)
	}
	return lines
}

func (g *Game) handleStart(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, g.Start())
}

func (g *Game) handleSpin(w http.ResponseWriter, r *http.Request) {
	var request spinRequest
	if err := decodeJSON(r, &request); err != nil {
		writeError(w, http.StatusBadRequest, errInvalidRequestBody.Error())
		return
	}

	response, err := g.Spin(request.Bet)
	if err != nil {
		switch {
		case errors.Is(err, errBetMustBePositive), errors.Is(err, errBetExceedsBalance):
			writeError(w, http.StatusBadRequest, err.Error())
		case errors.Is(err, errBalanceDepleted):
			writeError(w, http.StatusConflict, err.Error())
		default:
			writeError(w, http.StatusInternalServerError, "could not complete spin")
		}
		return
	}

	writeJSON(w, http.StatusOK, response)
}
