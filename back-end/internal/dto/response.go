package dto

import (
	"time"

	"github.com/unismuh/sipema/internal/domain"
)

// MahasiswaResponse represents the API response for a single student
type MahasiswaResponse struct {
	NIM                     string  `json:"nim"`
	Nama                    string  `json:"nama"`
	IPK                     float64 `json:"ipk"`
	Angkatan                int     `json:"angkatan"`
	SKSTotal                int     `json:"sks_total"`
	SKSDiambil              int     `json:"sks_diambil"`
	SKSLulus                int     `json:"sks_lulus"`
	MatakuliahLulus         int     `json:"matakuliah_lulus"`
	JumlahMatakuliahDiulang int     `json:"jumlah_mk_diulang"`
	SKSMatakuliahDiulang    int     `json:"sks_mk_diulang"`
	Status                  string  `json:"status"`
	SubStatus               string  `json:"sub_status,omitempty"` // Sub-status for inactive: "Tidak KRS" or "Sudah Mau DO"
	Kategori                string  `json:"kategori"`
	Jurusan                 string  `json:"jurusan"`
}

// MahasiswaListResponse represents paginated list response
type MahasiswaListResponse struct {
	Data       []MahasiswaResponse `json:"data"`
	Pagination PaginationResponse  `json:"pagination"`
}

// PaginationResponse represents pagination metadata
type PaginationResponse struct {
	Total  int `json:"total"`
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

// StatsResponse represents statistics response
type StatsResponse struct {
	TotalMahasiswa      int         `json:"total_mahasiswa"`
	MahasiswaAktif      int         `json:"mahasiswa_aktif"`
	MahasiswaTidakAktif int         `json:"mahasiswa_tidak_aktif"`
	Alumni              int         `json:"alumni"`
	Berprestasi         int         `json:"berprestasi"`
	RataRataIPK         float64     `json:"rata_rata_ipk"`
	PerAngkatan         map[int]int `json:"per_angkatan"`
}

// HasilSAWResponse represents SAW analysis result
type HasilSAWResponse struct {
	NIM                     string  `json:"nim"`
	Nama                    string  `json:"nama"`
	IPK                     float64 `json:"ipk"`
	SKSTotal                int     `json:"sks_total"`
	SKSDiambil              int     `json:"sks_diambil"`
	SKSLulus                int     `json:"sks_lulus"`
	MatakuliahLulus         int     `json:"matakuliah_lulus"`
	JumlahMatakuliahDiulang int     `json:"jumlah_mk_diulang"`
	SKSMatakuliahDiulang    int     `json:"sks_mk_diulang"`
	Angkatan                int     `json:"angkatan"`
	Nilai                   float64 `json:"nilai_saw"`
	Kategori                string  `json:"kategori"`
	Ranking                 int     `json:"ranking"`
	Jurusan                 string  `json:"jurusan"`
}

// ErrorResponse represents error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
	Code    int    `json:"code"`
}

