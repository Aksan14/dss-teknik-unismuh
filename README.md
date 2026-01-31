# DSS UNISMUH

Decision Support System (DSS) untuk penilaian mahasiswa berbasis Next.js (frontend) dan Go (backend API).

## Struktur
- `front-end/` : Next.js (React) dashboard & tampilan biodata mahasiswa
- `back-end/`  : Go REST API (SAW, data biodata lengkap, kategori)

## Fitur
- Tampilan biodata mahasiswa lengkap (termasuk data pribadi, orang tua, pendidikan)
- Proses SAW otomatis: Normalisasi, Perhitungan Preferensi, Pengelompokan Kategori
- Dashboard hasil dengan rekomendasi per kategori
- Data dummy mahasiswa termasuk biodata Muhammad Aksan (NIM: 105841107223)

## Cara Menjalankan

### Backend (Go)
1. Masuk ke folder back-end: `cd back-end`
2. Jalankan server: `go run main.go`
3. Server berjalan di http://localhost:8080

### Frontend (Next.js)
1. Masuk ke folder front-end: `cd front-end`
2. Install dependencies: `npm install`
3. Jalankan dev server: `npm run dev`
4. Buka http://localhost:3000

## Endpoint API
- GET /mahasiswa : Data biodata mahasiswa lengkap
- GET /kriteria : Kriteria penilaian
- GET /bobot : Bobot kriteria
- POST /proses : Proses SAW & hasil kategori

## Proses SAW
1. **Normalisasi**: Benefit = x_ij / max(x_j), Cost = min(x_j) / x_ij
2. **Preferensi**: V_i = Σ (w_j × r_ij) dengan bobot tetap
3. **Kategori**: ≥0.80 Berprestasi, 0.60-0.79 Normal, <0.60 Berisiko