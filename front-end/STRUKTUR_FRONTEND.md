# Frontend - Sistem Pelacakan Mahasiswa UNISMUH

## Struktur Proyek

Frontend menggunakan navigasi sidebar dengan menu accordion "Data Mahasiswa" yang menampilkan 7 sub-menu langsung tanpa halaman perantara.

```
front-end/
├── app/
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Dashboard utama
│   ├── providers.tsx                   # Context providers
│   ├── globals.css                     # Global styles
│   ├── cari-mahasiswa/
│   │   └── page.tsx                    # Menu: Cari Mahasiswa
│   ├── analisis-search/
│   │   └── page.tsx                    # Menu: Peninjauan Mahasiswa
│   ├── detail-mahasiswa/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── data-lengkap/
│   │   └── page.tsx                    # Data Lengkap Mahasiswa
│   ├── data-perangkatan/
│   │   └── page.tsx                    # Data Per Angkatan
│   ├── data-alumni/
│   │   └── page.tsx                    # Data Alumni
│   ├── prestasi-mahasiswa/
│   │   └── page.tsx                    # Prestasi Mahasiswa
│   ├── penerima-beasiswa/
│   │   └── page.tsx                    # Penerima Beasiswa
│   ├── mahasiswa-aktif/
│   │   └── page.tsx                    # Mahasiswa Aktif
│   └── mahasiswa-tidak-aktif/
│       └── page.tsx                    # Mahasiswa Tidak Aktif
│
├── components/
│   ├── MainLayout.tsx                  # Layout wrapper untuk pages
│   └── Sidebar.tsx                     # Sidebar navigation dengan accordion
├── context/
│   └── MahasiswaContext.tsx
├── public/
└── package.json
```

## Navigasi Sidebar

### Menu Utama
1. **Dashboard** (`/`) - Halaman utama dengan statistik dan chart
2. **Cari Mahasiswa** (`/cari-mahasiswa`) - Pencarian individual mahasiswa
3. **Peninjauan Mahasiswa** (`/analisis-search`) - Analisis lanjutan

### Menu Data Mahasiswa (Accordion)
Menu dropdown yang bisa di-expand/collapse, berisi 7 sub-menu:
1. **Data Lengkap** (`/data-lengkap`) - Seluruh data mahasiswa
2. **Data Per Angkatan** (`/data-perangkatan`) - Data per tahun angkatan
3. **Data Alumni** (`/data-alumni`) - Data lulusan (SKS ≥ 144)
4. **Prestasi Mahasiswa** (`/prestasi-mahasiswa`) - Mahasiswa berprestasi (IPK ≥ 3.5)
5. **Penerima Beasiswa** (`/penerima-beasiswa`) - Kandidat penerima beasiswa
6. **Mahasiswa Aktif** (`/mahasiswa-aktif`) - Data mahasiswa aktif
7. **Mahasiswa Tidak Aktif** (`/mahasiswa-tidak-aktif`) - Data mahasiswa tidak aktif

### Mobile Navigation
- Bottom navigation bar dengan 4 item: Dashboard, Cari, Peninjauan, Data
- Item "Data" membuka overlay menu berisi 7 sub-menu Data Mahasiswa

## Install & Run Frontend

```bash
cd front-end
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Teknologi yang Digunakan

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **HTTP**: Fetch API

## Environment Variables

Pastikan backend running di `http://localhost:8080`

Semua API calls di-hardcode ke `http://localhost:8080` dalam setiap component.
