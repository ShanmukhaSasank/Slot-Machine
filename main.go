package main

import (
	"fmt"
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


func getSpin(reel []string, rows int, cols int) [][]string {
	result := [][]string{}

	for i := 0; i < rows; i++ {
		result = append(result, []string{})
}


func main() {
	symbols := map[string]uint{
		"A": 4,
		"B": 8,
		"C": 12,
		"D": 20,
	}

	// multipliers := map[string]uint{
	// 	"A": 50,
	// 	"B": 30,
	// 	"C": 10,
	// 	"D": 5,
	// }
	symbolArray := getSymbolArray(symbols)
	fmt.Println(symbolArray)

	balance := uint(300)
	getName()
	for balance > 0 {
		bet := getBet(balance)
		if bet == 0 {
			break
		}
		balance -= bet
	}
	fmt.Printf("Your final balance is $%d. Thanks for playing!\n", balance)
}
