package routes

import (
	"dss-unismuh/back-end/internal/handlers"

	"github.com/gorilla/mux"
)

// RegisterRoutes registers all API routes
func RegisterRoutes(r *mux.Router) {
	// Mahasiswa endpoints
	r.HandleFunc("/mahasiswa", handlers.GetMahasiswa).Methods("GET")
	r.HandleFunc("/mahasiswa", handlers.AddMahasiswa).Methods("POST")

	// Specific routes must come before {nim} parameterized route
	r.HandleFunc("/mahasiswa/aktif", handlers.GetMahasiswaAktif).Methods("GET")
	r.HandleFunc("/mahasiswa/tidak-aktif", handlers.GetMahasiswaTidakAktif).Methods("GET")
	r.HandleFunc("/mahasiswa/alumni", handlers.GetMahasiswaAlumni).Methods("GET")
	r.HandleFunc("/mahasiswa/berprestasi", handlers.GetMahasiswaBerprestasi).Methods("GET")
	r.HandleFunc("/mahasiswa/beasiswa", handlers.GetMahasiswaBeasiswa).Methods("GET")
	r.HandleFunc("/mahasiswa/prodi/{prodi}", handlers.GetMahasiswaByProdi).Methods("GET")
	r.HandleFunc("/mahasiswa/angkatan/{angkatan}", handlers.GetMahasiswaByAngkatan).Methods("GET")

	// Generic NIM route must come last
	r.HandleFunc("/mahasiswa/{nim}", handlers.GetMahasiswaByNIM).Methods("GET")

	// Stats and analysis endpoints
	r.HandleFunc("/stats", handlers.GetMahasiswaStats).Methods("GET")
	r.HandleFunc("/kriteria", handlers.GetKriteria).Methods("GET")
	r.HandleFunc("/bobot", handlers.GetBobot).Methods("GET")
	r.HandleFunc("/proses", handlers.ProsesSAW).Methods("POST")
}
