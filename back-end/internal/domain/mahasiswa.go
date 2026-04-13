package domain

import "time"

// ProdiMapping maps kode prodi to nama prodi for Fakultas Teknik (04)
var ProdiMapping = map[string]string{
	"20201": "Elektro",
	"22202": "Pengairan",
	"23201": "Arsitektur",
	"55202": "Informatika",
	"35201": "Perencanaan Wilayah Dan Kota",
}

// SKSWajibPerJurusan defines the minimum SKS required for graduation per jurusan.
// Each program has different curriculum requirements.
var SKSWajibPerJurusan = map[string]int{
	"Elektro":                      150,
	"Pengairan":                     150,
	"Arsitektur":                    150,
	"Informatika":                   150,
	"Perencanaan Wilayah Dan Kota":  144,
}

// DefaultSKSWajib is the fallback SKS requirement if jurusan is not found
const DefaultSKSWajib = 144

// GetSKSWajib returns the minimum SKS required for graduation based on jurusan
func GetSKSWajib(jurusan string) int {
	if sks, ok := SKSWajibPerJurusan[jurusan]; ok {
		return sks
	}
	return DefaultSKSWajib
}

// Mahasiswa represents the core student entity from GraphQL API
type Mahasiswa struct {
	NIM                     string  `json:"nim"`
	Nama                    string  `json:"nama"`
	IPK                     float64 `json:"ipk"`
	Angkatan                int     `json:"angkatan"`
	SKSTotal                int     `json:"sksTotal"`
	SKSDiambil              int     `json:"sksDiambil"`
	SKSLulus                int     `json:"sksLulus"`
	SKSBerjalan             int     `json:"sksBerjalan"`     // SKS currently being taken - determines active status
	AktifTerakhirTa         string  `json:"aktifTerakhirTa"` // Last active academic period (e.g., "20252")
	MatakuliahLulus         int     `json:"matakuliahLulus"`
	JumlahMatakuliahDiulang int     `json:"jumlahMatakuliahDiulang"`
	SKSMatakuliahDiulang    int     `json:"sksMatakuliahDiulang"`
	Jurusan                 string  `json:"jurusan"`
	Lulus                   bool    `json:"lulus"` // Graduation status from API
}

// MahasiswaDetail represents the full student detail from GetMahasiswa query
type MahasiswaDetail struct {
	NIM                string `json:"nim"`
	KodeProdi          string `json:"kodeProdi"`
	Angkatan           int    `json:"angkatan"`
	Nama               string `json:"nama"`
	JenisKelamin       string `json:"jenisKelamin"`
	TempatLahir        string `json:"tempatLahir"`
	TanggalLahir       string `json:"tanggalLahir"`
	NIK                string `json:"nik"`
	HP                 string `json:"hp"`
	Email              string `json:"email"`
	SemesterAwal       string `json:"semesterAwal"`
	TahunAkademikLulus string `json:"tahunAkademikLulus"`
	TanggalLulus       string `json:"tanggalLulus"`
	Lulus              bool   `json:"lulus"`
	NoSeriIjazah       string `json:"noSeriIjazah"`
	MasaStudi          string `json:"masaStudi"`

	// Fields from mahasiswaInfo (more accurate IPK)
	IPKFromInfo            float64 `json:"-"` // IPK from mahasiswaInfo query
	TotalSksLulusFromInfo  int     `json:"-"` // Total SKS lulus from mahasiswaInfo
	JumlahSemesterFromInfo int     `json:"-"` // Jumlah semester from mahasiswaInfo
	SksBerjalanFromInfo    int     `json:"-"` // SKS berjalan from mahasiswaInfo (determines active status)

	Ayah           *OrangTua       `json:"ayah"`
	Ibu            *OrangTua       `json:"ibu"`
	Wali           *Wali           `json:"wali"`
	KHS            []KHSEntry      `json:"khs"`
	DosenPenasehat *DosenPenasehat `json:"dosenPenasehat"`
	Prodi          *Prodi          `json:"prodi"`
}

