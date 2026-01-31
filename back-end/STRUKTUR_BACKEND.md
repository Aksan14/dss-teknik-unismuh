# Backend - Sistem Pelacakan Mahasiswa UNISMUH

## Struktur Proyek

Backend telah diorganisir dengan struktur yang modular dan terstruktur:

```
back-end/
├── cmd/
│   └── server/
│       └── main.go          # Entry point aplikasi
├── internal/
│   ├── models/
│   │   ├── mahasiswa.go    # Definisi struct models (Mahasiswa, Kriteria, Bobot, dll)
│   │   └── data.go         # Data dummy dan fixtures
│   ├── handlers/
│   │   └── mahasiswa.go    # Handler functions untuk semua endpoint
│   └── routes/
│       └── routes.go       # Route registration dan mapping
├── go.mod
├── go.sum
└── server                  # Compiled binary
```

## Penjelasan Struktur

### `cmd/server/main.go`
- **Tujuan**: Entry point aplikasi
- **Isi**: 
  - Setup Router (gorilla/mux)
  - Register routes
  - Setup CORS
  - Start HTTP server

### `internal/models/mahasiswa.go`
- **Tujuan**: Mendefinisikan semua data models
- **Isi**:
  - `Mahasiswa` struct: Data mahasiswa lengkap
  - `Kriteria` struct: Kriteria untuk analisis SAW
  - `Bobot` struct: Bobot/weights untuk analisis
  - `HasilSAW` struct: Hasil analisis SAW
  - `Stats` struct: Statistik mahasiswa

### `internal/models/data.go`
- **Tujuan**: Menyimpan data dummy dan fixtures
- **Isi**:
  - `MahasiswaList`: Array dari 5 mahasiswa dummy
  - `KriteriaList`: List kriteria analisis
  - `BobotList`: List bobot untuk setiap kriteria

### `internal/handlers/mahasiswa.go`
- **Tujuan**: Implementasi logic handler untuk setiap endpoint
- **Handlers**:
  - `GetMahasiswa()`: GET /mahasiswa
  - `AddMahasiswa()`: POST /mahasiswa
  - `GetMahasiswaByNIM()`: GET /mahasiswa/{nim}
  - `GetMahasiswaAktif()`: GET /mahasiswa/aktif
  - `GetMahasiswaTidakAktif()`: GET /mahasiswa/tidak-aktif
  - `GetMahasiswaAlumni()`: GET /mahasiswa/alumni
  - `GetMahasiswaByProdi()`: GET /mahasiswa/prodi/{prodi}
  - `GetMahasiswaByAngkatan()`: GET /mahasiswa/angkatan/{angkatan}
  - `GetMahasiswaBerprestasi()`: GET /mahasiswa/berprestasi
  - `GetMahasiswaBeasiswa()`: GET /mahasiswa/beasiswa
  - `GetMahasiswaStats()`: GET /stats
  - `GetKriteria()`: GET /kriteria
  - `GetBobot()`: GET /bobot
  - `ProsesSAW()`: POST /proses

### `internal/routes/routes.go`
- **Tujuan**: Centralized route registration
- **Fungsi**: `RegisterRoutes()` mendaftarkan semua endpoint

## Cara Menjalankan Backend

### Opsi 1: Menggunakan Go Command
```bash
cd back-end
go run ./cmd/server
```

### Opsi 2: Build dan Run Binary
```bash
cd back-end
go build -o server ./cmd/server
./server
```

### Opsi 3: Dengan Installed Binary
```bash
cd back-end
go install ./cmd/server
```

Server akan berjalan di `http://localhost:8080`

## API Endpoints

### Mahasiswa
- `GET /mahasiswa` - Dapatkan semua mahasiswa
- `POST /mahasiswa` - Tambah mahasiswa baru
- `GET /mahasiswa/{nim}` - Dapatkan mahasiswa by NIM
- `GET /mahasiswa/aktif` - Dapatkan mahasiswa aktif
- `GET /mahasiswa/tidak-aktif` - Dapatkan mahasiswa tidak aktif
- `GET /mahasiswa/alumni` - Dapatkan alumni
- `GET /mahasiswa/berprestasi` - Dapatkan mahasiswa berprestasi
- `GET /mahasiswa/beasiswa` - Dapatkan mahasiswa penerima beasiswa
- `GET /mahasiswa/prodi/{prodi}` - Dapatkan by program studi
- `GET /mahasiswa/angkatan/{angkatan}` - Dapatkan by tahun angkatan

### Analisis & Statistik
- `GET /stats` - Dapatkan statistik mahasiswa
- `GET /kriteria` - Dapatkan list kriteria SAW
- `GET /bobot` - Dapatkan list bobot SAW
- `POST /proses` - Proses analisis SAW

## Dependencies

```go
require (
    github.com/gorilla/handlers v1.5.2
    github.com/gorilla/mux v1.8.1
)
```

## CORS Configuration

Backend sudah configured untuk menerima request dari semua origin:
- **AllowedOrigins**: `*` (semua)
- **AllowedMethods**: GET, POST, PUT, DELETE, OPTIONS
- **AllowedHeaders**: X-Requested-With, Content-Type, Authorization