// MahasiswaDetailResponse represents the full student detail API response
type MahasiswaDetailResponse struct {
	NIM                string `json:"nim"`
	KodeProdi          string `json:"kode_prodi"`
	Angkatan           int    `json:"angkatan"`
	Nama               string `json:"nama"`
	JenisKelamin       string `json:"jenis_kelamin"`
	TempatLahir        string `json:"tempat_lahir"`
	TanggalLahir       string `json:"tanggal_lahir"`
	NIK                string `json:"nik"`
	HP                 string `json:"hp"`
	Email              string `json:"email"`
	SemesterAwal       string `json:"semester_awal"`
	TahunAkademikLulus string `json:"tahun_akademik_lulus"`
	TanggalLulus       string `json:"tanggal_lulus"`
	Lulus              bool   `json:"lulus"`
	NoSeriIjazah       string `json:"no_seri_ijazah"`
	MasaStudi          string `json:"masa_studi"`
	Status             string `json:"status"`
	SubStatus          string `json:"sub_status,omitempty"` // Sub-status for inactive: "Tidak KRS" or "Sudah Mau DO"
	Kategori           string `json:"kategori"`

	Ayah           *OrangTuaResponse       `json:"ayah"`
	Ibu            *OrangTuaResponse       `json:"ibu"`
	Wali           *WaliResponse           `json:"wali"`
	KHS            []KHSResponse           `json:"khs"`
	DosenPenasehat *DosenPenasehatResponse `json:"dosen_penasehat"`
	Prodi          *ProdiResponse          `json:"prodi"`

	// Summary fields calculated from KHS
	IPK             float64 `json:"ipk"`
	SKSTotal        int     `json:"sks_total"`
	SKSDiambil      int     `json:"sks_diambil"`
	SKSLulus        int     `json:"sks_lulus"`
	MatakuliahLulus int     `json:"matakuliah_lulus"`
	JumlahMKDiulang int     `json:"jumlah_mk_diulang"`
	SKSMKDiulang    int     `json:"sks_mk_diulang"`

	// Computed Analysis Fields (calculated by backend)
	Analisis *AnalisisResponse `json:"analisis,omitempty"`
}

// MasalahResponse represents an academic problem
type MasalahResponse struct {
	Text     string `json:"text"`
	Severity string `json:"severity"` // high, medium, low
}

// TanyaJawabResponse represents Q&A about student
type TanyaJawabResponse struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
	Color    string `json:"color"` // green, blue, orange, red, gray
}

// IPSStatsResponse represents IPS statistics
type IPSStatsResponse struct {
	Average float64 `json:"average"`
	Max     float64 `json:"max"`
	Min     float64 `json:"min"`
	Last    float64 `json:"last"`
	Trend   string  `json:"trend"` // up, down, stable
}

// AnalisisResponse represents all computed analysis for a student
type AnalisisResponse struct {
	// Progress & Efficiency
	ProgressSKS      float64 `json:"progress_sks"`      // Percentage 0-100
	Efisiensi        float64 `json:"efisiensi"`         // Percentage 0-100
	RasioUlang       float64 `json:"rasio_ulang"`       // Percentage of repeated courses
	TahunStudi       int     `json:"tahun_studi"`       // Years since enrollment
	SemesterAktif    int     `json:"semester_aktif"`    // Active semesters count
	SKSPerSemester   float64 `json:"sks_per_semester"`  // Average SKS per semester
	MKLulusPerSem    float64 `json:"mk_lulus_per_sem"`  // Average MK passed per semester
	TingkatKelulusan float64 `json:"tingkat_kelulusan"` // Pass rate percentage

	// SKS Per Semester Type (Ganjil/Genap)
	SKSGanjil int `json:"sks_ganjil"` // Total SKS in odd semesters
	SKSGenap  int `json:"sks_genap"`  // Total SKS in even semesters

	// IPS Statistics
	IPSStats IPSStatsResponse `json:"ips_stats"`

	// Predictions
	EstimasiLulus      string `json:"estimasi_lulus"`       // e.g., "~2 semester lagi"
	EstimasiBulanTahun string `json:"estimasi_bulan_tahun"` // e.g., "Juni 2025"
	SemesterSisa       int    `json:"semester_sisa"`        // Estimated semesters remaining
	SKSSisa            int    `json:"sks_sisa"`             // Remaining SKS
	SKSPerSemIdeal     int    `json:"sks_per_sem_ideal"`    // SKS needed per sem for on-time graduation

	// Health Score (0-100)
	SkorAkademik      int    `json:"skor_akademik"`
	SkorAkademikLabel string `json:"skor_akademik_label"` // Sangat Baik, Baik, Cukup, Kurang, Kritis

	// SAW Analysis
	NilaiSAW float64 `json:"nilai_saw"`

	// Status Flags
	IsOnTrack    bool `json:"is_on_track"`    // On track for 4-year graduation
	RiskDO       bool `json:"risk_do"`        // At risk of dropout
	BisaCumLaude bool `json:"bisa_cum_laude"` // Can achieve cum laude

	// Problems, Achievements, Recommendations
	Masalah     []MasalahResponse    `json:"masalah"`
	Prestasi    []string             `json:"prestasi"`
	Rekomendasi []string             `json:"rekomendasi"`
	TanyaJawab  []TanyaJawabResponse `json:"tanya_jawab"`
}

