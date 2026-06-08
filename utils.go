package main

import (
	"fmt"
)

func GetName() string {
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

func GetBet(balance uint) uint {
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