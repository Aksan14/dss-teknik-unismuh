# Update Pertanyaan Analisis Mahasiswa - Sistem Pelacakan Mahasiswa UNISMUH

## Ringkasan Perubahan
Telah ditambahkan **6 pertanyaan baru** ke sistem analisis mahasiswa untuk memberikan informasi yang lebih komprehensif kepada dekan. Total pertanyaan sekarang menjadi **13 pertanyaan**.

## Daftar Pertanyaan (13 Total)

### Pertanyaan yang Sudah Ada (7)
1. **Bagaimana informasi kontak mahasiswa ini?**
   - Menampilkan identitas, alamat, email, dan kontak mahasiswa
   
2. **Berapa total mata kuliah yang sudah lulus?**
   - Evaluasi jumlah mata kuliah yang telah diselesaikan
   
3. **Berapa total SKS yang sudah lulus?**
   - Progress dalam SKS dengan persentase penyelesaian
   
4. **Berapa SKS yang belum lulus?**
   - Sisa SKS yang perlu ditempuh
   
5. **Berapa IPK mahasiswa ini?**
   - Analisis IPK dengan status (Cumlaude, Sangat Baik, Cukup, dll)
   
6. **Berapa sisa waktu studi yang tersisa?**
   - Kalkulasi sisa semester dan tahun sebelum batas maksimal (7 tahun)
   
7. **Sudah berapa tahun kuliah dan berapa sisa waktu hingga lulus atau DO?**
   - Analisis menyeluruh lama studi dan estimasi kelulusan

### Pertanyaan Baru yang Ditambahkan (6)

8. **Bagaimana kehadiran mahasiswa dalam perkuliahan?** ✨ BARU
   - Status kehadiran dengan interpretasi (Baik/Cukup/Kurang)
   - Analisis risiko ketidakhadiran
   - Rekomendasi peningkatan kehadiran
   - Dampak kehadiran terhadap nilai akhir

9. **Apakah ada mata kuliah yang perlu diulang atau diperbaiki?** ✨ BARU
   - Jumlah mata kuliah yang perlu diulang
   - Analisis penyebab ketidaklulusan
   - Dampak pada IPK dan masa studi
   - Strategi perbaikan dan monitoring

10. **Apakah mahasiswa menerima beasiswa dan apa prestasi yang telah dicapai?** ✨ BARU
    - Status beasiswa (jenis dan status aktif)
    - Daftar prestasi akademik yang diraih
    - Keterlibatan dalam organisasi kemahasiswaan
    - Peluang pengembangan karir

11. **Siapa dosen pembimbing akademik dan bagaimana komunikasinya?** ✨ BARU
    - Nama dosen PA
    - Fungsi dan peran dosen PA
    - Jadwal konsultasi rutin yang direkomendasikan
    - Cara menghubungi dosen PA

12. **Apakah mahasiswa sudah siap untuk mengambil mata kuliah Tugas Akhir/Skripsi?** ✨ BARU
    - Evaluasi kelayakan ambil TA/Skripsi berdasarkan:
      - SKS minimal
      - IPK minimal (≥ 2.0)
    - Langkah-langkah persiapan TA
    - Timeline pengerjaan TA
    - Milestone yang harus dipenuhi

13. **Apa analisis risiko akademik keseluruhan untuk mahasiswa ini?** ✨ BARU
    - Skor risiko akademik (0-20)
    - Kategori risiko (Rendah/Sedang/Tinggi/Sangat Tinggi)
    - Analisis faktor-faktor risiko:
      - IPK
      - Kehadiran
      - Pengulangan mata kuliah
      - Sisa waktu studi
      - Progress SKS
    - Rekomendasi tindakan spesifik berdasarkan level risiko
    - Timeline follow-up dan monitoring

## Detail Pertanyaan Baru

### Pertanyaan #8: Kehadiran Mahasiswa
**Tujuan**: Mengidentifikasi disiplin dan partisipasi mahasiswa dalam pembelajaran

**Status Output**:
- 🟢 **Baik** (≥ 80%): Kehadiran memuaskan
- 🟡 **Cukup** (60-80%): Perlu peningkatan
- 🔴 **Kurang** (< 60%): Sangat perlu perbaikan

