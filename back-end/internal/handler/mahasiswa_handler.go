package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/unismuh/sipema/config"
	"github.com/unismuh/sipema/internal/dto"
	"github.com/unismuh/sipema/internal/service"
)

// MahasiswaHandler handles HTTP requests for students
type MahasiswaHandler struct {
	service *service.MahasiswaService
	config  *config.Config
}

// NewMahasiswaHandler creates a new MahasiswaHandler
func NewMahasiswaHandler(svc *service.MahasiswaService, cfg *config.Config) *MahasiswaHandler {
	return &MahasiswaHandler{
		service: svc,
		config:  cfg,
	}
}

// respondJSON sends a JSON response with cache headers
func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "public, max-age=300") // Browser cache 5 min
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// respondError sends an error response
func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, dto.ErrorResponse{
		Error:   http.StatusText(status),
		Message: message,
	})
}

// GetAll returns all students with pagination
func (h *MahasiswaHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))

	if limit <= 0 {
		limit = 10000
	}

	result, err := h.service.GetAll(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
		limit,
		offset,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, result)
}

// Search searches students by name or NIM
func (h *MahasiswaHandler) Search(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		respondError(w, http.StatusBadRequest, "parameter q diperlukan")
		return
	}

	result, err := h.service.Search(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
		query,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"data":  result,
		"total": len(result),
	})
}

// GetAktif returns active students
func (h *MahasiswaHandler) GetAktif(w http.ResponseWriter, r *http.Request) {
	result, err := h.service.GetAktif(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"data":  result,
		"total": len(result),
	})
}

// GetTidakAktif returns inactive students
func (h *MahasiswaHandler) GetTidakAktif(w http.ResponseWriter, r *http.Request) {
	result, err := h.service.GetTidakAktif(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"data":  result,
		"total": len(result),
	})
}

// GetAlumni returns alumni students
func (h *MahasiswaHandler) GetAlumni(w http.ResponseWriter, r *http.Request) {
	result, err := h.service.GetAlumni(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"data":  result,
		"total": len(result),
	})
}

// GetBerprestasi returns high-achieving students
func (h *MahasiswaHandler) GetBerprestasi(w http.ResponseWriter, r *http.Request) {
	result, err := h.service.GetBerprestasi(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"data":  result,
		"total": len(result),
	})
}

// GetBeasiswa returns scholarship-eligible students
func (h *MahasiswaHandler) GetBeasiswa(w http.ResponseWriter, r *http.Request) {
	result, err := h.service.GetBeasiswa(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"data":  result,
		"total": len(result),
	})
}

// GetByAngkatan returns students by year
func (h *MahasiswaHandler) GetByAngkatan(w http.ResponseWriter, r *http.Request) {
	angkatanStr := chi.URLParam(r, "angkatan")
	angkatan, err := strconv.Atoi(angkatanStr)
	if err != nil {
		respondError(w, http.StatusBadRequest, "angkatan harus berupa angka")
		return
	}

	result, err := h.service.GetByAngkatan(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
		angkatan,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"data":     result,
		"total":    len(result),
		"angkatan": angkatan,
	})
}

// GetByNIM returns a student by NIM
func (h *MahasiswaHandler) GetByNIM(w http.ResponseWriter, r *http.Request) {
	nim := chi.URLParam(r, "nim")
	if nim == "" {
		respondError(w, http.StatusBadRequest, "NIM diperlukan")
		return
	}

	result, err := h.service.GetByNIM(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
		nim,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	if result == nil {
		respondError(w, http.StatusNotFound, "Mahasiswa tidak ditemukan")
		return
	}

	respondJSON(w, http.StatusOK, result)
}

// GetDetailByNIM returns full student detail by NIM (using full GraphQL query)
func (h *MahasiswaHandler) GetDetailByNIM(w http.ResponseWriter, r *http.Request) {
	nim := chi.URLParam(r, "nim")
	if nim == "" {
		respondError(w, http.StatusBadRequest, "NIM diperlukan")
		return
	}

	result, err := h.service.GetDetailByNIM(nim)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	if result == nil {
		respondError(w, http.StatusNotFound, "Mahasiswa tidak ditemukan")
		return
	}

	respondJSON(w, http.StatusOK, result)
}

// GetStats returns student statistics
func (h *MahasiswaHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	result, err := h.service.GetStats(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, result)
}

// ProsesSAW performs SAW analysis
func (h *MahasiswaHandler) ProsesSAW(w http.ResponseWriter, r *http.Request) {
	result, err := h.service.ProsesSAW(
		h.config.KodeFakultas,
		h.config.AngkatanFrom,
		h.config.AngkatanTo,
	)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"data":  result,
		"total": len(result),
	})
}