// OrangTuaResponse represents parent data
type OrangTuaResponse struct {
	NIM         string `json:"nim"`
	NIK         string `json:"nik"`
	Nama        string `json:"nama"`
	Alamat      string `json:"alamat"`
	HP          string `json:"hp"`
	Email       string `json:"email"`
	Pendidikan  string `json:"pendidikan"`
	Pekerjaan   string `json:"pekerjaan"`
	Instansi    string `json:"instansi"`
	Jabatan     string `json:"jabatan"`
	Penghasilan string `json:"penghasilan"`
	Status      string `json:"status"`
}

// WaliResponse represents guardian data
type WaliResponse struct {
	NIM         string `json:"nim"`
	Nama        string `json:"nama"`
	Alamat      string `json:"alamat"`
	HP          string `json:"hp"`
	Email       string `json:"email"`
	Pendidikan  string `json:"pendidikan"`
	Pekerjaan   string `json:"pekerjaan"`
	Instansi    string `json:"instansi"`
	Jabatan     string `json:"jabatan"`
	Penghasilan string `json:"penghasilan"`
}

// KHSResponse represents a semester academic record
type KHSResponse struct {
	TahunAkademik           string  `json:"tahun_akademik"`
	TotalSksLulus           int     `json:"total_sks_lulus"`
	IPS                     float64 `json:"ips"`
	IPK                     float64 `json:"ipk"`
	StatusKelulusan         string  `json:"status_kelulusan"`
	JumlahMatakuliah        int     `json:"jumlah_matakuliah"`
	SksDiambil              int     `json:"sks_diambil"`
	SksLulus                int     `json:"sks_lulus"`
	MatakuliahLulus         int     `json:"matakuliah_lulus"`
	JumlahMatakuliahDiulang int     `json:"jumlah_mk_diulang"`
	SksMatakuliahDiulang    int     `json:"sks_mk_diulang"`
}

// DosenPenasehatResponse represents academic advisor
type DosenPenasehatResponse struct {
	NIDN          string `json:"nidn"`
	Nama          string `json:"nama"`
	GelarDepan    string `json:"gelar_depan"`
	GelarBelakang string `json:"gelar_belakang"`
	Email         string `json:"email"`
	ProdiID       string `json:"prodi_id"`
}

// ProdiResponse represents study program
type ProdiResponse struct {
	ID           int    `json:"id"`
	KodeFakultas string `json:"kode_fakultas"`
	KodeProdi    string `json:"kode_prodi"`
	NamaProdi    string `json:"nama_prodi"`
	NamaProdiEng string `json:"nama_prodi_eng"`
	StatusProdi  string `json:"status_prodi"`
	EmailProdi   string `json:"email_prodi"`
	KodeNim      string `json:"kode_nim"`
	GelarPendek  string `json:"gelar_pendek"`
	GelarPanjang string `json:"gelar_panjang"`
	GelarEng     string `json:"gelar_eng"`
}

