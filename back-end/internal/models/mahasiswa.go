package models

// MahasiswaAPI represents student data from the external GraphQL API
type MahasiswaAPI struct {
	Angkatan                int     `json:"angkatan"`
	NIM                     string  `json:"nim"`
	Nama                    string  `json:"nama"`
	TempatLahir             string  `json:"tempat_lahir"`
	TanggalLahir            string  `json:"tanggal_lahir"`
	SKSTotal                int     `json:"sks_total"`
	SKSDiambil              int     `json:"sks_diambil"`
	IPS                     float64 `json:"ips"`
	IPK                     float64 `json:"ipk"`
	SemesterAktif           int     `json:"semester_aktif"`
	SKSLulus                int     `json:"sks_lulus"`
	MatakuliahLulus         int     `json:"matakuliah_lulus"`
	JumlahMatakuliahDiulang int     `json:"jumlah_matakuliah_diulang"`
	SKSMatakuliahDiulang    int     `json:"sks_matakuliah_diulang"`
	// Computed fields
	Status   string `json:"status"`
	Kategori string `json:"kategori"`
}

// Mahasiswa represents a student record (legacy for compatibility)
type Mahasiswa struct {
	ID               int    `json:"id"`
	NIM              string `json:"nim"`
	Nama             string `json:"nama"`
	TempatLahir      string `json:"tempat_lahir"`
	TanggalLahir     string `json:"tanggal_lahir"`
	JenisKelamin     string `json:"jenis_kelamin"`
	NoKTP            string `json:"no_ktp"`
	StatusPernikahan string `json:"status_pernikahan"`
	Agama            string `json:"agama"`
	JumlahSaudara    int    `json:"jumlah_saudara"`
	AnakKe           int    `json:"anak_ke"`
	SukuBangsa       string `json:"suku_bangsa"`
	Kewarganegaraan  string `json:"kewarganegaraan"`
	// Alamat Sekarang
	ProvinsiSekarang  string  `json:"provinsi_sekarang"`
	KabupatenSekarang string  `json:"kabupaten_sekarang"`
	KecamatanSekarang string  `json:"kecamatan_sekarang"`
	DesaSekarang      string  `json:"desa_sekarang"`
	AlamatSekarang    string  `json:"alamat_sekarang"`
	JarakKampus       float64 `json:"jarak_kampus"`
	KendaraanKampus   string  `json:"kendaraan_kampus"`
	Telp              string  `json:"telp"`
	HP                string  `json:"hp"`
	Email             string  `json:"email"`
	// Alamat Daerah
	ProvinsiDaerah  string `json:"provinsi_daerah"`
	KabupatenDaerah string `json:"kabupaten_daerah"`
	KecamatanDaerah string `json:"kecamatan_daerah"`
	DesaDaerah      string `json:"desa_daerah"`
	AlamatDaerah    string `json:"alamat_daerah"`
	// Biodata Ayah
	NamaAyah        string `json:"nama_ayah"`
	AgamaAyah       string `json:"agama_ayah"`
	PendidikanAyah  string `json:"pendidikan_ayah"`
	PekerjaanAyah   string `json:"pekerjaan_ayah"`
	PenghasilanAyah string `json:"penghasilan_ayah"`
	StatusAyah      string `json:"status_ayah"`
	AlamatAyah      string `json:"alamat_ayah"`
	TeleponAyah     string `json:"telepon_ayah"`
	HPAyah          string `json:"hp_ayah"`
	// Biodata Ibu
	NamaIbu        string `json:"nama_ibu"`
	AgamaIbu       string `json:"agama_ibu"`
	PendidikanIbu  string `json:"pendidikan_ibu"`
	PekerjaanIbu   string `json:"pekerjaan_ibu"`
	PenghasilanIbu string `json:"penghasilan_ibu"`
	StatusIbu      string `json:"status_ibu"`
	AlamatIbu      string `json:"alamat_ibu"`
	TeleponIbu     string `json:"telepon_ibu"`
	HPIbu          string `json:"hp_ibu"`
	// Kontak Utama
	KontakUtama string `json:"kontak_utama"`
	// Pendidikan
	SDAsal  string `json:"sd_asal"`
	SMPAsal string `json:"smp_asal"`
	SMAAsal string `json:"sma_asal"`
	// Sumber Biaya
	SumberBiaya string `json:"sumber_biaya"`
	// Data Akademik untuk SAW
	IPK         float64 `json:"ipk"`
	Kehadiran   float64 `json:"kehadiran"`
	SKSLulus    int     `json:"sks_lulus"`
	MKMengulang int     `json:"mk_mengulang"`
	LamaStudi   int     `json:"lama_studi"`
	// Field tambahan untuk frontend
	Jurusan       string  `json:"jurusan"`
	Angkatan      int     `json:"angkatan"`
	Semester      int     `json:"semester"`
	Status        string  `json:"status"`
	Prestasi      string  `json:"prestasi"`
	Beasiswa      string  `json:"beasiswa"`
	BeasiswaLuar  string  `json:"beasiswa_luar"`
	KIPK          float64 `json:"kipk"`
	Keterangan    string  `json:"keterangan"`
	SKSBelumLulus int     `json:"sks_belum_lulus"`
}

// Kriteria represents a criteria for SAW analysis
type Kriteria struct {
	Nama  string `json:"nama"`
	Jenis string `json:"jenis"` // "benefit" or "cost"
}

// Bobot represents the weight/bobot for each criteria
type Bobot struct {
	Nama  string  `json:"nama"`
	Bobot float64 `json:"bobot"`
}

// HasilSAW represents the result of SAW analysis
type HasilSAW struct {
	Mahasiswa Mahasiswa `json:"mahasiswa"`
	Nilai     float64   `json:"nilai"`
	Kategori  string    `json:"kategori"`
}

// HasilSAWAPI represents the result of SAW analysis for API data
type HasilSAWAPI struct {
	Mahasiswa MahasiswaAPI `json:"mahasiswa"`
	Nilai     float64      `json:"nilai"`
	Kategori  string       `json:"kategori"`
}

// Stats represents student statistics
type Stats struct {
	TotalMahasiswa      int `json:"total_mahasiswa"`
	MahasiswaAktif      int `json:"mahasiswa_aktif"`
	MahasiswaTidakAktif int `json:"mahasiswa_tidak_aktif"`
	Berprestasi         int `json:"berprestasi"`
	Alumni              int `json:"alumni"`
}

// StatsAPI represents student statistics from API
type StatsAPI struct {
	TotalMahasiswa      int         `json:"total_mahasiswa"`
	MahasiswaAktif      int         `json:"mahasiswa_aktif"`
	MahasiswaTidakAktif int         `json:"mahasiswa_tidak_aktif"`
	Alumni              int         `json:"alumni"`
	Berprestasi         int         `json:"berprestasi"`
	PerAngkatan         map[int]int `json:"per_angkatan"`
	RataRataIPK         float64     `json:"rata_rata_ipk"`
}

// PaginationInfo contains pagination metadata
type PaginationInfo struct {
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
	Total  int `json:"total"`
}

// MahasiswaListResponse represents paginated list of mahasiswa
type MahasiswaListResponse struct {
	Data       []MahasiswaAPI `json:"data"`
	Pagination PaginationInfo `json:"pagination"`
}
