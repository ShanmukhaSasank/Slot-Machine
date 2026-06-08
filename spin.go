package main

import "math/rand"

func GetSymbolArray(symbols map[string]int) []string {
	symbolArray := []string{}
	for symbol, count := range symbols {
		for i := 0; i < count; i++ {
			symbolArray = append(symbolArray, symbol)
		}
	}
	return symbolArray
}

func getRandomNumber(min int, max int, rng *rand.Rand) int {
	return min + rng.Intn(max-min+1)
}

func GetSpin(reel []string, rows int, cols int, rng *rand.Rand) [][]string {
	result := make([][]string, rows)

	for col := 0; col < cols; col++ {
		selected := map[int]bool{}
		for row := 0; row < rows; row++ {
			for {
				randomIndex := getRandomNumber(0, len(reel)-1, rng)
				if !selected[randomIndex] {
					selected[randomIndex] = true
					result[row] = append(result[row], reel[randomIndex])
					break
				}
			}
		}
	}

	return result
}
