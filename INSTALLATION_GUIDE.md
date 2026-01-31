# Panduan Menjalankan Sistem Pelacakan Mahasiswa UNISMUH v2.0

## Prerequisites

Pastikan Anda sudah memiliki:
- **Go** version 1.16+ (untuk backend)
- **Node.js** version 16+ dan **npm** (untuk frontend)
- **Git** (untuk version control)

---

## Langkah 1: Setup Backend (Go)

### 1.1 Navigasi ke folder backend
```bash
cd back-end
```

### 1.2 Download dependencies
```bash
go mod download
```

### 1.3 Build aplikasi
```bash
go build -o server main.go
```

Atau langsung jalankan tanpa build:
```bash
go run main.go
```

### 1.4 Backend berjalan di
```
http://localhost:8080
```

**Output yang diharapkan:**
```
Server running on :8080
```

---

## Langkah 2: Setup Frontend (Next.js)

### 2.1 Buka terminal baru dan navigasi ke folder frontend
```bash
cd front-end
```

### 2.2 Install dependencies
```bash
npm install
```

Atau jika sudah pernah install sebelumnya:
```bash
npm ci
```

### 2.3 Jalankan development server
```bash
npm run dev
```

### 2.4 Frontend berjalan di
```
http://localhost:3000
```

**Output yang diharapkan:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

---

## Langkah 3: Akses Aplikasi

1. Buka browser Anda
2. Pergi ke: **http://localhost:3000**
3. Anda akan melihat Dashboard dengan statistik mahasiswa

---

## Menu dan Fitur yang Tersedia

### Dashboard (/)
- Statistik Total Mahasiswa
- Statistik Mahasiswa Aktif (clickable)
- Statistik Mahasiswa Tidak Aktif (clickable)
- Statistik Prestasi
- Statistik Alumni
- Quick access ke fitur-fitur utama

### Data Lengkap (/data-lengkap)
- 5 tab program studi:
  - Informatika
  - Arsitektur
  - Pengairan
  - Sipil
  - Elektro
- Tabel dengan: No, Nama, NIM, IPK, SKS Lulus, SKS Belum Lulus

### Data Perangkatan (/data-perangkatan)
- Pilih tahun angkatan (2019-2026)
- Tabel dengan: No, Nama, NIM, Jurusan

### Data Alumni (/data-alumni)
- Search mahasiswa alumni
- Tabel dengan: No, Nama, NIM, Jurusan, Angkatan, IPK Akhir, Prestasi

### Prestasi Mahasiswa (/prestasi-mahasiswa)
- Lihat semua mahasiswa berprestasi
- Search functionality
- Tabel dengan: No, Nama, NIM, Jurusan, Angkatan, IPK, Status, Prestasi

### Penerima Beasiswa (/penerima-beasiswa)
- 2 Filter: KIPK dan Beasiswa Luar
- Search functionality
- Tabel dengan: No, Nama, NIM, Jurusan, Angkatan, [KIPK/Beasiswa Luar]

### Mahasiswa Aktif (/mahasiswa-aktif)
- Lihat semua mahasiswa yang sedang aktif
- Search functionality
- Tabel dengan: No, Nama, NIM, Jurusan, IPK, SKS Lulus, SKS Belum Lulus

### Mahasiswa Tidak Aktif (/mahasiswa-tidak-aktif)
- Lihat semua mahasiswa yang tidak aktif
- Search functionality
- Tabel dengan: No, Nama, NIM, Jurusan, IPK, SKS Lulus, SKS Belum Lulus, Keterangan

### Cari Mahasiswa (/cari-mahasiswa)
- Search mahasiswa berdasarkan NIM/Nama
- Lihat detail biodata lengkap

### Analisis Status (/analisis-mahasiswa)
- Analisis performa mahasiswa menggunakan metode SAW

---

## Troubleshooting

### Backend tidak jalan

**Error:** `port 8080 already in use`
```bash
# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process
```

**Error:** `go: command not found`
- Pastikan Go sudah terinstall dengan benar
- Periksa PATH environment variable

### Frontend tidak jalan

**Error:** `port 3000 already in use`
```bash
npm run dev -- -p 3001  # Jalankan di port 3001
```

**Error:** `npm: command not found`
- Pastikan Node.js dan npm sudah terinstall dengan benar
- Periksa PATH environment variable

