package main

import (
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
)

func main() {
	game := NewGame()
	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/game/start", game.handleStart)
	mux.HandleFunc("POST /api/game/spin", game.handleSpin)
	mux.HandleFunc("/", serveFrontend(filepath.Join("frontend", "dist")))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Sasank's Casino listening on http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, logRequests(mux)); err != nil {
		log.Fatal(err)
	}
}

func serveFrontend(distDir string) http.HandlerFunc {
	fileServer := http.FileServer(http.Dir(distDir))

	return func(w http.ResponseWriter, r *http.Request) {
		indexPath := filepath.Join(distDir, "index.html")
		if _, err := os.Stat(indexPath); err != nil {
			http.Error(w, "frontend build not found; run npm run build inside frontend", http.StatusServiceUnavailable)
			return
		}

		requestPath := path.Clean(r.URL.Path)
		requestPath = requestPath[1:]
		if requestPath == "." || requestPath == "" {
			http.ServeFile(w, r, indexPath)
			return
		}

		candidate := filepath.Join(distDir, requestPath)
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			fileServer.ServeHTTP(w, r)
			return
		}

		http.ServeFile(w, r, indexPath)
	}
}

func logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