**Informasi yang Ditampilkan**:
- Persentase kehadiran
- Dampak kehadiran pada nilai dan pembelajaran
- Rekomendasi konkret untuk peningkatan

---

### Pertanyaan #9: Mata Kuliah Mengulang
**Tujuan**: Mengidentifikasi kesulitan akademik dan kebutuhan intervensi

**Status Output**:
- 🟢 **Baik** (0 MK): Tidak ada yang diulang
- 🟡 **Perhatian** (1-2 MK): Ada yang perlu diperbaiki
- 🔴 **Kritis** (> 2 MK): Butuh program khusus

**Informasi yang Ditampilkan**:
- Jumlah mata kuliah yang diulang
- Analisis penyebab kegagalan
- Dampak terhadap waktu studi dan IPK
- Rencana perbaikan spesifik

---

### Pertanyaan #10: Beasiswa & Prestasi
**Tujuan**: Mengenali pencapaian mahasiswa dan peluang pengembangan

**Status Output**:
- 🟢 **Penerima Beasiswa**: Status aktif penerima beasiswa
- ℹ️ **Berprestasi**: Memiliki prestasi meskipun tanpa beasiswa
- ℹ️ **Standar**: Belum ada beasiswa/prestasi khusus

**Informasi yang Ditampilkan**:
- Jenis dan status beasiswa (jika ada)
- Daftar prestasi akademik dan non-akademik
- Organisasi yang diikuti
- Peluang beasiswa lain dan pengembangan karir

---

### Pertanyaan #11: Dosen Pembimbing Akademik
**Tujuan**: Memastikan mahasiswa mendapat bimbingan akademik yang tepat

**Status Output**: ℹ️ Info

**Informasi yang Ditampilkan**:
- Nama dosen PA
- Peran dan fungsi dosen PA
- Jadwal konsultasi yang direkomendasikan
- Checklist komunikasi dengan dosen PA
- Cara menghubungi dosen PA

---

### Pertanyaan #12: Status Tugas Akhir/Skripsi
**Tujuan**: Memverifikasi kesiapan mahasiswa memasuki tahap akhir studi

**Status Output**:
- 🟢 **Siap**: Memenuhi semua syarat TA
- 🟡 **Belum Siap**: Perlu menyelesaikan persyaratan

**Informasi yang Ditampilkan**:
- Status kelayakan TA (berdasarkan SKS dan IPK)
- Persyaratan yang sudah/belum terpenuhi
- Langkah-langkah persiapan TA
- Timeline pengerjaan TA
- Milestone yang harus dicapai
- Estimasi waktu penyelesaian

---

### Pertanyaan #13: Analisis Risiko Akademik Komprehensif
**Tujuan**: Memberikan penilaian holistik risiko akademik mahasiswa

**Skor Risiko: 0-20**
- **0-3**: 🟢 Risiko Rendah - Status Normal
- **4-7**: 🟡 Risiko Sedang - Monitor Ketat
- **8-11**: 🟠 Risiko Tinggi - Intervensi Khusus
- **12+**: 🔴 Risiko Sangat Tinggi - Intervensi Segera

**Faktor yang Dianalisis**:
1. **IPK** (0-5 poin)
   - IPK < 2.0: 5 poin
   - IPK 2.0-2.5: 3 poin
   - IPK 2.5-3.0: 1 poin
   - IPK ≥ 3.0: 0 poin

2. **Kehadiran** (0-5 poin)
   - Kehadiran < 60%: 5 poin
   - Kehadiran 60-75%: 2 poin
   - Kehadiran ≥ 75%: 0 poin

3. **Pengulangan Mata Kuliah** (0-4 poin)
   - MK mengulang > 2: 4 poin
   - MK mengulang 1-2: 1 poin
   - Tidak ada: 0 poin

4. **Sisa Waktu Studi** (0-5 poin)
   - Sudah melewati batas: 5 poin
   - Sisa ≤ 1 tahun: 3 poin
   - Sisa 1-3 tahun: 0 poin
   - Sisa > 3 tahun: 0 poin

