# FITUR SISTEM PELACAKAN MAHASISWA UNISMUH v2.0 - QUICK REFERENCE

## Dashboard Overview

```
┌─────────────────────────────────────────────────────┐
│                    DASHBOARD                         │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐       │
│  │  Total   │  │ Aktif    │  │ Tidak Aktif  │       │
│  │ 2,450    │  │ 2,180 ✓  │  │      270     │       │
│  └──────────┘  └──────────┘  └──────────────┘       │
│                                                       │
│  ┌──────────┐  ┌──────────────────────────────┐     │
│  │Prestasi  │  │        Alumni                │     │
│  │  245     │  │        150                   │     │
│  └──────────┘  └──────────────────────────────┘     │
│                                                       │
├─ FITUR UTAMA ─────────────────────────────────────┤
│                                                       │
│ 📋 Data Lengkap │ 📅 Perangkatan │ 🎓 Alumni │     │
│ ⭐ Prestasi    │ 🎁 Beasiswa    │            │     │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 1. DATA LENGKAP
**Path:** `/data-lengkap`  
**Icon:** 📋 Document

### Program Studi Tabs:
- **Informatika** - Program Teknik Informatika
- **Arsitektur** - Program Teknik Arsitektur
- **Pengairan** - Program Teknik Pengairan
- **Sipil** - Program Teknik Sipil
- **Elektro** - Program Teknik Elektro

### Tabel Kolom:
| No | Nama | NIM | IPK | SKS Lulus | SKS Belum Lulus |
|----|------|-----|-----|-----------|-----------------|
| 1 | Muhammad Aksan | 105841107223 | 3.70 | 140 | 4 |

### Color Indicators:
- 🟢 **Green**: IPK ≥ 3.5 (Excellent)
- 🔵 **Blue**: IPK ≥ 3.0 (Good)  
- 🟠 **Orange**: IPK < 3.0 (Fair)

---

## 2. DATA PERANGKATAN
**Path:** `/data-perangkatan`  
**Icon:** 📅 Calendar

### Tahun Selection:
```
[2019] [2020] [2021] [2022] [2023] [2024] [2025] [2026]
```

### Tabel Kolom:
| No | Nama | NIM | Jurusan |
|----|------|-----|---------|
| 1 | Muhammad Aksan | 105841107223 | Teknik Informatika |

### Dynamic Loading:
- Klik tahun → Load data mahasiswa dari tahun tersebut
- Show total count per tahun

---

## 3. DATA ALUMNI
**Path:** `/data-alumni`  
**Icon:** 🎓 Academic

### Features:
- Search by Name/NIM
- Filter by Program/Year

### Tabel Kolom:
| No | Nama | NIM | Jurusan | Angkatan | IPK Akhir | Prestasi |
|----|------|-----|---------|----------|-----------|----------|
| 1 | Nama Alumni | NIM | Prodi | 2022 | 3.50 | Award |

---

## 4. PRESTASI MAHASISWA
**Path:** `/prestasi-mahasiswa`  
**Icon:** ⭐ Star

### Features:
- Filter mahasiswa berprestasi
- Show achievement details
- Search functionality

### Tabel Kolom:
| No | Nama | NIM | Jurusan | Angkatan | IPK | Status | Prestasi |
|----|------|-----|---------|----------|-----|--------|----------|
| 1 | Aksan | 105841107223 | TI | 2022 | 3.70 | Aktif | Sertifikat Lomba |

---

## 5. PENERIMA BEASISWA
**Path:** `/penerima-beasiswa`  
**Icon:** 🎁 Gift

### Filter Tabs:
```
┌─────────────────────────────┐
│ 🎯 KIPK │ 💰 Beasiswa Luar │
├─────────────────────────────┤
│ Kompetisi IP Kelas          │
│                              │
```

### Tab 1: KIPK
**Tabel:**
| No | Nama | NIM | Jurusan | Angkatan | KIPK |
|----|------|-----|---------|----------|------|
| 1 | Cici Dummy | 105841107225 | TI | 2022 | 3.80 |

### Tab 2: Beasiswa Luar
**Tabel:**
| No | Nama | NIM | Jurusan | Angkatan | Beasiswa Luar |
|----|------|-----|---------|----------|----------------|
| 1 | Cici Dummy | 105841107225 | TI | 2022 | Beasiswa Asia |

---

## 6. MAHASISWA AKTIF
**Path:** `/mahasiswa-aktif`  
**Icon:** ✅ Active (Green)

### Features:
- Real-time active student list
- Search by Name/NIM
- Active status indicator

### Tabel Kolom:
| No | Nama | NIM | Jurusan | IPK | SKS Lulus | SKS Belum Lulus |
|----|------|-----|---------|-----|-----------|-----------------|
| 1 | Muhammad Aksan | 105841107223 | TI | 3.70 | 140 | 4 |

### Color Scheme: 🟢 GREEN

---

## 7. MAHASISWA TIDAK AKTIF
**Path:** `/mahasiswa-tidak-aktif`  
**Icon:** ❌ Inactive (Red)

### Features:
- Inactive student list
- Search by Name/NIM
- Keterangan (Reason)

### Tabel Kolom:
| No | Nama | NIM | Jurusan | IPK | SKS Lulus | SKS Belum Lulus | Keterangan |
|----|------|-----|---------|-----|-----------|-----------------|-----------|
| 1 | Mahasiswa | NIM | Prodi | IPK | SKS | SKS | Cuti/Keluar |

### Color Scheme: 🔴 RED

---

## Navigation Sidebar

```
📊 DASHBOARD
│
├─ 🏠 Dashboard
├─ 🔍 Cari Mahasiswa
├─ 📈 Analisis Status
│
├─ FITUR UTAMA:
├─ 📋 Data Lengkap
├─ 📅 Data Perangkatan
├─ 🎓 Data Alumni
├─ ⭐ Prestasi Mahasiswa
├─ 🎁 Penerima Beasiswa
│
├─ STATUS:
├─ ✅ Mahasiswa Aktif
└─ ❌ Mahasiswa Tidak Aktif
```

---

## Key Features Summary

| Feature | Location | Type | Columns |
|---------|----------|------|---------|
| Total Stats | Dashboard | Cards | - |
| By Program | Data Lengkap | Tabs | 6 cols |
| By Year | Data Perangkatan | Selector | 4 cols |
| Alumni | Data Alumni | Search | 7 cols |
| Achievements | Prestasi | Filter | 8 cols |
| Scholarships | Beasiswa | Tabs | 6 cols |
| Active | Mahasiswa Aktif | Filter | 7 cols |
| Inactive | Mahasiswa Tidak Aktif | Filter | 8 cols |

---

## Data Flow Diagram

```
┌─────────────────────────┐
│    BACKEND (Go)         │
│   :8080                 │
├─────────────────────────┤
│ /mahasiswa              │
│ /mahasiswa/aktif        │
│ /mahasiswa/tidak-aktif  │
│ /mahasiswa/prodi/{prodi}│
│ /mahasiswa/angkatan/{yr}│
│ /mahasiswa/alumni       │
│ /mahasiswa/berprestasi  │
│ /mahasiswa/beasiswa     │
│ /stats                  │
└──────────────┬──────────┘
               │
          HTTP │
               │