// FromDetailDomain converts MahasiswaDetail domain model to DTO
func FromDetailDomain(d *domain.MahasiswaDetail) *MahasiswaDetailResponse {
	if d == nil {
		return nil
	}

	resp := &MahasiswaDetailResponse{
		NIM:                d.NIM,
		KodeProdi:          d.KodeProdi,
		Angkatan:           d.Angkatan,
		Nama:               d.Nama,
		JenisKelamin:       d.JenisKelamin,
		TempatLahir:        d.TempatLahir,
		TanggalLahir:       d.TanggalLahir,
		NIK:                d.NIK,
		HP:                 d.HP,
		Email:              d.Email,
		SemesterAwal:       d.SemesterAwal,
		TahunAkademikLulus: d.TahunAkademikLulus,
		TanggalLulus:       d.TanggalLulus,
		Lulus:              d.Lulus,
		NoSeriIjazah:       d.NoSeriIjazah,
		MasaStudi:          d.MasaStudi,
	}

	// Use IPK from mahasiswaInfo (more accurate)
	if d.IPKFromInfo > 0 {
		resp.IPK = d.IPKFromInfo
	}

	// Use SKS lulus from mahasiswaInfo if available
	if d.TotalSksLulusFromInfo > 0 {
		resp.SKSLulus = d.TotalSksLulusFromInfo
	}

	// Calculate summary from KHS
	if len(d.KHS) > 0 {
		// Only use KHS IPK if mahasiswaInfo IPK not available
		if resp.IPK == 0 {
			lastKHS := d.KHS[len(d.KHS)-1]
			resp.IPK = lastKHS.IPK
		}
		// Only use KHS SKS lulus if mahasiswaInfo not available
		if resp.SKSLulus == 0 {
			lastKHS := d.KHS[len(d.KHS)-1]
			resp.SKSLulus = lastKHS.TotalSksLulus
		}

		// Sum across all semesters
		for _, k := range d.KHS {
			resp.SKSDiambil += k.SksDiambil
			resp.MatakuliahLulus += k.MatakuliahLulus
			resp.JumlahMKDiulang += k.JumlahMatakuliahDiulang
			resp.SKSMKDiulang += k.SksMatakuliahDiulang
		}
		resp.SKSTotal = resp.SKSDiambil
	}

	// Determine status based on sksBerjalan from mahasiswaInfo
	// - Alumni: lulus == true
	// - Aktif: sksBerjalan > 0 (currently taking courses)
	// - Tidak Aktif: sksBerjalan == 0 (not taking any courses)
	currentYear := time.Now().Year()
	if d.Lulus {
		resp.Status = "Alumni"
	} else if d.SksBerjalanFromInfo > 0 {
		resp.Status = "Aktif"
	} else {
		resp.Status = "Tidak Aktif"
		// Determine sub-status for inactive students
		batasKelulusan := d.Angkatan + 7
		if currentYear >= batasKelulusan-1 {
			resp.SubStatus = string(domain.SubStatusSudahMauDO)
		} else {
			resp.SubStatus = string(domain.SubStatusTidakKRS)
		}
	}

	// Determine kategori based on IPK
	if resp.IPK >= 3.5 {
		resp.Kategori = "Berprestasi"
	} else if resp.IPK >= 2.0 {
		resp.Kategori = "Normal"
	} else {
		resp.Kategori = "Berisiko"
	}

	// Convert Ayah
	if d.Ayah != nil {
		resp.Ayah = &OrangTuaResponse{
			NIM: d.Ayah.NIM, NIK: d.Ayah.NIK, Nama: d.Ayah.Nama,
			Alamat: d.Ayah.Alamat, HP: d.Ayah.HP, Email: d.Ayah.Email,
			Pendidikan: d.Ayah.Pendidikan, Pekerjaan: d.Ayah.Pekerjaan,
			Instansi: d.Ayah.Instansi, Jabatan: d.Ayah.Jabatan,
			Penghasilan: d.Ayah.Penghasilan, Status: d.Ayah.Status,
		}
	}

	// Convert Ibu
	if d.Ibu != nil {
		resp.Ibu = &OrangTuaResponse{
			NIM: d.Ibu.NIM, NIK: d.Ibu.NIK, Nama: d.Ibu.Nama,
			Alamat: d.Ibu.Alamat, HP: d.Ibu.HP, Email: d.Ibu.Email,
			Pendidikan: d.Ibu.Pendidikan, Pekerjaan: d.Ibu.Pekerjaan,
			Instansi: d.Ibu.Instansi, Jabatan: d.Ibu.Jabatan,
			Penghasilan: d.Ibu.Penghasilan, Status: d.Ibu.Status,
		}
	}

	// Convert Wali
	if d.Wali != nil {
		resp.Wali = &WaliResponse{
			NIM: d.Wali.NIM, Nama: d.Wali.Nama,
			Alamat: d.Wali.Alamat, HP: d.Wali.HP, Email: d.Wali.Email,
			Pendidikan: d.Wali.Pendidikan, Pekerjaan: d.Wali.Pekerjaan,
			Instansi: d.Wali.Instansi, Jabatan: d.Wali.Jabatan,
			Penghasilan: d.Wali.Penghasilan,
		}
	}

	// Convert KHS
	resp.KHS = make([]KHSResponse, len(d.KHS))
	for i, k := range d.KHS {
		resp.KHS[i] = KHSResponse{
			TahunAkademik: k.TahunAkademik, TotalSksLulus: k.TotalSksLulus,
			IPS: k.IPS, IPK: k.IPK, StatusKelulusan: k.StatusKelulusan,
			JumlahMatakuliah: k.JumlahMatakuliah, SksDiambil: k.SksDiambil,
			SksLulus: k.SksLulus, MatakuliahLulus: k.MatakuliahLulus,
			JumlahMatakuliahDiulang: k.JumlahMatakuliahDiulang,
			SksMatakuliahDiulang:    k.SksMatakuliahDiulang,
		}
	}

	// Convert DosenPenasehat
	if d.DosenPenasehat != nil {
		resp.DosenPenasehat = &DosenPenasehatResponse{
			NIDN: d.DosenPenasehat.NIDN, Nama: d.DosenPenasehat.Nama,
			GelarDepan:    d.DosenPenasehat.GelarDepan,
			GelarBelakang: d.DosenPenasehat.GelarBelakang,
			Email:         d.DosenPenasehat.Email, ProdiID: d.DosenPenasehat.ProdiID,
		}
	}

	// Convert Prodi
	if d.Prodi != nil {
		resp.Prodi = &ProdiResponse{
			ID: d.Prodi.ID, KodeFakultas: d.Prodi.KodeFakultas,
			KodeProdi: d.Prodi.KodeProdi, NamaProdi: d.Prodi.NamaProdi,
			NamaProdiEng: d.Prodi.NamaProdiEng, StatusProdi: d.Prodi.StatusProdi,
			EmailProdi: d.Prodi.EmailProdi, KodeNim: d.Prodi.KodeNim,
			GelarPendek: d.Prodi.GelarPendek, GelarPanjang: d.Prodi.GelarPanjang,
			GelarEng: d.Prodi.GelarEng,
		}
	}

	return resp
}

