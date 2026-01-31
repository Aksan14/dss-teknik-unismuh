package main

import (
	"log"
	"net/http"

	"dss-unismuh/back-end/internal/routes"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	// Register all routes
	routes.RegisterRoutes(r)

	// Enable CORS
	corsObj := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
	)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", corsObj(r)))
}
