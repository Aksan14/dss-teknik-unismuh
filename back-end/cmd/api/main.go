package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/unismuh/sipema/config"
	"github.com/unismuh/sipema/internal/handler"
	"github.com/unismuh/sipema/internal/repository"
	"github.com/unismuh/sipema/internal/service"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize dependencies
	graphqlRepo := repository.NewGraphQLRepository(cfg.GraphQLEndpoint)
	mahasiswaService := service.NewMahasiswaService(graphqlRepo).
		WithRedisCache(cfg.RedisAddr, cfg.RedisPassword, cfg.RedisDB, cfg.CacheTTL)
	mahasiswaHandler := handler.NewMahasiswaHandler(mahasiswaService, cfg)

	// Preload cache on startup (non-blocking)
	go mahasiswaService.PreloadCache(cfg.KodeFakultas, cfg.AngkatanFrom, cfg.AngkatanTo)

	// Start background cache refresh
	mahasiswaService.StartBackgroundRefresh(cfg.KodeFakultas, cfg.AngkatanFrom, cfg.AngkatanTo)

	// Setup router
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.Compress(5)) // Gzip compression level 5 (good balance)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-Requested-With"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// API Routes
	r.Route("/api/v1", func(r chi.Router) {
		// Mahasiswa endpoints
		r.Get("/mahasiswa", mahasiswaHandler.GetAll)
		r.Get("/mahasiswa/search", mahasiswaHandler.Search)
		r.Get("/mahasiswa/aktif", mahasiswaHandler.GetAktif)
		r.Get("/mahasiswa/tidak-aktif", mahasiswaHandler.GetTidakAktif)
		r.Get("/mahasiswa/alumni", mahasiswaHandler.GetAlumni)
		r.Get("/mahasiswa/berprestasi", mahasiswaHandler.GetBerprestasi)
		r.Get("/mahasiswa/beasiswa", mahasiswaHandler.GetBeasiswa)
		r.Get("/mahasiswa/angkatan/{angkatan}", mahasiswaHandler.GetByAngkatan)
		r.Get("/mahasiswa/{nim}/detail", mahasiswaHandler.GetDetailByNIM)
		r.Get("/mahasiswa/{nim}", mahasiswaHandler.GetByNIM)

		// Statistics
		r.Get("/stats", mahasiswaHandler.GetStats)

		// SAW Analysis
		r.Post("/analisis/saw", mahasiswaHandler.ProsesSAW)
	})

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = cfg.Port
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("GraphQL Endpoint: %s", cfg.GraphQLEndpoint)

	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