// FromDomain converts domain model to DTO
func FromDomain(m *domain.Mahasiswa) MahasiswaResponse {
	currentYear := time.Now().Year()
	status := m.GetStatus()
	subStatus := ""
	if status == domain.StatusTidakAktif {
		subStatus = string(m.GetSubStatus(currentYear))
	}

	return MahasiswaResponse{
		NIM:                     m.NIM,
		Nama:                    m.Nama,
		IPK:                     m.IPK,
		Angkatan:                m.Angkatan,
		SKSTotal:                m.SKSTotal,
		SKSDiambil:              m.SKSDiambil,
		SKSLulus:                m.SKSLulus,
		MatakuliahLulus:         m.MatakuliahLulus,
		JumlahMatakuliahDiulang: m.JumlahMatakuliahDiulang,
		SKSMatakuliahDiulang:    m.SKSMatakuliahDiulang,
		Status:                  string(status),
		SubStatus:               subStatus,
		Kategori:                string(m.GetKategori()),
		Jurusan:                 m.Jurusan,
	}
}

// FromDomainList converts list of domain models to DTOs
func FromDomainList(mahasiswaList []domain.Mahasiswa) []MahasiswaResponse {
	result := make([]MahasiswaResponse, len(mahasiswaList))
	for i, m := range mahasiswaList {
		result[i] = FromDomain(&m)
	}
	return result
}
