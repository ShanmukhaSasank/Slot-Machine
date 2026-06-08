package main

import (
	"fmt"
)


func checkWin(spin [][]string, multipliers map[string]uint) []uint {
	lines := []uint{}
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
		} else {
			lines = append(lines, 0)
		}
	}
	return lines
}

func main() {
	symbols := map[string]uint{
		"A": 4,
		"B": 8,
		"C": 12,
		"D": 20,
	}

	multipliers := map[string]uint{
		"A": 50,
		"B": 30,
		"C": 10,
		"D": 5,
	}

	symbolArray := GetSymbolArray(symbols)

	balance := uint(300)
	GetName()
	for balance > 0 {
		bet := GetBet(balance)
		if bet == 0 {
			break
		}
		balance -= bet
		spin := GetSpin(symbolArray, 3, 3)
		PrintSpin(spin)
		winningLines := checkWin(spin, multipliers)
		for i, multi := range winningLines {
			win := bet * multi
			balance += win
			if multi > 0 {
				fmt.Printf("Won $%d, (%dx) on line #%d\n", win, multi, i+1)
			}
		}
	}
	fmt.Printf("Your final balance is $%d. Thanks for playing!\n", balance)
}
