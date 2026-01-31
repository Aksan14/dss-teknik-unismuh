package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"dss-unismuh/back-end/internal/models"

	"github.com/gorilla/mux"
)

// GetMahasiswa returns all students
func GetMahasiswa(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.MahasiswaList)
}

// AddMahasiswa adds a new student
func AddMahasiswa(w http.ResponseWriter, r *http.Request) {
	var m models.Mahasiswa
	json.NewDecoder(r.Body).Decode(&m)
	m.ID = len(models.MahasiswaList) + 1
	models.MahasiswaList = append(models.MahasiswaList, m)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(m)
}

// GetKriteria returns all criteria
func GetKriteria(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.KriteriaList)
}

// GetBobot returns all bobot/weights
func GetBobot(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.BobotList)
}

// ProsesSAW processes SAW analysis
func ProsesSAW(w http.ResponseWriter, r *http.Request) {
	var hasil []models.HasilSAW

	if len(models.MahasiswaList) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode([]models.HasilSAW{})
		return
	}

	for _, m := range models.MahasiswaList {
		rIPK := m.IPK / 4.0                 // max IPK 4.0
		rKehadiran := m.Kehadiran / 100.0   // max kehadiran 100%
		rSKS := float64(m.SKSLulus) / 144.0 // max SKS 144
		rMK := 1.0                          // default value jika 0
		if m.MKMengulang > 0 {
			rMK = 1.0 / float64(m.MKMengulang) // inverse score untuk cost criterion
		}
		rLama := 7.0 / float64(m.LamaStudi) // min lama 7

		nilai := rIPK*0.30 + rKehadiran*0.20 + rSKS*0.20 + rMK*0.15 + rLama*0.15

		kategori := "Berisiko"
		if nilai >= 0.80 {
			kategori = "Berprestasi"
		} else if nilai >= 0.60 {
			kategori = "Normal"
		}

		hasil = append(hasil, models.HasilSAW{m, nilai, kategori})
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(hasil)
}

// GetMahasiswaByNIM returns student by NIM
func GetMahasiswaByNIM(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	nim := vars["nim"]

	for _, m := range models.MahasiswaList {
		if m.NIM == nim {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(m)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(map[string]string{"error": "Mahasiswa tidak ditemukan"})
}

// GetMahasiswaAktif returns all active students
func GetMahasiswaAktif(w http.ResponseWriter, r *http.Request) {
	var result []models.Mahasiswa
	for _, m := range models.MahasiswaList {
		if m.Status == "Aktif" {
			result = append(result, m)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetMahasiswaTidakAktif returns all inactive students
func GetMahasiswaTidakAktif(w http.ResponseWriter, r *http.Request) {
	var result []models.Mahasiswa
	for _, m := range models.MahasiswaList {
		if m.Status != "Aktif" && m.Status != "Alumni" {
			result = append(result, m)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetMahasiswaAlumni returns all alumni
func GetMahasiswaAlumni(w http.ResponseWriter, r *http.Request) {
	var result []models.Mahasiswa
	for _, m := range models.MahasiswaList {
		if m.Status == "Alumni" {
			result = append(result, m)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetMahasiswaByProdi returns students by program
func GetMahasiswaByProdi(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	prodi := vars["prodi"]

	var result []models.Mahasiswa
	for _, m := range models.MahasiswaList {
		if m.Jurusan == prodi {
			result = append(result, m)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetMahasiswaByAngkatan returns students by year/angkatan
func GetMahasiswaByAngkatan(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	angkatanStr := vars["angkatan"]

	angkatan, err := strconv.Atoi(angkatanStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid angkatan"})
		return
	}

	var result []models.Mahasiswa
	for _, m := range models.MahasiswaList {
		if m.Angkatan == angkatan {
			result = append(result, m)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetMahasiswaBerprestasi returns students with achievements
func GetMahasiswaBerprestasi(w http.ResponseWriter, r *http.Request) {
	var result []models.Mahasiswa
	for _, m := range models.MahasiswaList {
		if m.Prestasi != "" {
			result = append(result, m)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetMahasiswaBeasiswa returns students with scholarship
func GetMahasiswaBeasiswa(w http.ResponseWriter, r *http.Request) {
	var result []models.Mahasiswa
	for _, m := range models.MahasiswaList {
		if m.Beasiswa != "" && m.Beasiswa != "Tidak Ada" {
			result = append(result, m)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetMahasiswaStats returns student statistics
func GetMahasiswaStats(w http.ResponseWriter, r *http.Request) {
	stats := models.Stats{}
	for _, m := range models.MahasiswaList {
		stats.TotalMahasiswa++
		if m.Status == "Aktif" {
			stats.MahasiswaAktif++
		} else if m.Status == "Alumni" {
			stats.Alumni++
		} else {
			stats.MahasiswaTidakAktif++
		}
		if m.Prestasi != "" {
			stats.Berprestasi++
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
