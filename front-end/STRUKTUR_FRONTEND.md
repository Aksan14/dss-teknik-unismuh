# Frontend - Sistem Pelacakan Mahasiswa UNISMUH

## Struktur Proyek

Frontend telah diorganisir dengan pemisahan fitur utama dari menu utama dashboard:

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
│   │   └── page.tsx                    # Menu: Pencarian & Analisis
│   ├── analisis-mahasiswa/
│   │   └── page.tsx                    # Menu: Analisis Status
│   ├── biodata/
│   │   └── page.tsx
│   ├── biodata-mahasiswa/
│   │   └── page.tsx
│   ├── detail-mahasiswa/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── hasil-pencarian/
│   │   └── page.tsx
│   │
│   ├── fitur-utama/                    # FOLDER BARU: Fitur Utama
│   │   ├── page.tsx                    # Index halaman fitur utama
│   │   ├── data-lengkap/
│   │   │   └── page.tsx               # Data Lengkap Mahasiswa
│   │   ├── data-perangkatan/
│   │   │   └── page.tsx               # Data Perangkatan Mahasiswa
│   │   ├── data-alumni/
│   │   │   └── page.tsx               # Data Alumni
│   │   ├── prestasi-mahasiswa/
│   │   │   └── page.tsx               # Prestasi Mahasiswa
│   │   ├── penerima-beasiswa/
│   │   │   └── page.tsx               # Penerima Beasiswa
│   │   ├── mahasiswa-aktif/
│   │   │   └── page.tsx               # Mahasiswa Aktif
│   │   └── mahasiswa-tidak-aktif/
│   │       └── page.tsx               # Mahasiswa Tidak Aktif
│   │
│   ├── data-lengkap/                   # FOLDER LAMA (tetap ada)
│   │   └── page.tsx                    # Untuk backward compatibility
│   ├── data-perangkatan/
│   │   └── page.tsx
│   ├── data-alumni/
│   │   └── page.tsx
│   ├── prestasi-mahasiswa/
│   │   └── page.tsx
│   ├── penerima-beasiswa/
│   │   └── page.tsx
│   ├── mahasiswa-aktif/
│   │   └── page.tsx
│   └── mahasiswa-tidak-aktif/
│       └── page.tsx
│
├── components/
│   ├── MainLayout.tsx                  # Layout wrapper untuk pages
│   └── Sidebar.tsx                     # Sidebar navigation (DIPERBARUI)
├── context/
│   └── MahasiswaContext.tsx
├── public/
└── package.json
```

## Perubahan Utama

### 1. Update Sidebar Navigation
**File**: `components/Sidebar.tsx`

**Sebelum**:
```typescript
const navigation = [
  { name: 'Dashboard', href: '/', ... },
  { name: 'Cari Mahasiswa', href: '/cari-mahasiswa', ... },
  { name: 'Pencarian & Analisis', href: '/analisis-search', ... },
  { name: 'Analisis Status', href: '/analisis-mahasiswa', ... },
  { name: 'Data Lengkap', href: '/data-lengkap', ... },
  { name: 'Data Perangkatan', href: '/data-perangkatan', ... },
  { name: 'Data Alumni', href: '/data-alumni', ... },
  { name: 'Prestasi Mahasiswa', href: '/prestasi-mahasiswa', ... },
  { name: 'Penerima Beasiswa', href: '/penerima-beasiswa', ... },
  { name: 'Mahasiswa Aktif', href: '/mahasiswa-aktif', ... },
  { name: 'Mahasiswa Tidak Aktif', href: '/mahasiswa-tidak-aktif', ... },
]
```

**Sesudah**:
```typescript
const navigation = [
  { name: 'Dashboard', href: '/', ... },
  { name: 'Cari Mahasiswa', href: '/cari-mahasiswa', ... },
  { name: 'Pencarian & Analisis', href: '/analisis-search', ... },
  { name: 'Analisis Status', href: '/analisis-mahasiswa', ... },
  { name: 'Fitur Utama', href: '/fitur-utama', ... },  // BARU
]
```

### 2. Folder Fitur Utama Baru
Dibuat folder `app/fitur-utama/` dengan struktur:
- `page.tsx` - Dashboard fitur utama dengan menu card interaktif
- 7 subfolder untuk setiap fitur

### 3. Page Fitur Utama
**File**: `app/fitur-utama/page.tsx`

Halaman index yang menampilkan semua fitur dalam bentuk card grid:
- Data Lengkap
- Data Perangkatan  
- Data Alumni
- Prestasi Mahasiswa
- Penerima Beasiswa
- Mahasiswa Aktif
- Mahasiswa Tidak Aktif

Setiap card memiliki:
- Icon yang unik
- Deskripsi fitur
- Warna border yang berbeda
- Link ke halaman fitur

### 4. URL Baru untuk Fitur Utama
| Fitur | URL Lama | URL Baru |
|-------|----------|----------|
| Data Lengkap | `/data-lengkap` | `/fitur-utama/data-lengkap` |
| Data Perangkatan | `/data-perangkatan` | `/fitur-utama/data-perangkatan` |
| Data Alumni | `/data-alumni` | `/fitur-utama/data-alumni` |
| Prestasi Mahasiswa | `/prestasi-mahasiswa` | `/fitur-utama/prestasi-mahasiswa` |
| Penerima Beasiswa | `/penerima-beasiswa` | `/fitur-utama/penerima-beasiswa` |
| Mahasiswa Aktif | `/mahasiswa-aktif` | `/fitur-utama/mahasiswa-aktif` |
| Mahasiswa Tidak Aktif | `/mahasiswa-tidak-aktif` | `/fitur-utama/mahasiswa-tidak-aktif` |

## Navigasi Dashboard

### Menu Utama (Sidebar)
Sekarang hanya memiliki 5 menu:
1. **Dashboard** - Halaman utama dengan statistik
2. **Cari Mahasiswa** - Pencarian individual mahasiswa
3. **Pencarian & Analisis** - Analisis lanjutan
4. **Analisis Status** - Analisis status mahasiswa
5. **Fitur Utama** - Gateway ke 7 fitur utama

### Halaman Fitur Utama
Menampilkan 7 fitur dalam grid card yang rapi dan interaktif:
- Responsive design
- Hover effect dengan scale dan shadow
- Navigasi ke setiap fitur

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

## Notes

1. **Folder lama tetap ada** untuk backward compatibility
2. **Semua fitur masih berfungsi** di kedua URL (lama dan baru)
3. **Sidebar hanya menunjuk ke URL baru** via `/fitur-utama`
4. **Page fitur utama** memberikan interface yang lebih rapi untuk mengakses 7 fitur
