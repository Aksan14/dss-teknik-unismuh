# Test API Backend - Struktur Baru

## Endpoints Testing

### 1. Get Stats
```bash
curl http://localhost:8080/stats
```
**Response**:
```json
{
  "total_mahasiswa": 5,
  "mahasiswa_aktif": 3,
  "mahasiswa_tidak_aktif": 1,
  "berprestasi": 5,
  "alumni": 1
}
```

### 2. Get Alumni
```bash
curl http://localhost:8080/mahasiswa/alumni
```

### 3. Get Mahasiswa Aktif
```bash
curl http://localhost:8080/mahasiswa/aktif
```

### 4. Get Mahasiswa by Angkatan
```bash
curl http://localhost:8080/mahasiswa/angkatan/2022
```

### 5. Get Mahasiswa Berprestasi
```bash
curl http://localhost:8080/mahasiswa/berprestasi
```

### 6. Get Mahasiswa Penerima Beasiswa
```bash
curl http://localhost:8080/mahasiswa/beasiswa
```

### 7. Get Kriteria SAW
```bash
curl http://localhost:8080/kriteria
```

### 8. Get Bobot SAW
```bash
curl http://localhost:8080/bobot
```

### 9. Proses SAW Analysis
```bash
curl -X POST http://localhost:8080/proses
```

---

## Status Reorganisasi Backend

✅ **Files Structure**
- [x] `cmd/server/main.go` - Entry point
- [x] `internal/models/mahasiswa.go` - Models
- [x] `internal/models/data.go` - Mock data
- [x] `internal/handlers/mahasiswa.go` - Handlers
- [x] `internal/routes/routes.go` - Routes
- [x] Build successful
- [x] All endpoints working

✅ **Testing Results**
- [x] Backend compile successful
- [x] Server running on port 8080
- [x] CORS enabled
- [x] All endpoints responding correctly
- [x] Data format consistent with frontend

---

## Build & Run Instructions

### Development
```bash
cd back-end
go run ./cmd/server
```

### Production Build
```bash
cd back-end
go build -o server ./cmd/server
./server
```

---

**Created**: 2026-01-31  
**Status**: ✅ All systems operational