// OrangTua represents parent data (ayah/ibu)
type OrangTua struct {
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

// Wali represents guardian data
type Wali struct {
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

// KHSEntry represents a semester academic record
type KHSEntry struct {
	TahunAkademik           string  `json:"tahunAkademik"`
	TotalSksLulus           int     `json:"totalSksLulus"`
	IPS                     float64 `json:"ips"`
	IPK                     float64 `json:"ipk"`
	StatusKelulusan         string  `json:"statusKelulusan"`
	JumlahMatakuliah        int     `json:"jumlahMatakuliah"`
	SksDiambil              int     `json:"sksDiambil"`
	SksLulus                int     `json:"sksLulus"`
	MatakuliahLulus         int     `json:"matakuliahLulus"`
	JumlahMatakuliahDiulang int     `json:"jumlahMatakuliahDiulang"`
	SksMatakuliahDiulang    int     `json:"sksMatakuliahDiulang"`
}

// DosenPenasehat represents academic advisor
type DosenPenasehat struct {
	NIDN          string `json:"nidn"`
	Nama          string `json:"nama"`
	GelarDepan    string `json:"gelar_depan"`
	GelarBelakang string `json:"gelar_belakang"`
	Email         string `json:"email"`
	ProdiID       string `json:"prodiId"`
}

// Prodi represents study program
type Prodi struct {
	ID           int    `json:"id"`
	KodeFakultas string `json:"kodeFakultas"`
	KodeProdi    string `json:"kodeProdi"`
	NamaProdi    string `json:"namaProdi"`
	NamaProdiEng string `json:"namaProdiEng"`
	StatusProdi  string `json:"statusProdi"`
	EmailProdi   string `json:"emailProdi"`
	KodeNim      string `json:"kodeNim"`
	GelarPendek  string `json:"gelarPendek"`
	GelarPanjang string `json:"gelarPanjang"`
	GelarEng     string `json:"gelarEng"`
}

// MahasiswaStatus represents categorized student status
type MahasiswaStatus string

const (
	StatusAktif      MahasiswaStatus = "Aktif"
	StatusTidakAktif MahasiswaStatus = "Tidak Aktif"
	StatusAlumni     MahasiswaStatus = "Alumni"
)

// SubStatusTidakAktif represents sub-categories for inactive students
type SubStatusTidakAktif string

const (
	SubStatusTidakKRS  SubStatusTidakAktif = "Tidak KRS"  // Not registered for courses
	SubStatusSudahMauDO SubStatusTidakAktif = "Sudah Mau DO" // Approaching dropout deadline
)

// MahasiswaKategori represents student academic category
type MahasiswaKategori string

const (
	KategoriBerprestasi MahasiswaKategori = "Berprestasi"
	KategoriNormal      MahasiswaKategori = "Normal"
	KategoriBerisiko    MahasiswaKategori = "Berisiko"
)

// GetStatus determines student status based on Lulus flag, SKSLulus, jurusan threshold, and minimum study duration
// - Alumni: Lulus == true OR (SKSLulus >= SKS wajib jurusan AND has studied for at least 3 years)
// - Aktif: SKSBerjalan > 0 (currently taking courses)
// - Tidak Aktif: SKSBerjalan == 0 (not taking any courses)
func (m *Mahasiswa) GetStatus() MahasiswaStatus {
	// If API explicitly says graduated, trust it
	if m.Lulus {
		return StatusAlumni
	}
	currentYear := time.Now().Year()
	masaStudi := currentYear - m.Angkatan
	sksWajib := GetSKSWajib(m.Jurusan)
	if m.SKSLulus >= sksWajib && masaStudi >= 3 {
		return StatusAlumni
	}
	if m.SKSBerjalan > 0 {
		return StatusAktif
	}
	return StatusTidakAktif
}

// GetSubStatus determines sub-status for inactive students
// - Tidak KRS: just not registered for courses this semester
// - Sudah Mau DO: approaching dropout deadline (angkatan + 7 years)
func (m *Mahasiswa) GetSubStatus(currentYear int) SubStatusTidakAktif {
	if m.GetStatus() != StatusTidakAktif {
		return "" // Only applicable for inactive students
	}

	// Maximum study duration is 7 years
	batasKelulusan := m.Angkatan + 7

	// If within 1 year of deadline or past it, mark as "Sudah Mau DO"
	if currentYear >= batasKelulusan-1 {
		return SubStatusSudahMauDO
	}

	// Otherwise just "Tidak KRS"
	return SubStatusTidakKRS
}

// GetKategori determines student category based on IPK
func (m *Mahasiswa) GetKategori() MahasiswaKategori {
	if m.IPK >= 3.5 {
		return KategoriBerprestasi
	}
	if m.IPK >= 2.0 {
		return KategoriNormal
	}
	return KategoriBerisiko
}

// IsAktif checks if student is active
func (m *Mahasiswa) IsAktif() bool {
	return m.GetStatus() == StatusAktif
}

// IsAlumni checks if student is alumni
func (m *Mahasiswa) IsAlumni() bool {
	return m.GetStatus() == StatusAlumni
}

// IsBerprestasi checks if student has high achievement
func (m *Mahasiswa) IsBerprestasi() bool {
	return m.IPK >= 3.5
}

// IsEligibleBeasiswa checks if student is eligible for scholarship
func (m *Mahasiswa) IsEligibleBeasiswa() bool {
	return m.IPK >= 3.0 && m.SKSLulus > 0
}