5. **Progress SKS** (0-2 poin)
   - Progress < 50%: 2 poin
   - Progress ≥ 50%: 0 poin

**Informasi yang Ditampilkan**:
- Skor risiko total
- Kategori risiko
- Daftar faktor risiko
- Rekomendasi tindakan spesifik berdasarkan level risiko
- Timeline follow-up dan monitoring
- Kontak person untuk bantuan

---

## Rekomendasi Tindakan Berdasarkan Risiko

### Risiko Sangat Tinggi (≥ 12)
- ⚡ Tindakan segera (minggu ini)
- 🔧 Rencana recovery (semester ini)
- ⚠️ Opsi terakhir jika tidak ada perbaikan

### Risiko Tinggi (8-11)
- 📋 Rencana perbaikan (2-3 minggu)
- 🎯 Target perbaikan (semester ini)
- 📊 Monitoring mingguan

### Risiko Sedang (4-7)
- 📊 Monitoring & support (rutin)
- 🎯 Target perbaikan jangka panjang
- 📞 Konsultasi berkala

### Risiko Rendah (0-3)
- ✅ Maintenance berkelanjutan
- 📞 Konsultasi regular
- 🎯 Pengembangan diri

---

## Manfaat Bagi Dekan

1. **Informasi Komprehensif**: Mendapatkan gambaran lengkap status mahasiswa dari berbagai aspek
2. **Identifikasi Dini**: Mengenali mahasiswa yang berisiko lebih awal
3. **Intervensi Tepat**: Memberikan rekomendasi spesifik sesuai kondisi mahasiswa
4. **Data Objektif**: Menggunakan parameter akademik yang jelas dan terukur
5. **Monitoring Sistematis**: Melacak progress dan efektivitas intervensi
6. **Pengambilan Keputusan**: Mendukung keputusan akademik dan administratif

---

## File yang Diubah

- **[analisis-mahasiswa/page.tsx](../front-end/app/analisis-mahasiswa/page.tsx)**
  - Ditambahkan 6 pertanyaan baru (ID: kehadiran, mk_mengulang, beasiswa_prestasi, dosen_pa, status_ta, risiko_akademik)
  - Update info box untuk menampilkan 13 pertanyaan
  - Setiap pertanyaan dilengkapi dengan analisis mendalam dan rekomendasi

---

## Cara Menggunakan

1. **Buka halaman Analisis Mahasiswa**
   - Cari mahasiswa terlebih dahulu di halaman "Cari Mahasiswa"
   
2. **Lihat Pertanyaan Satu per Satu atau Semua Sekaligus**
   - Gunakan tombol "Tampilkan Satu per Satu" atau "Tampilkan Semua Pertanyaan"
   - Navigasi dengan tombol Previous/Next atau klik indikator progress

3. **Baca Analisis Mendalam**
   - Setiap pertanyaan menampilkan:
     - Status (baik/peringatan/bahaya/info)
     - Jawaban singkat
     - Analisis dan penjelasan detail

4. **Lihat Data Lengkap**
   - Klik "Lihat Data Lengkap Mahasiswa" untuk melihat biodata lengkap

---

## Catatan Teknis

- Total file yang dimodifikasi: 1 file
- Jumlah baris kode yang ditambahkan: ~800+ baris
- Format: TypeScript/React dengan Tailwind CSS
- Icons: Heroicons (24px)
- Color scheme: Blue-900 (primary), with status colors (green/yellow/red)

---

## Next Steps (Rekomendasi Pengembangan)

1. **Database Integration**: Hubungkan dengan backend API untuk data real-time
2. **Export Report**: Tambahkan fitur export ke PDF/Excel
3. **Historical Tracking**: Simpan riwayat analisis untuk tracking progress
4. **Dashboard**: Buat dashboard ringkasan untuk admin/dekan
5. **Notification System**: Sistem alert otomatis untuk mahasiswa berisiko
6. **Mobile Responsive**: Optimasi untuk tampilan mobile

---

**Status**: ✅ Completed
**Tanggal Update**: 29 Januari 2026
**Versi**: 2.0
