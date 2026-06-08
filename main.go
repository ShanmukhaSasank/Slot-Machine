package main

import (
	"fmt"
	"math/rand"
)

func getName() string {
	name := ""
	fmt.Println("Welcome to Sasank's Casino...!")
	fmt.Print("Please enter your name: ")
	_, err := fmt.Scanln(&name)
	if err != nil {
		fmt.Println("Error reading input:", err)
		return ""
	}
	fmt.Printf("Welcome, %s! Let's play!\n", name)
	return name
}

func getBet(balance uint) uint {
	var bet uint
	for true {
		fmt.Printf("Please enter your bet or 0 to quit (balance=$%d): ", balance)
		fmt.Scan(&bet)
		if bet > balance {
			fmt.Printf("Your bet cannot be more than your balance of %d. Please try again.\n", balance)
		} else {
			break
		}
	}
	return bet
}

func getSymbolArray(symbols map[string]uint) []string {
	symbolArray := []string{}
	for symbol, count := range symbols {
		for i := uint(0); i < count; i++ {
			symbolArray = append(symbolArray, symbol)
		}
	}
	return symbolArray
}

func getRandomNumber(min int, max int) int {
	randomNumber := min + rand.Intn(max-min+1)
	return randomNumber
}

func getSpin(reel []string, rows int, cols int) [][]string {
	result := [][]string{}

	for i := 0; i < rows; i++ {
		result = append(result, []string{})
	}
	for col := 0; col < cols; col++ {
		selected := map[int]bool{}
		for row := 0; row < rows; row++ {
			for true {
				randomIndex := getRandomNumber(0, len(reel)-1)
				_, exists := selected[randomIndex]
				if !exists {
					selected[randomIndex] = true
					result[row] = append(result[row], reel[randomIndex])
					break
				}
			}
		}
	}
	return result
}

func printSpin(spin [][]string) {
	for _, row := range spin {
		for j, symbol := range row {
			fmt.Printf(symbol)
			if j != len(row)-1 {
				fmt.Print(" | ")
			}
		}
		fmt.Println()
	}
}

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

	symbolArray := getSymbolArray(symbols)

	balance := uint(300)
	getName()
	for balance > 0 {
		bet := getBet(balance)
		if bet == 0 {
			break
		}
		balance -= bet
		spin := getSpin(symbolArray, 3, 3)
		printSpin(spin)
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
