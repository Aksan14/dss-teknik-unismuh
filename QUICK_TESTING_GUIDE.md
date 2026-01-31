# Quick Reference - Panduan Testing Sistem

## 1. Menjalankan Backend & Frontend

### Terminal 1 - Backend (Go)
```bash
cd back-end
go run main.go
# Server berjalan di http://localhost:8080
```

### Terminal 2 - Frontend (Next.js)
```bash
cd front-end
npm run dev
# Server berjalan di http://localhost:3000
```

## 2. Testing Backend API

### Dashboard Statistics
```bash
curl http://localhost:8080/stats | jq .
# Expected: { "total_mahasiswa": 5, "mahasiswa_aktif": 3, "mahasiswa_tidak_aktif": 1, "berprestasi": 5, "alumni": 1 }
```

### Mahasiswa Aktif (3 records)
```bash
curl http://localhost:8080/mahasiswa/aktif | jq '.[] | {id, nama, status}'
```

### Mahasiswa Tidak Aktif (1 record - Cuti)
```bash
curl http://localhost:8080/mahasiswa/tidak-aktif | jq '.[] | {id, nama, status, keterangan}'
```

### Alumni (1 record)
```bash
curl http://localhost:8080/mahasiswa/alumni | jq '.[] | {id, nama, status, angkatan}'
```

### Prestasi (5 records dengan achievement)
```bash
curl http://localhost:8080/mahasiswa/berprestasi | jq '.[] | {id, nama, prestasi}'
```

### Beasiswa (4 records dengan scholarship)
```bash
curl http://localhost:8080/mahasiswa/beasiswa | jq '.[] | {id, nama, beasiswa, beasiswa_luar}'
```

### All Mahasiswa (5 records)
```bash
curl http://localhost:8080/mahasiswa | jq '.[] | {id, nama, status}'
```

## 3. Testing Frontend Pages

### Dashboard / Home
```
http://localhost:3000/
- Stat Cards: Total (5), Aktif (3), Tidak-Aktif (1), Berprestasi (5), Alumni (1)
- Feature Cards: Link ke 7 halaman fitur
```

### Mahasiswa Aktif
```
http://localhost:3000/mahasiswa-aktif
- Table dengan 3 rows
- Kolom: ID, NIM, Nama, IPK, Kehadiran, Semester
- Fitur: Search by Nama/NIM
```

### Mahasiswa Tidak Aktif
```
http://localhost:3000/mahasiswa-tidak-aktif
- Table dengan 1 row (Budi Cuti)
- Kolom: ID, NIM, Nama, IPK, Kehadiran, Status, SKS, Keterangan
- Fitur: Search
```

### Data Alumni
```
http://localhost:3000/data-alumni
- Table dengan 1 row (Rini Alumni)
- Kolom: ID, NIM, Nama, Angkatan, Prestasi, KIPK, Keterangan
- Fitur: Search
```

### Prestasi Mahasiswa
```
http://localhost:3000/prestasi-mahasiswa
- Table dengan 5 rows (semua yang ada prestasi)
- Kolom: ID, NIM, Nama, Prestasi, Beasiswa, KIPK, Keterangan
- Fitur: Sort, Search
```

### Penerima Beasiswa
```
http://localhost:3000/penerima-beasiswa
- Tab 1: Beasiswa Dalam (1 record)
- Tab 2: Beasiswa Luar (1 record)
- Kolom: ID, NIM, Nama, Beasiswa, KIPK
- Fitur: Filter by beasiswa type
```

## 4. Test Data Records

### Aktif (3 records)
1. Muhammad Aksan (NIM: 105841107222) - IPK: 3.7
2. Andi Dummy (NIM: 105841107223) - IPK: 3.2
3. Cici Dummy (NIM: 105841107224) - IPK: 3.8

### Alumni (1 record)
4. Rini Alumni (NIM: 105841107225) - Angkatan: 2021, KIPK: 3.6

### Tidak Aktif/Cuti (1 record)
5. Budi Cuti (NIM: 105841107226) - Status: Cuti, KIPK: 2.8

## 5. Common Issues & Solutions

### Issue: Pages show "error" atau loading
**Solution:** 
- Pastikan backend running: `go run main.go`
- Pastikan frontend running: `npm run dev`
- Check logs di terminal masing-masing

### Issue: 404 pada /mahasiswa/alumni
**Solution:** Sudah diperbaiki! Route ordering sudah diubah. Cek:
```bash
curl -i http://localhost:8080/mahasiswa/alumni
# Should return 200 OK, not 404
```

### Issue: Data tidak muncul
**Solution:**
- Refresh browser (Ctrl+R atau Cmd+R)
- Clear cache browser
- Check browser console untuk JavaScript errors
- Verify backend API returning data: `curl http://localhost:8080/stats`

## 6. File-file Penting

```
back-end/
├── main.go              ← API endpoints & mock data
├── go.mod              ← Dependencies

front-end/
├── app/
│   ├── page.tsx                      ← Dashboard
│   ├── mahasiswa-aktif/page.tsx      ← Aktif students
│   ├── mahasiswa-tidak-aktif/page.tsx← Tidak-aktif students
│   ├── data-alumni/page.tsx          ← Alumni
│   ├── prestasi-mahasiswa/page.tsx   ← Achievements
│   └── penerima-beasiswa/page.tsx    ← Scholarships
├── components/
│   ├── Sidebar.tsx     ← Navigation menu
│   └── MainLayout.tsx  ← Layout wrapper
```

## 7. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /mahasiswa | Get semua mahasiswa |
| GET | /mahasiswa/{nim} | Get mahasiswa by NIM |
| GET | /mahasiswa/aktif | Get mahasiswa dengan status Aktif |
| GET | /mahasiswa/tidak-aktif | Get mahasiswa tidak aktif (Cuti, Keluar) |
| GET | /mahasiswa/alumni | Get mahasiswa alumni |
| GET | /mahasiswa/berprestasi | Get mahasiswa dengan prestasi |
| GET | /mahasiswa/beasiswa | Get mahasiswa dengan beasiswa |
| GET | /mahasiswa/prodi/{prodi} | Get mahasiswa by program studi |
| GET | /mahasiswa/angkatan/{year} | Get mahasiswa by angkatan |
| GET | /stats | Get dashboard statistics |
| POST | /mahasiswa | Add new mahasiswa (body: JSON) |
| GET | /kriteria | Get kriteria list |
| GET | /bobot | Get bobot list |
| POST | /proses | Run SAW calculation |

## 8. Deployment Notes

### Prerequisites
- Go 1.16+
- Node.js 18+
- npm or yarn

### Environment Variables
None required for local testing, but ensure CORS is enabled in backend

### Build & Run Production
```bash
# Backend
cd back-end && go build -o sistem-pelacakan && ./sistem-pelacakan

# Frontend  
cd front-end && npm run build && npm run start
```

---

**Last Updated:** January 31, 2026
**Status:** All 5 pages fixed and working ✅