**Error:** `CORS Error`
- Pastikan backend sudah running di port 8080
- Periksa URL di fetch API calls di frontend

### Data tidak muncul di frontend

1. Pastikan backend sudah running
2. Buka DevTools (F12) → Console tab
3. Cek apakah ada error message
4. Periksa Network tab untuk melihat API calls
5. Pastikan format response sesuai dengan expected format

---

## Development Workflow

### 1. Membuat perubahan di Backend
```bash
cd back-end
# Edit file main.go
go run main.go  # Test changes langsung
```

### 2. Membuat perubahan di Frontend
```bash
cd front-end
# Edit file di app/ atau components/
# Changes akan di-reload otomatis (hot reload)
```

### 3. Build untuk Production

**Backend:**
```bash
cd back-end
go build -o server main.go
./server
```

**Frontend:**
```bash
cd front-end
npm run build
npm start
```

---

## API Endpoints Referensi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/mahasiswa` | Semua mahasiswa |
| GET | `/mahasiswa/{nim}` | Detail mahasiswa by NIM |
| POST | `/mahasiswa` | Tambah mahasiswa baru |
| GET | `/mahasiswa/aktif` | List mahasiswa aktif |
| GET | `/mahasiswa/tidak-aktif` | List mahasiswa tidak aktif |
| GET | `/mahasiswa/alumni` | List alumni |
| GET | `/mahasiswa/prodi/{prodi}` | Mahasiswa by program studi |
| GET | `/mahasiswa/angkatan/{angkatan}` | Mahasiswa by tahun angkatan |
| GET | `/mahasiswa/berprestasi` | Mahasiswa berprestasi |
| GET | `/mahasiswa/beasiswa` | Penerima beasiswa |
| GET | `/stats` | Statistik keseluruhan |
| GET | `/kriteria` | Kriteria SAW |
| GET | `/bobot` | Bobot SAW |
| POST | `/proses` | Process SAW analysis |

---

## Testing dengan Postman

### 1. Download Postman: https://www.postman.com/downloads/

### 2. Buat collection dan test endpoints:

**Example Request:**
```
GET http://localhost:8080/stats
```

**Expected Response:**
```json
{
  "total_mahasiswa": 3,
  "mahasiswa_aktif": 3,
  "mahasiswa_tidak_aktif": 0,
  "berprestasi": 3,
  "alumni": 0
}
```

---

## Struktur Project

```
Sistem-Pelacakan-Mahasiswa-UNISMUH/
│
├── back-end/
│   ├── main.go              (Backend application)
│   ├── go.mod               (Go dependencies)
│   └── server               (Compiled binary)
│
├── front-end/
│   ├── app/
│   │   ├── page.tsx         (Dashboard)
│   │   ├── data-lengkap/
│   │   ├── data-perangkatan/
│   │   ├── data-alumni/
│   │   ├── prestasi-mahasiswa/
│   │   ├── penerima-beasiswa/
│   │   ├── mahasiswa-aktif/
│   │   ├── mahasiswa-tidak-aktif/
│   │   └── cari-mahasiswa/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
└── UPDATE_SUMMARY.md        (Documentation)
```

---

## Tips & Tricks

1. **Kalau ingin menambah data mahasiswa:**
   - Edit `mahasiswaList` di `back-end/main.go`
   - Compile ulang dengan `go build -o server main.go`

2. **Kalau ingin mengubah warna theme:**
   - Edit file `.tsx` yang ingin diubah
   - Gunakan Tailwind CSS classes (sudah include di project)

3. **Kalau performa lambat:**
   - Cek DevTools Network tab
   - Pastikan backend tidak punya query yang berat
   - Gunakan browser cache

4. **Development tips:**
   - Gunakan VS Code untuk development
   - Install extension: ES7+ React/Redux/React-Native snippets
   - Install extension: Go
   - Use hot reload dengan `npm run dev`

---

## Kontak & Support

Untuk pertanyaan atau masalah teknis:
- Hubungi tim development
- Check dokumentasi di `UPDATE_SUMMARY.md`
- Review GitHub issues (jika ada)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | - | Initial release |
| 1.2 | - | Minor updates |
| 2.0 | 31 Jan 2026 | Major UI/UX overhaul, new features |

---

**Happy Coding! 🚀**
