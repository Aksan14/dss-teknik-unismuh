package repository

import "github.com/unismuh/sipema/internal/domain"

// MahasiswaRepository defines the interface for student data access
type MahasiswaRepository interface {
	FetchMahasiswaAll(kodeFakultas string, angkatanFrom, angkatanTo, limit, offset int) ([]domain.Mahasiswa, error)
	FetchMahasiswaByNIM(nim string) (*domain.MahasiswaDetail, error)
}