┌──────────────▼──────────┐
│   FRONTEND (Next.js)    │
│   :3000                 │
├─────────────────────────┤
│ Dashboard               │
│ Data Lengkap            │
│ Data Perangkatan        │
│ Data Alumni             │
│ Prestasi                │
│ Beasiswa                │
│ Mahasiswa Aktif         │
│ Mahasiswa Tidak Aktif   │
└─────────────────────────┘
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Search (if implemented) |
| `Escape` | Close modals |
| `Tab` | Navigate forms |
| `Enter` | Submit search |

---

## Color Palette

```
Primary Colors:
🔵 Blue       #1e40af  - Dashboard
🟢 Green      #16a34a  - Active/Success
🔴 Red        #dc2626  - Inactive/Error
🟡 Yellow     #ca8a04  - Achievements
🟣 Purple     #9333ea  - Alumni
🌸 Pink       #db2777  - Beasiswa
🟠 Orange     #ea580c  - Perangkatan

Status Indicators:
🟢 Green  ≥ 3.5 IPK (Excellent)
🔵 Blue   ≥ 3.0 IPK (Good)
🟠 Orange < 3.0 IPK (Fair)
```

---

## Common Tasks

### Task 1: View All Active Students
1. Click "Mahasiswa Aktif" in sidebar
2. See real-time active student count
3. Use search to find specific student

### Task 2: Check Scholarship Winners
1. Go to "Penerima Beasiswa"
2. Click KIPK or Beasiswa Luar tab
3. Search for specific student

### Task 3: View Program-Specific Data
1. Go to "Data Lengkap"
2. Click desired program tab
3. See all students in that program

### Task 4: Filter by Year
1. Go to "Data Perangkatan"
2. Click year button (2019-2026)
3. View students from that year

---

## Statistics Calculation

```
Total = All Status
Aktif = Status = "Aktif"
Tidak Aktif = Status != "Aktif" AND Status != "Alumni"
Prestasi = Prestasi != ""
Alumni = Status = "Alumni"
```

---

## API Response Examples

### /stats
```json
{
  "total_mahasiswa": 3,
  "mahasiswa_aktif": 3,
  "mahasiswa_tidak_aktif": 0,
  "berprestasi": 3,
  "alumni": 0
}
```

### /mahasiswa/prodi/Informatika
```json
[
  {
    "id": 1,
    "nim": "105841107223",
    "nama": "Muhammad Aksan",
    "jurusan": "Teknik Informatika",
    "ipk": 3.7,
    "sks_lulus": 140,
    "sks_belum_lulus": 4,
    "prestasi": "Sertifikat Lomba Programing",
    "beasiswa": "Beasiswa Penuh",
    "beasiswa_luar": "Tidak Ada",
    "kipk": 3.5,
    "status": "Aktif"
  }
]
```

---

## Version Information

- **Version**: 2.0
- **Release Date**: 31 Januari 2026
- **Backend**: Go 1.16+
- **Frontend**: Next.js 14+ / React 18+ / TypeScript
- **Database**: Mock Data (In-Memory)

---

**Last Updated**: 31 January 2026  
**Created By**: Development Team  
**Status**: ✅ Production Ready
