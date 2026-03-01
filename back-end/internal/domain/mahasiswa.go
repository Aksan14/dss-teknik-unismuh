package domain

// Mahasiswa represents the core student entity from GraphQL API
type Mahasiswa struct {
	NIM                     string  `json:"nim"`
	Nama                    string  `json:"nama"`
	IPK                     float64 `json:"ipk"`
	Angkatan                int     `json:"angkatan"`
	SKSTotal                int     `json:"sksTotal"`
	SKSDiambil              int     `json:"sksDiambil"`
	SKSLulus                int     `json:"sksLulus"`
	MatakuliahLulus         int     `json:"matakuliahLulus"`
	JumlahMatakuliahDiulang int     `json:"jumlahMatakuliahDiulang"`
	SKSMatakuliahDiulang    int     `json:"sksMatakuliahDiulang"`
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

// MahasiswaKategori represents student academic category
type MahasiswaKategori string

const (
	KategoriBerprestasi MahasiswaKategori = "Berprestasi"
	KategoriNormal      MahasiswaKategori = "Normal"
	KategoriBerisiko    MahasiswaKategori = "Berisiko"
)

// GetStatus determines student status based on SKS
func (m *Mahasiswa) GetStatus() MahasiswaStatus {
	if m.SKSLulus >= 144 {
		return StatusAlumni
	}
	if m.SKSLulus > 0 {
		return StatusAktif
	}
	return StatusTidakAktif
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
