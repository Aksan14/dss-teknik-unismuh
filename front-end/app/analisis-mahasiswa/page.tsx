'use client';

import {
    AcademicCapIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentCheckIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMahasiswa } from '../../context/MahasiswaContext';

interface AnalisisItem {
  id: string;
  pertanyaan: string;
  jawaban: string;
  status: 'baik' | 'peringatan' | 'bahaya' | 'info';
  detail: string;
}

export default function AnalisisMahasiswaPage() {
  const { mahasiswaData, hasilAnalisis, resetData } = useMahasiswa();
  const router = useRouter();
  const [analisisList, setAnalisisList] = useState<AnalisisItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Generate analisis berdasarkan data mahasiswa
  useEffect(() => {
    if (!mahasiswaData) return;

    const tahunSekarang = new Date().getFullYear();
    const lamaKuliah = tahunSekarang - mahasiswaData.angkatan;
    const batasWaktuS1 = 7; // 14 semester = 7 tahun
    const sisaWaktu = batasWaktuS1 - lamaKuliah;
    const persenSks = Math.round((mahasiswaData.sks_lulus / mahasiswaData.total_sks_wajib) * 100);
    const sksBelumLulus = mahasiswaData.total_sks_wajib - mahasiswaData.sks_lulus;
    const semesterDibutuhkan = Math.ceil(sksBelumLulus / 20); // Asumsi 20 SKS per semester
    const tahunDibutuhkan = Math.ceil(semesterDibutuhkan / 2);
    const sisaSemester = (batasWaktuS1 * 2) - mahasiswaData.lama_studi;

    const analisis: AnalisisItem[] = [
      // Pertanyaan 1: Informasi Kontak Mahasiswa
      {
        id: 'kontak',
        pertanyaan: 'Bagaimana informasi kontak mahasiswa ini?',
        jawaban: `${mahasiswaData.nama} - ${mahasiswaData.nim}`,
        status: 'info',
        detail: `IDENTITAS MAHASISWA:
• Nama: ${mahasiswaData.nama}
• NIM: ${mahasiswaData.nim}
• Jurusan: ${mahasiswaData.jurusan}
• Fakultas: ${mahasiswaData.fakultas}
• Angkatan: ${mahasiswaData.angkatan}

ALAMAT DOMISILI:
• ${mahasiswaData.alamat}

EMAIL AKTIF:
• ${mahasiswaData.email}

NOMOR WHATSAPP:
• ${mahasiswaData.no_hp}

CATATAN:
• Informasi di atas dapat digunakan untuk menghubungi mahasiswa
• Pastikan data kontak selalu diperbarui`
      },
      // Pertanyaan 2: Total Mata Kuliah Lulus
      {
        id: 'mk_lulus',
        pertanyaan: 'Berapa total mata kuliah yang sudah lulus?',
        jawaban: `${mahasiswaData.mk_lulus} Mata Kuliah`,
        status: mahasiswaData.mk_lulus >= 40 ? 'baik' : mahasiswaData.mk_lulus >= 20 ? 'peringatan' : 'info',
        detail: (() => {
          if (mahasiswaData.mk_lulus >= 40) {
            return `Mahasiswa telah menyelesaikan ${mahasiswaData.mk_lulus} mata kuliah. Dengan IPK ${mahasiswaData.ipk.toFixed(2)}, mahasiswa menunjukkan konsistensi yang baik dalam menyelesaikan perkuliahan.`;
          } else if (mahasiswaData.mk_lulus >= 20) {
            return `Mahasiswa telah menyelesaikan ${mahasiswaData.mk_lulus} mata kuliah. Masih dalam tahap pertengahan studi. Dengan lama kuliah ${lamaKuliah} tahun, perlu menjaga konsistensi untuk menyelesaikan sisa mata kuliah.`;
          }
          return `Mahasiswa baru menyelesaikan ${mahasiswaData.mk_lulus} mata kuliah. Masih dalam tahap awal studi.`;
        })()
      },
      // Pertanyaan 3: Total SKS Lulus
      {
        id: 'sks_lulus',
        pertanyaan: 'Berapa total SKS yang sudah lulus?',
        jawaban: `${mahasiswaData.sks_lulus} SKS dari ${mahasiswaData.total_sks_wajib} SKS (${persenSks}%)`,
        status: persenSks >= 75 ? 'baik' : persenSks >= 50 ? 'peringatan' : 'info',
        detail: (() => {
          const baseDetail = `Mahasiswa telah menyelesaikan ${mahasiswaData.sks_lulus} SKS dari total ${mahasiswaData.total_sks_wajib} SKS wajib (${persenSks}%).`;
          if (persenSks >= 75) {
            return `${baseDetail} Progress sangat baik! Dengan ${mahasiswaData.mk_lulus} mata kuliah yang sudah lulus dan IPK ${mahasiswaData.ipk.toFixed(2)}, mahasiswa sudah mendekati tahap akhir studi.`;
          } else if (persenSks >= 50) {
            return `${baseDetail} Progress cukup baik. Dari ${mahasiswaData.mk_lulus} mata kuliah yang sudah ditempuh, mahasiswa berada di pertengahan masa studi.`;
          }
          return `${baseDetail} Progress masih tahap awal. Mahasiswa perlu mempercepat penyelesaian SKS untuk menghindari keterlambatan kelulusan.`;
        })()
      },
      // Pertanyaan 4: SKS Belum Lulus
      {
        id: 'sks_belum_lulus',
        pertanyaan: 'Berapa SKS yang belum lulus?',
        jawaban: `${sksBelumLulus} SKS`,
        status: sksBelumLulus <= 24 ? 'baik' : sksBelumLulus <= 50 ? 'peringatan' : 'info',
        detail: (() => {
          if (sksBelumLulus <= 24) {
            return `Hanya tersisa ${sksBelumLulus} SKS untuk mencapai kelulusan. Dengan ${mahasiswaData.sks_lulus} SKS yang sudah lulus dan IPK ${mahasiswaData.ipk.toFixed(2)}, mahasiswa tinggal menyelesaikan sekitar ${semesterDibutuhkan} semester lagi. ${sisaWaktu > 0 ? `Waktu tersisa ${sisaWaktu} tahun, sangat cukup untuk lulus tepat waktu.` : 'Perlu segera menyelesaikan studi!'}`;
          } else if (sksBelumLulus <= 50) {
            return `Masih tersisa ${sksBelumLulus} SKS untuk kelulusan. Dari ${mahasiswaData.mk_lulus} mata kuliah yang sudah lulus (${mahasiswaData.sks_lulus} SKS), mahasiswa membutuhkan sekitar ${semesterDibutuhkan} semester (${tahunDibutuhkan} tahun) untuk menyelesaikan studi. ${sisaWaktu > tahunDibutuhkan ? 'Waktu masih mencukupi.' : 'PERINGATAN: Waktu tersisa terbatas!'}`;
          }
          return `Masih tersisa ${sksBelumLulus} SKS untuk kelulusan. Dengan ${mahasiswaData.sks_lulus} SKS yang sudah lulus, mahasiswa membutuhkan sekitar ${semesterDibutuhkan} semester untuk menyelesaikan. Perlu menjaga konsistensi dan mengambil beban SKS yang optimal.`;
        })()
      },
      // Pertanyaan 5: Jumlah IPK
      {
        id: 'ipk',
        pertanyaan: 'Berapa IPK mahasiswa ini?',
        jawaban: `IPK ${mahasiswaData.ipk.toFixed(2)}`,
        status: mahasiswaData.ipk >= 3.0 ? 'baik' : mahasiswaData.ipk >= 2.0 ? 'peringatan' : 'bahaya',
        detail: (() => {
          const mkInfo = `Dari ${mahasiswaData.mk_lulus} mata kuliah (${mahasiswaData.sks_lulus} SKS) yang sudah ditempuh selama ${lamaKuliah} tahun kuliah`;
          if (mahasiswaData.ipk >= 3.5) {
            return `IPK ${mahasiswaData.ipk.toFixed(2)} - CUMLAUDE! ${mkInfo}, mahasiswa menunjukkan performa akademik yang sangat memuaskan. ${mahasiswaData.mk_mengulang === 0 ? 'Tidak ada mata kuliah yang mengulang.' : `Meskipun ada ${mahasiswaData.mk_mengulang} mata kuliah yang harus diulang.`}`;
          } else if (mahasiswaData.ipk >= 3.0) {
            return `IPK ${mahasiswaData.ipk.toFixed(2)} - SANGAT BAIK. ${mkInfo}, mahasiswa menunjukkan performa akademik yang baik. Dapat mengambil beban SKS maksimal untuk mempercepat kelulusan.`;
          } else if (mahasiswaData.ipk >= 2.5) {
            return `IPK ${mahasiswaData.ipk.toFixed(2)} - CUKUP. ${mkInfo}, mahasiswa perlu meningkatkan performa akademik. ${mahasiswaData.mk_mengulang > 0 ? `Terdapat ${mahasiswaData.mk_mengulang} mata kuliah yang perlu diperbaiki.` : ''} Sisa ${sksBelumLulus} SKS harus diselesaikan dengan nilai yang lebih baik.`;
          } else if (mahasiswaData.ipk >= 2.0) {
            return `IPK ${mahasiswaData.ipk.toFixed(2)} - PERLU PERHATIAN. ${mkInfo}, IPK mendekati batas minimum. ${mahasiswaData.mk_mengulang > 0 ? `Terdapat ${mahasiswaData.mk_mengulang} mata kuliah yang harus diulang.` : ''} Dengan sisa ${sksBelumLulus} SKS dan waktu ${sisaWaktu} tahun, perlu peningkatan signifikan.`;
          }
          return `IPK ${mahasiswaData.ipk.toFixed(2)} - KRITIS! ${mkInfo}, IPK di bawah standar minimum (2.0). ${mahasiswaData.mk_mengulang > 0 ? `Terdapat ${mahasiswaData.mk_mengulang} mata kuliah yang harus diulang.` : ''} MAHASISWA BERISIKO DROP OUT jika tidak ada peningkatan signifikan.`;
        })()
      },
      // Pertanyaan 6: Sisa Lama Studi
      {
        id: 'sisa_studi',
        pertanyaan: 'Berapa sisa waktu studi yang tersisa?',
        jawaban: sisaSemester > 0 ? `${sisaSemester} semester (${sisaWaktu} tahun)` : 'SUDAH MELEWATI BATAS!',
        status: sisaWaktu >= 3 ? 'baik' : sisaWaktu >= 1 ? 'peringatan' : 'bahaya',
        detail: (() => {
          const contextInfo = `Mahasiswa telah menyelesaikan ${mahasiswaData.sks_lulus} SKS (${persenSks}%) dengan IPK ${mahasiswaData.ipk.toFixed(2)} selama ${lamaKuliah} tahun kuliah.`;
          if (sisaWaktu >= 3) {
            return `${contextInfo} Sisa waktu studi: ${sisaSemester} semester (${sisaWaktu} tahun). Waktu sangat mencukupi untuk menyelesaikan ${sksBelumLulus} SKS tersisa. Estimasi kelulusan: ${tahunDibutuhkan} tahun lagi.`;
          } else if (sisaWaktu >= 1) {
            return `${contextInfo} PERINGATAN: Sisa waktu studi hanya ${sisaSemester} semester (${sisaWaktu} tahun). Masih tersisa ${sksBelumLulus} SKS yang harus diselesaikan. ${semesterDibutuhkan > sisaSemester ? 'Perlu mengambil beban SKS maksimal untuk lulus tepat waktu!' : 'Masih memungkinkan untuk lulus tepat waktu dengan beban normal.'}`;
          }
          return `${contextInfo} KRITIS: Batas waktu studi S1 adalah 14 semester (7 tahun). ${sisaSemester <= 0 ? 'Mahasiswa SUDAH MELEWATI BATAS WAKTU dan berisiko DROP OUT!' : `Hanya tersisa ${sisaSemester} semester. Dengan ${sksBelumLulus} SKS tersisa, mahasiswa SANGAT BERISIKO tidak dapat menyelesaikan studi tepat waktu.`}`;
        })()
      },
      // Pertanyaan 7: Lama Kuliah & Estimasi
      {
        id: 'lama_kuliah',
        pertanyaan: 'Sudah berapa tahun kuliah dan berapa sisa waktu hingga lulus atau DO?',
        jawaban: (() => {
          if (sisaWaktu <= 0) return `${lamaKuliah} tahun - MELEWATI BATAS DO!`;
          if (semesterDibutuhkan <= sisaSemester) return `${lamaKuliah} tahun - Estimasi lulus ${tahunDibutuhkan} tahun lagi`;
          return `${lamaKuliah} tahun - Berisiko DO dalam ${sisaWaktu} tahun`;
        })(),
        status: (() => {
          if (sisaWaktu <= 0) return 'bahaya';
          if (sisaWaktu <= 1 && persenSks < 75) return 'bahaya';
          if (lamaKuliah <= 4) return 'baik';
          if (lamaKuliah <= 6) return 'peringatan';
          return 'bahaya';
        })(),
        detail: (() => {
          // Hitung beban SKS per semester yang dibutuhkan
          const bebanSksPerSemester = sisaSemester > 0 ? Math.ceil(sksBelumLulus / sisaSemester) : 0;
          const bebanIdeal = bebanSksPerSemester <= 20 ? 'Normal (≤20 SKS)' : bebanSksPerSemester <= 24 ? 'Maksimal (21-24 SKS)' : 'Tidak Memungkinkan (>24 SKS)';
          
          // Status IPK
          const statusIpk = mahasiswaData.ipk >= 3.5 ? 'Cumlaude' : mahasiswaData.ipk >= 3.0 ? 'Sangat Baik' : mahasiswaData.ipk >= 2.5 ? 'Baik' : mahasiswaData.ipk >= 2.0 ? 'Cukup' : 'Di Bawah Standar';
          
          // Rekomendasi beban SKS berdasarkan IPK
          const rekomendasiSks = mahasiswaData.ipk >= 3.0 ? '22-24 SKS' : mahasiswaData.ipk >= 2.5 ? '18-21 SKS' : '15-18 SKS';

          // Kesimpulan berdasarkan kondisi
          if (sisaWaktu <= 0) {
            return `🚨 STATUS: TERANCAM DROP OUT

📊 DATA AKADEMIK:
• Lama Kuliah: ${lamaKuliah} tahun (${mahasiswaData.lama_studi} semester)
• Batas Maksimum: 7 tahun (14 semester)
• Status Batas Waktu: SUDAH TERLEWATI

📈 PROGRESS STUDI:
• MK Lulus: ${mahasiswaData.mk_lulus} Mata Kuliah
• SKS Lulus: ${mahasiswaData.sks_lulus}/${mahasiswaData.total_sks_wajib} SKS (${persenSks}%)
• SKS Belum Lulus: ${sksBelumLulus} SKS
• IPK: ${mahasiswaData.ipk.toFixed(2)} (${statusIpk})
• MK Mengulang: ${mahasiswaData.mk_mengulang} Mata Kuliah

📋 TINDAKAN YANG DIPERLUKAN:
• Evaluasi akademik oleh pihak fakultas
• Konsultasi dengan Wakil Dekan Bidang Akademik
• Ajukan permohonan perpanjangan studi (jika memenuhi syarat)
• Pertimbangkan opsi cuti atau pengunduran diri

⚠️ PERINGATAN:
• Berdasarkan peraturan UNISMUH, mahasiswa yang melewati batas waktu studi dapat dikenakan sanksi Drop Out (DO)`;
          }
          
          if (semesterDibutuhkan > sisaSemester) {
            return `⚠️ STATUS: BERISIKO TIDAK LULUS TEPAT WAKTU

📊 DATA AKADEMIK:
• Lama Kuliah: ${lamaKuliah} tahun (${mahasiswaData.lama_studi} semester)
• Batas Maksimum: 7 tahun (14 semester)
• Sisa Waktu: ${sisaSemester} semester (${sisaWaktu} tahun)

📈 PROGRESS STUDI:
• MK Lulus: ${mahasiswaData.mk_lulus} Mata Kuliah
• SKS Lulus: ${mahasiswaData.sks_lulus}/${mahasiswaData.total_sks_wajib} SKS (${persenSks}%)
• SKS Belum Lulus: ${sksBelumLulus} SKS
• IPK: ${mahasiswaData.ipk.toFixed(2)} (${statusIpk})
• MK Mengulang: ${mahasiswaData.mk_mengulang} Mata Kuliah

⏱️ ESTIMASI KELULUSAN:
• Semester Dibutuhkan: ${semesterDibutuhkan} semester
• Semester Tersisa: ${sisaSemester} semester
• Beban per Semester: ${bebanSksPerSemester} SKS (${bebanIdeal})

📋 TINDAKAN YANG DIPERLUKAN:
• Ambil beban SKS MAKSIMAL (24 SKS) setiap semester
• Prioritaskan mata kuliah wajib dan prasyarat
• Konsultasi rutin dengan Dosen Pembimbing Akademik
• Hindari mengulang mata kuliah - fokus pada nilai lulus
• Pertimbangkan semester pendek/antara jika tersedia

⚠️ DEADLINE:
• Mahasiswa harus lulus dalam ${sisaWaktu} tahun
• Jika tidak, akan terkena DROP OUT`;
          }

          if (mahasiswaData.ipk < 2.0) {
            return `⚠️ STATUS: IPK DI BAWAH STANDAR MINIMUM

📊 DATA AKADEMIK:
• Lama Kuliah: ${lamaKuliah} tahun (${mahasiswaData.lama_studi} semester)
• Batas Maksimum: 7 tahun (14 semester)
• Sisa Waktu: ${sisaSemester} semester (${sisaWaktu} tahun)

📈 PROGRESS STUDI:
• MK Lulus: ${mahasiswaData.mk_lulus} Mata Kuliah
• SKS Lulus: ${mahasiswaData.sks_lulus}/${mahasiswaData.total_sks_wajib} SKS (${persenSks}%)
• SKS Belum Lulus: ${sksBelumLulus} SKS
• IPK: ${mahasiswaData.ipk.toFixed(2)} (${statusIpk}) ⚠️
• MK Mengulang: ${mahasiswaData.mk_mengulang} Mata Kuliah

📋 TINDAKAN YANG DIPERLUKAN:
• Ikuti program pembinaan akademik dari fakultas
• Perbaiki nilai mata kuliah yang rendah melalui program remedial
• Kurangi beban SKS (15-18 SKS) untuk fokus pada kualitas
• Konsultasi intensif dengan Dosen Pembimbing Akademik
• Identifikasi dan atasi hambatan belajar

⚠️ PERINGATAN:
• Jika IPK tidak meningkat dalam 2 semester berturut-turut
• Mahasiswa berisiko terkena sanksi akademik hingga DROP OUT`;
          }

          if (persenSks >= 90) {
            return `✅ STATUS: HAMPIR LULUS - TAHAP AKHIR

📊 DATA AKADEMIK:
• Lama Kuliah: ${lamaKuliah} tahun (${mahasiswaData.lama_studi} semester)
• Batas Maksimum: 7 tahun (14 semester)
• Sisa Waktu: ${sisaSemester} semester (${sisaWaktu} tahun)

📈 PROGRESS STUDI:
• MK Lulus: ${mahasiswaData.mk_lulus} Mata Kuliah
• SKS Lulus: ${mahasiswaData.sks_lulus}/${mahasiswaData.total_sks_wajib} SKS (${persenSks}%) ✅
• SKS Belum Lulus: ${sksBelumLulus} SKS
• IPK: ${mahasiswaData.ipk.toFixed(2)} (${statusIpk})
• MK Mengulang: ${mahasiswaData.mk_mengulang} Mata Kuliah

⏱️ ESTIMASI KELULUSAN:
• Semester Dibutuhkan: ${semesterDibutuhkan} semester

📋 LANGKAH MENUJU KELULUSAN:
• Selesaikan sisa ${sksBelumLulus} SKS mata kuliah wajib
• Fokus pada penyelesaian Tugas Akhir/Skripsi
• Persiapkan dokumen untuk yudisium
• Pastikan tidak ada tunggakan administrasi

🎓 PREDIKAT KELULUSAN:
• ${mahasiswaData.ipk >= 3.5 ? 'CUMLAUDE' : mahasiswaData.ipk >= 3.0 ? 'Sangat Memuaskan' : 'Memuaskan'}`;
          }

          if (persenSks >= 75 && sisaWaktu >= 1) {
            return `✅ STATUS: BAIK - ON TRACK

📊 DATA AKADEMIK:
• Lama Kuliah: ${lamaKuliah} tahun (${mahasiswaData.lama_studi} semester)
• Batas Maksimum: 7 tahun (14 semester)
• Sisa Waktu: ${sisaSemester} semester (${sisaWaktu} tahun)

📈 PROGRESS STUDI:
• MK Lulus: ${mahasiswaData.mk_lulus} Mata Kuliah
• SKS Lulus: ${mahasiswaData.sks_lulus}/${mahasiswaData.total_sks_wajib} SKS (${persenSks}%)
• SKS Belum Lulus: ${sksBelumLulus} SKS
• IPK: ${mahasiswaData.ipk.toFixed(2)} (${statusIpk})
• MK Mengulang: ${mahasiswaData.mk_mengulang} Mata Kuliah

⏱️ ESTIMASI KELULUSAN:
• Semester Dibutuhkan: ${semesterDibutuhkan} semester
• Tahun Dibutuhkan: ${tahunDibutuhkan} tahun

📋 REKOMENDASI:
• Pertahankan konsistensi akademik dengan IPK ${mahasiswaData.ipk.toFixed(2)}
• Selesaikan ${sksBelumLulus} SKS tersisa dalam ${semesterDibutuhkan} semester
• Mulai persiapan Tugas Akhir/Skripsi
• Manfaatkan waktu tersisa untuk magang atau kegiatan penunjang

🎯 TARGET:
• Lulus dalam ${tahunDibutuhkan} tahun
• IPK ${mahasiswaData.ipk >= 3.0 ? 'dipertahankan' : 'ditingkatkan ke 3.0'}`;
          }

          return `ℹ️ STATUS: NORMAL - PERTENGAHAN STUDI

📊 DATA AKADEMIK:
• Lama Kuliah: ${lamaKuliah} tahun (${mahasiswaData.lama_studi} semester)
• Batas Maksimum: 7 tahun (14 semester)
• Sisa Waktu: ${sisaSemester} semester (${sisaWaktu} tahun)

📈 PROGRESS STUDI:
• MK Lulus: ${mahasiswaData.mk_lulus} Mata Kuliah
• SKS Lulus: ${mahasiswaData.sks_lulus}/${mahasiswaData.total_sks_wajib} SKS (${persenSks}%)
• SKS Belum Lulus: ${sksBelumLulus} SKS
• IPK: ${mahasiswaData.ipk.toFixed(2)} (${statusIpk})
• MK Mengulang: ${mahasiswaData.mk_mengulang} Mata Kuliah

⏱️ ESTIMASI KELULUSAN:
• Semester Dibutuhkan: ${semesterDibutuhkan} semester
• Tahun Dibutuhkan: ${tahunDibutuhkan} tahun
• Beban per Semester: ${bebanSksPerSemester} SKS (${bebanIdeal})

📋 REKOMENDASI:
• Ambil beban SKS sesuai kemampuan (${rekomendasiSks})
• Tingkatkan IPK secara bertahap dari ${mahasiswaData.ipk.toFixed(2)}
• ${mahasiswaData.mk_mengulang > 0 ? `Prioritaskan perbaikan ${mahasiswaData.mk_mengulang} mata kuliah yang mengulang` : 'Hindari nilai yang menyebabkan mengulang'}
• Konsultasi berkala dengan Dosen Pembimbing Akademik
• Ikuti kegiatan kemahasiswaan untuk pengembangan soft skill

📅 TIMELINE:
• Beban per semester: ${bebanSksPerSemester} SKS
• Estimasi lulus: ${tahunDibutuhkan} tahun`;
        })()
      },
      // Pertanyaan 9: Mata Kuliah Mengulang
      {
        id: 'mk_mengulang',
        pertanyaan: 'Apakah ada mata kuliah yang perlu diulang atau diperbaiki?',
        jawaban: mahasiswaData.mk_mengulang > 0 ? `${mahasiswaData.mk_mengulang} Mata Kuliah` : 'Tidak Ada',
        status: mahasiswaData.mk_mengulang === 0 ? 'baik' : mahasiswaData.mk_mengulang <= 2 ? 'peringatan' : 'bahaya',
        detail: (() => {
          if (mahasiswaData.mk_mengulang === 0) {
            return `✅ SEMPURNA - TIDAK ADA MATA KULIAH YANG DIULANG

📊 STATUS AKADEMIK:
• Jumlah MK Mengulang: ${mahasiswaData.mk_mengulang}
• Total MK Lulus: ${mahasiswaData.mk_lulus} Mata Kuliah
• Status: Konsisten & Bertanggung Jawab

📈 PENCAPAIAN:
Mahasiswa telah berhasil lulus semua mata kuliah yang diambil tanpa perlu mengulang. Ini menunjukkan:
• Pemahaman materi yang baik
• Kemampuan belajar yang konsisten
• Tanggung jawab akademik tinggi
• Manajemen waktu yang baik

⭐ REKOMENDASI:
• Pertahankan standar akademik yang tinggi
• Terus pertahankan disiplin dan konsistensi
• Fokus pada peningkatan nilai untuk IPK lebih tinggi
• Manfaatkan waktu untuk kegiatan pengembangan lain`;
          } else if (mahasiswaData.mk_mengulang <= 2) {
            return `⚠️ PERLU PERHATIAN - ADA MATA KULIAH YANG DIULANG

📊 STATUS AKADEMIK:
• Jumlah MK Mengulang: ${mahasiswaData.mk_mengulang} Mata Kuliah
• Total MK Lulus: ${mahasiswaData.mk_lulus} Mata Kuliah
• Status: Perlu Perbaikan

📈 ANALISIS:
Mahasiswa memiliki ${mahasiswaData.mk_mengulang} mata kuliah yang nilai kurang memuaskan atau perlu diperbaiki. Ini dapat disebabkan oleh:
• Pemahaman materi yang kurang mendalam
• Kurangnya persiapan saat ujian
• Kesulitan pada topik tertentu
• Manajemen waktu yang belum optimal

⚠️ DAMPAK:
• Waktu studi bertambah (minimal 1 semester)
• Beban mental dan finansial tambahan
• Mungkin tertinggal dari teman sekelas
• Mempengaruhi IPK secara keseluruhan

📋 RENCANA PERBAIKAN:
1. ANALISIS PENYEBAB
   - Diskusi dengan dosen mata kuliah tersebut
   - Identifikasi topik yang sulit dipahami
   - Cari tahu apakah ada faktor eksternal

2. STRATEGI BELAJAR ULANG
   - Ambil mata kuliah yang sama pada semester berikutnya
   - Ikuti tutorial/bimbingan ekstra sebelum ujian
   - Bentuk study group dengan teman yang nilai baik
   - Manfaatkan office hour dosen

3. MONITORING PROGRESS
   - Lapor ke dosen PA setiap minggu
   - Evaluasi pemahaman setiap topik
   - Lakukan evaluasi diri sebelum ujian

⏰ TARGET:
Kurangi mata kuliah mengulang hingga 0 dalam 2 semester ke depan`;
          }
          return `🔴 SERIUS - BANYAK MATA KULIAH YANG DIULANG

📊 STATUS AKADEMIK:
• Jumlah MK Mengulang: ${mahasiswaData.mk_mengulang} Mata Kuliah
• Total MK Lulus: ${mahasiswaData.mk_lulus} Mata Kuliah
• Status: KRITIS - Memerlukan Intervensi Segera

⚠️ ANALISIS SITUASI:
Jumlah mata kuliah yang diulang sejumlah ${mahasiswaData.mk_mengulang} menunjukkan:
• Kesulitan signifikan dalam menguasai materi
• Metode belajar yang tidak efektif
• Kemungkinan masalah teknis/personal yang lebih serius
• Risiko tinggi terhadap masa depan akademik

❌ DAMPAK NEGATIF:
• Waktu studi bertambah signifikan (2-3 semester lebih)
• Beban finansial meningkat
• Tekanan psikologis dan frustrasi
• IPK menurun drastis
• Potensi DROP OUT meningkat
• Tertinggal jauh dari teman sekelas

🚨 TINDAKAN SEGERA YANG HARUS DILAKUKAN:
1. KONSULTASI DENGAN DEKAN/WAKIL DEKAN AKADEMIK
   - Lapor situasi akademik yang kritis
   - Minta bantuan program khusus/pembinaan intensif
   - Diskusikan opsi (cuti, turun semester, dll)

2. ANALISIS MENDALAM BERSAMA DOSEN PA
   - Identifikasi mata kuliah mana yang paling sulit
   - Cari penyebab kegagalan berulang
   - Apakah ada masalah kesehatan/pribadi?
   - Apakah pilihan jurusan tepat?

3. PROGRAM PEMBINAAN INTENSIF
   - Daftar untuk tutorial/les khusus
   - Bimbingan akademik setiap minggu
   - Monitoring kehadiran ketat
   - Motivasi dan dukungan psikologis

4. EVALUASI KELAYAKAN LANJUT
   - Apakah mahasiswa sanggup melanjutkan?
   - Perlu dipertimbangkan opsi beasiswa/bantuan khusus
   - Evaluasi kesehatan mental/fisik
   - Diskusi dengan orang tua jika perlu

📞 CONTACT PERSON:
• Dosen PA: ${mahasiswaData.dosen_pa}
• Dekan Akademik/BAAK: Kantor Pusat Fakultas

⏰ URGENCY: SEGERA - Dalam waktu 1 minggu`;
        })()
      },
      // Pertanyaan 10: Beasiswa & Prestasi
      {
        id: 'beasiswa_prestasi',
        pertanyaan: 'Apakah mahasiswa menerima beasiswa dan apa prestasi yang telah dicapai?',
        jawaban: mahasiswaData.beasiswa ? `${mahasiswaData.beasiswa}` : 'Tidak Ada Beasiswa',
        status: mahasiswaData.beasiswa ? 'baik' : 'info',
        detail: (() => {
          const prestasiText = mahasiswaData.prestasi && mahasiswaData.prestasi.length > 0 
            ? mahasiswaData.prestasi.map((p, i) => `${i + 1}. ${p}`).join('\n')
            : 'Belum ada prestasi yang tercatat';
          
          const organisasiText = mahasiswaData.organisasi && mahasiswaData.organisasi.length > 0
            ? mahasiswaData.organisasi.map((o, i) => `${i + 1}. ${o}`).join('\n')
            : 'Belum ada organisasi yang diikuti';

          if (mahasiswaData.beasiswa) {
            return `✅ MAHASISWA PENERIMA BEASISWA

📊 DATA KESEJAHTERAAN:
• Jenis Beasiswa: ${mahasiswaData.beasiswa}
• Status: Aktif
• IPK Minimal: ${mahasiswaData.ipk.toFixed(2)} (Batas: 2.5)

📈 PRESTASI AKADEMIK:
Prestasi yang telah dicapai:
${prestasiText}

🏢 KETERLIBATAN ORGANISASI:
${organisasiText}

📋 INFORMASI BEASISWA:
• Mahasiswa telah memenuhi kriteria untuk menerima beasiswa
• Komitmen menjaga IPK dan prestasi harus diprioritaskan
• Setiap prestasi akademik dihargai program ini

✨ REKOMENDASI:
1. PERTAHANKAN PRESTASI
   - Jaga IPK ≥ 2.5 (lebih baik ≥ 3.0)
   - Tingkatkan pencapaian akademik & non-akademik
   - Ikut kompetisi akademik tingkat regional/nasional

2. MAKSIMALKAN PELUANG
   - Manfaatkan beasiswa untuk biaya pendidikan
   - Akses program mentoring/workshop dari penyedia beasiswa
   - Networking dengan sesama penerima beasiswa

3. KONTRIBUSI SOSIAL
   - Tukar pengetahuan dengan mahasiswa lain
   - Ikut kegiatan sosial/pengabdian masyarakat
   - Jadilah role model bagi mahasiswa lain

4. LAPORAN & MONITORING
   - Lapor rutin ke bagian beasiswa setiap semester
   - Update prestasi terbaru
   - Perpanjangan beasiswa sesuai prosedur`;
          }
          
          const hasPrestasi = mahasiswaData.prestasi && mahasiswaData.prestasi.length > 0;
          const hasOrganisasi = mahasiswaData.organisasi && mahasiswaData.organisasi.length > 0;
          
          if (hasPrestasi || hasOrganisasi) {
            return `ℹ️ MAHASISWA TANPA BEASISWA RESMI - NAMUN BERPRESTASI

📊 DATA STATUS:
• Beasiswa: Tidak Ada
• Status Akademik: Memiliki Prestasi
• IPK: ${mahasiswaData.ipk.toFixed(2)}

📈 PRESTASI YANG TELAH DICAPAI:
${prestasiText}

🏢 KETERLIBATAN ORGANISASI:
${organisasiText}

📋 ANALISIS:
Meskipun tidak menerima beasiswa formal, mahasiswa telah menunjukkan:
• Kemampuan akademik dan non-akademik yang baik
• Motivasi tinggi untuk berkembang
• Komitmen pada aktivitas kemahasiswaan
• Potensi leadership dan inovasi

💡 REKOMENDASI & PELUANG:
1. CARI PELUANG BEASISWA LAIN
   - Hubungi BAAK untuk informasi beasiswa lainnya
   - Cek beasiswa dari industri/korporat sesuai jurusan
   - Ikuti seleksi beasiswa penuh atau partial

2. DUKUNGAN AKADEMIK
   - Daftar ke program akselerasi jika ada
   - Manfaatkan mentoring dari senior/dosen
   - Ambil mata kuliah pilihan berkualitas tinggi

3. PENGEMBANGAN KARIR
   - Gunakan prestasi untuk magang berkualitas
   - Bangun portfolio untuk industri
   - Jalin networking dengan profesional

4. PERTAHANKAN MOMENTUM
   - Terus aktif di organisasi dan kompetisi
   - Jaga konsistensi akademik
   - Targetkan prestasi yang lebih tinggi

🎯 PROSPEK:
Mahasiswa memiliki potensi baik untuk berkembang menjadi pemimpin/profesional masa depan`;
          }
          
          return `ℹ️ MAHASISWA TANPA BEASISWA DAN PRESTASI KHUSUS

📊 DATA STATUS:
• Beasiswa: Tidak Ada
• Prestasi Khusus: Belum Ada Tercatat
• IPK: ${mahasiswaData.ipk.toFixed(2)}

📈 ANALISIS:
Mahasiswa belum terdaftar sebagai penerima beasiswa dan belum memiliki prestasi akademik/non-akademik yang tercatat. Status ini dapat berarti:
• Masih dalam tahap awal studi
• Belum mengakses informasi beasiswa
• Fokus pada akademik dasar terlebih dahulu

💡 REKOMENDASI UNTUK PENGEMBANGAN:
1. EKSPLORASI PELUANG BEASISWA
   - Kunjungi kantor BAAK/beasiswa
   - Cek website resmi universitas untuk info beasiswa
   - Persiapkan dokumen untuk beasiswa internal/eksternal
   - Tingkatkan IPK jika syarat IPK minimal belum tercapai

2. KETERLIBATAN AKADEMIK
   - Ikuti seminar/workshop akademik
   - Bergabung dengan klub/organisasi minat
   - Cari aktivitas yang sesuai dengan passion
   - Bangun skill tambahan (coding, bahasa asing, dll)

3. PENCARIAN PRESTASI
   - Cari kompetisi akademik/non-akademik
   - Ikuti kegiatan riset/proyek dari dosen
   - Ambil inisiatif dalam tugas kelompok
   - Targetkan minimal satu prestasi per semester

4. KOMUNIKASI DENGAN DOSEN PA
   - Minta saran untuk pengembangan diri
   - Lapor perkembangan dan pencapaian
   - Ikuti program bimbingan akademik
   - Diskusikan rencana karir jangka panjang

🎯 TARGET:
• Raih minimal 1-2 prestasi dalam 2 semester
• Naikkan IPK ke ≥ 3.0
• Aktif di minimal 1 organisasi/kegiatan
• Persiapkan diri untuk beasiswa pada tahun berikutnya`;
        })()
      },
      // Pertanyaan 11: Dosen Pembimbing Akademik
      {
        id: 'dosen_pa',
        pertanyaan: 'Siapa dosen pembimbing akademik dan bagaimana komunikasinya?',
        jawaban: `${mahasiswaData.dosen_pa}`,
        status: 'info',
        detail: `ℹ️ INFORMASI DOSEN PEMBIMBING AKADEMIK

📋 IDENTITAS DOSEN PA:
• Nama: ${mahasiswaData.dosen_pa}
• Peran: Pembimbing Akademik Resmi
• Tanggung Jawab: Memantau progress dan memberikan bimbingan akademik

📊 FUNGSI DOSEN PA:
Dosen Pembimbing Akademik memiliki peran penting dalam:
1. Konsultasi akademik dan perencanaan studi
2. Monitoring kehadiran dan progress mahasiswa
3. Dukungan dalam pemilihan mata kuliah
4. Bimbingan untuk melewati kesulitan akademik
5. Persiapan untuk memasuki dunia kerja

📝 JADWAL KONSULTASI RUTIN:
Mahasiswa direkomendasikan untuk:
• Konsultasi minimal 2 kali per semester
• Sebelum pendaftaran mata kuliah (3 bulan sebelumnya)
• Jika menghadapi kesulitan akademik
• Sebelum pengambilan keputusan besar (cuti, turun semester, dll)

✅ CHECKLIST KOMUNIKASI DENGAN DOSEN PA:
□ Hubungi dosen PA untuk janji temu
□ Siapkan data akademik terkini (kartu hasil studi)
□ Diskusikan rencana studi semester depan
□ Lapor masalah/kendala yang dihadapi
□ Minta saran untuk pengembangan karir
□ Update progress akademik setiap bulan

📞 CARA MENGHUBUNGI:
• Email: Melalui email universitas
• Kantor: Kantor pusat Fakultas/Jurusan
• Jam Kerja: Sesuai jam kerja akademik
• Tanya ke BAAK jika belum tahu kontak exact

⚠️ PENTING:
Komunikasi aktif dengan dosen PA adalah kunci kesuksesan akademik. Jangan tunggu masalah besar untuk berkonsultasi - lebih baik proaktif dan preventif!`
      },
      // Pertanyaan 12: Status Tugas Akhir/Skripsi
      {
        id: 'status_ta',
        pertanyaan: 'Apakah mahasiswa sudah siap untuk mengambil mata kuliah Tugas Akhir/Skripsi?',
        jawaban: (() => {
          const bolesTa = mahasiswaData.sks_lulus >= (mahasiswaData.total_sks_wajib - 24) && mahasiswaData.ipk >= 2.0;
          return bolesTa ? 'YA - Memenuhi Syarat' : 'BELUM - Belum Memenuhi Syarat';
        })(),
        status: (() => {
          const bolesTa = mahasiswaData.sks_lulus >= (mahasiswaData.total_sks_wajib - 24) && mahasiswaData.ipk >= 2.0;
          return bolesTa ? 'baik' : 'peringatan';
        })(),
        detail: (() => {
          const sksBelumLulus = mahasiswaData.total_sks_wajib - mahasiswaData.sks_lulus;
          const sksTaRequired = 24; // Asumsi 24 SKS untuk persyaratan TA
          const bolesTa = mahasiswaData.sks_lulus >= (mahasiswaData.total_sks_wajib - sksTaRequired) && mahasiswaData.ipk >= 2.0;
          
          if (bolesTa) {
            return `✅ SIAP MENGAMBIL TUGAS AKHIR/SKRIPSI

📊 STATUS PERSYARATAN:
• SKS Lulus: ${mahasiswaData.sks_lulus}/${mahasiswaData.total_sks_wajib} (${Math.round((mahasiswaData.sks_lulus/mahasiswaData.total_sks_wajib)*100)}%)
• IPK: ${mahasiswaData.ipk.toFixed(2)} (Minimum: 2.0) ✅
• Semester: ${mahasiswaData.semester}
• Status: MEMENUHI SYARAT TA

📋 PERSYARATAN YANG TERPENUHI:
☑️ SKS minimal untuk TA terpenuhi
☑️ IPK memenuhi standar minimum
☑️ Tidak ada tunggakan mata kuliah wajib kritis
☑️ Siap melanjutkan ke tahap akhir studi

📝 LANGKAH SELANJUTNYA:
1. PERSIAPAN PENGUSULAN TA
   - Hubungi Ketua Jurusan/Prodi untuk info pendaftaran TA
   - Siapkan dokumen akademik lengkap
   - Konsultasi dengan calon pembimbing TA

2. PEMILIHAN TOPIK
   - Diskusi dengan dosen untuk mencari topik menarik
   - Topik harus relevan dengan jurusan dan industri
   - Pertimbangkan feasibility (waktu, biaya, akses)

3. PENDAFTARAN FORMAL
   - Daftar melalui BAAK dengan persyaratan lengkap
   - Bayar biaya administrasi TA
   - Dapatkan surat penugasan pembimbing

4. JADWAL TA
   - Koordinasikan jadwal dengan pembimbing
   - Siapkan proposal/outline TA
   - Mulai riset dan pengembangan sesuai timeline

⏱️ ESTIMASI WAKTU:
• Persiapan: 2-3 minggu
• Pengerjaan TA: 4-6 bulan
• Revisi: 1-2 bulan
• Total: 6-8 bulan hingga selesai

🎯 MILESTONE:
• Selesai bulan depan: Pengajuan proposal
• +3 bulan: Presentasi seminar/bab 1-2
• +2 bulan: Draft final
• +1 bulan: Revisi dan finalisasi`;
          }
          
          return `⚠️ BELUM SIAP MENGAMBIL TUGAS AKHIR/SKRIPSI

📊 STATUS PERSYARATAN:
• SKS Lulus: ${mahasiswaData.sks_lulus}/${mahasiswaData.total_sks_wajib} (${Math.round((mahasiswaData.sks_lulus/mahasiswaData.total_sks_wajib)*100)}%)
• SKS Belum Lulus: ${sksBelumLulus} SKS
• IPK: ${mahasiswaData.ipk.toFixed(2)} (Minimum: 2.0)
• Status: BELUM MEMENUHI SYARAT TA ❌

❌ PERSYARATAN YANG BELUM TERPENUHI:
${mahasiswaData.sks_lulus < (mahasiswaData.total_sks_wajib - sksTaRequired) ? `☐ SKS belum mencapai minimum (kurang ${sksBelumLulus} SKS)` : ''}
${mahasiswaData.ipk < 2.0 ? `☐ IPK di bawah standar minimum (kurang ${(2.0 - mahasiswaData.ipk).toFixed(2)})` : ''}

📋 YANG PERLU DILAKUKAN:
1. FOKUS MENYELESAIKAN MATA KULIAH
   - Prioritaskan menyelesaikan sisa ${sksBelumLulus} SKS
   - Ambil mata kuliah yang tersisa dengan sungguh-sungguh
   - Targetkan nilai minimal B (3.0) untuk setiap mata kuliah

2. MENINGKATKAN IPK
${mahasiswaData.ipk < 2.0 ? `   - IPK saat ini: ${mahasiswaData.ipk.toFixed(2)} (DI BAWAH MINIMUM!)
   - Butuh nilai rata-rata A/B di semester depan
   - Pertimbangkan mengulang mata kuliah bernilai D untuk upgrade ke C/B
   - Konsultasi dengan dosen PA untuk strategi peningkatan IPK` : `   - IPK saat ini sudah baik (${mahasiswaData.ipk.toFixed(2)})
   - Pertahankan dan tingkatkan lebih lagi`}

3. TIMELINE REALISTIS
   - Semester ini: Fokus pada mata kuliah wajib
   - Semester depan: Ambil sisa mata kuliah dan persiapkan diri
   - Semester +2: Dapat mulai usulan TA

⏱️ ESTIMASI WAKTU TAMBAHAN:
• Untuk lulus semua SKS: ${Math.ceil(sksBelumLulus / 20)} semester
• Untuk stabilisasi IPK: 1-2 semester
• Total waktu tambahan: ${Math.ceil(sksBelumLulus / 20) + 1}-${Math.ceil(sksBelumLulus / 20) + 2} semester

📞 KONSULTASI:
Hubungi Dosen PA (${mahasiswaData.dosen_pa}) untuk mendiskusikan strategi penyelesaian studi`;
        })()
      },
      // Pertanyaan 13: Risiko Akademik - Analisis Komprehensif
      {
        id: 'risiko_akademik',
        pertanyaan: 'Apa analisis risiko akademik keseluruhan untuk mahasiswa ini?',
        jawaban: (() => {
          let risikoScore = 0;
          if (mahasiswaData.ipk < 2.0) risikoScore += 5;
          else if (mahasiswaData.ipk < 2.5) risikoScore += 3;
          else if (mahasiswaData.ipk < 3.0) risikoScore += 1;
          
          if (mahasiswaData.kehadiran < 60) risikoScore += 5;
          else if (mahasiswaData.kehadiran < 75) risikoScore += 2;
          
          if (mahasiswaData.mk_mengulang > 2) risikoScore += 4;
          else if (mahasiswaData.mk_mengulang > 0) risikoScore += 1;
          
          const lamaKuliah2 = new Date().getFullYear() - mahasiswaData.angkatan;
          const sisaWaktu2 = 7 - lamaKuliah2;
          if (sisaWaktu2 <= 0) risikoScore += 5;
          else if (sisaWaktu2 <= 1) risikoScore += 3;
          
          const persenSks2 = Math.round((mahasiswaData.sks_lulus / mahasiswaData.total_sks_wajib) * 100);
          if (persenSks2 < 50) risikoScore += 2;
          
          let kategoriRisiko = '';
          let statusColor = '';
          if (risikoScore >= 12) {
            kategoriRisiko = '🔴 RISIKO SANGAT TINGGI - KRITIS';
            statusColor = 'bahaya';
          } else if (risikoScore >= 8) {
            kategoriRisiko = '🟠 RISIKO TINGGI - PERLU INTERVENSI';
            statusColor = 'peringatan';
          } else if (risikoScore >= 4) {
            kategoriRisiko = '🟡 RISIKO SEDANG - MONITOR KETAT';
            statusColor = 'peringatan';
          } else {
            kategoriRisiko = '🟢 RISIKO RENDAH - NORMAL';
            statusColor = 'baik';
          }
          
          return kategoriRisiko;
        })(),
        status: (() => {
          let risikoScore = 0;
          if (mahasiswaData.ipk < 2.0) risikoScore += 5;
          else if (mahasiswaData.ipk < 2.5) risikoScore += 3;
          else if (mahasiswaData.ipk < 3.0) risikoScore += 1;
          
          if (mahasiswaData.kehadiran < 60) risikoScore += 5;
          else if (mahasiswaData.kehadiran < 75) risikoScore += 2;
          
          if (mahasiswaData.mk_mengulang > 2) risikoScore += 4;
          else if (mahasiswaData.mk_mengulang > 0) risikoScore += 1;
          
          const lamaKuliah2 = new Date().getFullYear() - mahasiswaData.angkatan;
          const sisaWaktu2 = 7 - lamaKuliah2;
          if (sisaWaktu2 <= 0) risikoScore += 5;
          else if (sisaWaktu2 <= 1) risikoScore += 3;
          
          const persenSks2 = Math.round((mahasiswaData.sks_lulus / mahasiswaData.total_sks_wajib) * 100);
          if (persenSks2 < 50) risikoScore += 2;
          
          if (risikoScore >= 12) return 'bahaya';
          if (risikoScore >= 8) return 'peringatan';
          if (risikoScore >= 4) return 'peringatan';
          return 'baik';
        })(),
        detail: (() => {
          const lamaKuliah2 = new Date().getFullYear() - mahasiswaData.angkatan;
          const sisaWaktu2 = 7 - lamaKuliah2;
          const persenSks2 = Math.round((mahasiswaData.sks_lulus / mahasiswaData.total_sks_wajib) * 100);
          
          let risikoScore = 0;
          let faktorRisiko = [];
          
          // Analisis IPK
          if (mahasiswaData.ipk < 2.0) {
            risikoScore += 5;
            faktorRisiko.push('🔴 IPK sangat rendah (< 2.0) - KRITIS');
          } else if (mahasiswaData.ipk < 2.5) {
            risikoScore += 3;
            faktorRisiko.push('🟠 IPK rendah (2.0-2.5) - Perhatian');
          } else if (mahasiswaData.ipk < 3.0) {
            risikoScore += 1;
            faktorRisiko.push('🟡 IPK sedang (2.5-3.0) - Standar');
          } else {
            faktorRisiko.push('🟢 IPK baik (≥ 3.0) - Memuaskan');
          }
          
          // Analisis Kehadiran
          if (mahasiswaData.kehadiran < 60) {
            risikoScore += 5;
            faktorRisiko.push('🔴 Kehadiran sangat kurang (< 60%) - KRITIS');
          } else if (mahasiswaData.kehadiran < 75) {
            risikoScore += 2;
            faktorRisiko.push('🟠 Kehadiran kurang (60-75%) - Perhatian');
          } else if (mahasiswaData.kehadiran < 80) {
            faktorRisiko.push('🟡 Kehadiran cukup (75-80%) - Standar');
          } else {
            faktorRisiko.push('🟢 Kehadiran baik (≥ 80%) - Memuaskan');
          }
          
          // Analisis Pengulangan
          if (mahasiswaData.mk_mengulang > 2) {
            risikoScore += 4;
            faktorRisiko.push('🔴 Banyak MK mengulang (> 2) - KRITIS');
          } else if (mahasiswaData.mk_mengulang > 0) {
            risikoScore += 1;
            faktorRisiko.push('🟠 Ada MK mengulang - Perhatian');
          } else {
            faktorRisiko.push('🟢 Tidak ada MK mengulang - Baik');
          }
          
          // Analisis Waktu
          if (sisaWaktu2 <= 0) {
            risikoScore += 5;
            faktorRisiko.push('🔴 Sudah melewati batas waktu - DROP OUT IMMINENT');
          } else if (sisaWaktu2 <= 1) {
            risikoScore += 3;
            faktorRisiko.push('🟠 Sisa waktu sangat terbatas (≤ 1 tahun) - Kritis');
          } else if (sisaWaktu2 <= 3) {
            faktorRisiko.push('🟡 Sisa waktu sedang (1-3 tahun) - Monitor');
          } else {
            faktorRisiko.push('🟢 Sisa waktu cukup (> 3 tahun) - Baik');
          }
          
          // Analisis SKS
          if (persenSks2 < 50) {
            risikoScore += 2;
            faktorRisiko.push('🟠 Progress SKS kurang (< 50%)');
          } else if (persenSks2 < 75) {
            faktorRisiko.push('🟡 Progress SKS sedang (50-75%)');
          } else {
            faktorRisiko.push('🟢 Progress SKS baik (≥ 75%)');
          }
          
          let kategoriRisiko = '';
          let rekomendasi = [];
          
          if (risikoScore >= 12) {
            kategoriRisiko = '🔴 RISIKO SANGAT TINGGI - INTERVENSI SEGERA DIPERLUKAN';
            rekomendasi = [
              '⚡ TINDAKAN SEGERA (Minggu ini):',
              '1. Lapor ke BAAK/Dekan tentang status akademik kritis',
              '2. Panggil mahasiswa untuk konsultasi intensif',
              '3. Buat kontrak akademik dengan target perbaikan',
              '4. Ikuti program pembinaan akademik khusus',
              '5. Monitor harian/mingguan',
              '',
              '🔧 RENCANA RECOVERY (Semester ini):',
              '• Kurangi beban SKS (fokus pada kualitas)',
              '• Bimbingan intensif dari dosen PA + tutor',
              '• Program remedial/tutorial extra',
              '• Motivasi dan dukungan psikologis',
              '• Involve orang tua jika perlu',
              '',
              '⚠️ OPSI TERAKHIR jika tidak ada peningkatan:',
              '• Cuti akademik untuk perbaikan diri',
              '• Evaluasi kelayakan melanjutkan studi',
              '• Pengusulan permohonan DO/turun semester'
            ];
          } else if (risikoScore >= 8) {
            kategoriRisiko = '🟠 RISIKO TINGGI - PERLU INTERVENSI KHUSUS';
            rekomendasi = [
              '📋 RENCANA PERBAIKAN (2-3 minggu):',
              '1. Surat panggilan dari Dekan untuk konsultasi',
              '2. Meeting dengan Dosen PA & dosen pengajar',
              '3. Buat action plan konkret untuk perbaikan',
              '4. Daftar program pembinaan akademik',
              '5. Monitoring mingguan',
              '',
              '🎯 TARGET PERBAIKAN (Semester ini):',
              '• IPK naik 0.2-0.5 poin',
              '• Kehadiran minimal 80%',
              '• Tidak ada nilai E/D baru',
              '• Menyelesaikan sisa SKS sesuai rencana'
            ];
          } else if (risikoScore >= 4) {
            kategoriRisiko = '🟡 RISIKO SEDANG - DIPERLUKAN MONITORING KETAT';
            rekomendasi = [
              '📊 MONITORING & SUPPORT (Rutin):',
              '1. Konsultasi dengan Dosen PA setiap 2 minggu',
              '2. Review progress akademik setiap bulan',
              '3. Update rencana studi setiap semester',
              '4. Ikuti kegiatan pengembangan akademik',
              '',
              '🎯 TARGET PERBAIKAN:',
              '• Pertahankan/tingkatkan IPK',
              '• Kehadiran stabil di atas 80%',
              '• Selesaikan SKS sesuai rencana'
            ];
          } else {
            kategoriRisiko = '🟢 RISIKO RENDAH - STATUS NORMAL';
            rekomendasi = [
              '✅ MAINTENANCE (Berkelanjutan):',
              '1. Pertahankan standar akademik saat ini',
              '2. Konsultasi regular dengan Dosen PA',
              '3. Manfaatkan waktu untuk pengembangan diri',
              '4. Persiapkan TA/skripsi dan memasuki karir'
            ];
          }
          
          const detailText = `${kategoriRisiko}

📊 ANALISIS FAKTOR RISIKO:
${faktorRisiko.map(f => '• ' + f).join('\n')}

📈 SKOR RISIKO: ${risikoScore}/20

📋 REKOMENDASI TINDAKAN LANJUT:
${rekomendasi.join('\n')}

📞 INFORMASI KONTAK:
• Dosen PA: ${mahasiswaData.dosen_pa}
• Kantor BAAK: Lantai 2, Gedung Pusat
• Waktu Konsultasi: Sesuai jadwal akademik

⏰ FOLLOW-UP:
• Review status dalam 1 bulan
• Evaluasi progress setiap semester
• Laporan ke Dekan setiap semester`;

          return detailText;
        })()
      }
    ];

    setAnalisisList(analisis);
  }, [mahasiswaData, hasilAnalisis]);

  const handleKembali = () => {
    resetData();
    router.push('/cari-mahasiswa');
  };

  const handleLanjutKeHasil = () => {
    router.push('/hasil-pencarian');
  };

  const handleNext = () => {
    if (currentIndex < analisisList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'baik':
        return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
      case 'peringatan':
        return <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />;
      case 'bahaya':
        return <XCircleIcon className="h-8 w-8 text-red-500" />;
      default:
        return <DocumentCheckIcon className="h-8 w-8 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'baik':
        return 'bg-green-50 border-green-200';
      case 'peringatan':
        return 'bg-yellow-50 border-yellow-200';
      case 'bahaya':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'baik':
        return 'text-green-800';
      case 'peringatan':
        return 'text-yellow-800';
      case 'bahaya':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  // Function untuk render detail dengan format yang rapi
  const renderDetailFormatted = (detail: string) => {
    return detail.split('\n\n').map((section, sectionIdx) => {
      const lines = section.split('\n');
      
      // Check jika ini adalah header (berisi simbol dan teks dengan colon)
      const isHeader = lines[0].match(/^[^\n]*:[^:]*$/) && lines[0].includes('•') === false;
      
      return (
        <div key={sectionIdx} className="mb-4">
          {isHeader && (
            <h4 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">
              {lines[0]}
            </h4>
          )}
          <div className={isHeader ? '' : ''}>
            {(isHeader ? lines.slice(1) : lines).map((line, lineIdx) => {
              if (line.startsWith('•')) {
                return (
                  <div key={lineIdx} className="ml-4 text-gray-700 flex gap-3 mb-1">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{line.substring(1).trim()}</span>
                  </div>
                );
              } else if (line.trim() === '') {
                return null;
              } else if (line.match(/^[✅⚠️🚨ℹ️📊📈⏱️📋⭐🎓🎯❌]/)) {
                // Header dengan emoji
                return (
                  <h4 key={lineIdx} className="font-semibold text-gray-800 mt-3 mb-2 text-sm">
                    {line}
                  </h4>
                );
              }
              return (
                <p key={lineIdx} className="text-gray-700 mb-2">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      );
    });
  };

  if (!mahasiswaData || !hasilAnalisis) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-blue-100">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-8 w-8 text-blue-900" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Analisis Status Mahasiswa</h1>
                <p className="text-sm text-blue-600">Evaluasi berdasarkan peraturan SIMAK UNISMUH</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <MagnifyingGlassIcon className="h-10 w-10 text-blue-900" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Data Mahasiswa</h2>
            <p className="text-gray-600 mb-6">
              Silakan cari mahasiswa terlebih dahulu untuk melihat analisis status akademik.
            </p>
            <Link
              href="/cari-mahasiswa"
              className="inline-flex items-center px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Cari Mahasiswa
            </Link>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">13 Pertanyaan yang akan dijawab:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Bagaimana informasi kontak mahasiswa ini?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Berapa total mata kuliah yang sudah lulus?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Berapa total SKS yang sudah lulus?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Berapa SKS yang belum lulus?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Berapa IPK mahasiswa ini?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Berapa sisa waktu studi yang tersisa?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Sudah berapa tahun kuliah dan sisa waktu hingga lulus atau DO?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Bagaimana kehadiran mahasiswa dalam perkuliahan?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Apakah ada mata kuliah yang perlu diulang atau diperbaiki?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Apakah mahasiswa menerima beasiswa dan apa prestasi yang telah dicapai?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Siapa dosen pembimbing akademik dan bagaimana komunikasinya?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Apakah mahasiswa sudah siap untuk mengambil mata kuliah Tugas Akhir/Skripsi?
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Apa analisis risiko akademik keseluruhan untuk mahasiswa ini?
              </li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  const currentAnalisis = analisisList[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-8 w-8 text-blue-900" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Analisis Status Mahasiswa</h1>
                <p className="text-sm text-blue-600">Evaluasi berdasarkan peraturan SIMAK UNISMUH</p>
              </div>
            </div>
            <button
              onClick={handleKembali}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Cari Lagi
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        {/* Info Mahasiswa */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <AcademicCapIcon className="h-10 w-10 text-blue-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{mahasiswaData.nama}</h2>
              <p className="text-gray-600">NIM: {mahasiswaData.nim}</p>
              <p className="text-gray-500 text-sm">{mahasiswaData.jurusan} - {mahasiswaData.fakultas}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Angkatan {mahasiswaData.angkatan}</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                mahasiswaData.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {mahasiswaData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Toggle View */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {showAll ? 'Tampilkan Satu per Satu' : 'Tampilkan Semua Pertanyaan'}
          </button>
        </div>

        {showAll ? (
          // Tampilan Semua Pertanyaan
          <div className="space-y-4">
            {analisisList.map((item, index) => (
              <div
                key={item.id}
                className={`rounded-xl border-2 p-6 ${getStatusColor(item.status)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Pertanyaan {index + 1}</p>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{item.pertanyaan}</h3>
                    <div className={`text-xl font-bold mb-4 ${getStatusTextColor(item.status)}`}>
                      {item.jawaban}
                    </div>
                    <div className="text-gray-700 space-y-2 leading-relaxed">
                      {renderDetailFormatted(item.detail)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Tampilan Satu per Satu
          <>
            {/* Progress Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                {analisisList.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex 
                        ? 'bg-blue-900 w-8' 
                        : index < currentIndex 
                          ? 'bg-blue-400' 
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Question Card */}
            {currentAnalisis && (
              <div className={`rounded-xl border-2 p-8 ${getStatusColor(currentAnalisis.status)}`}>
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Pertanyaan {currentIndex + 1} dari {analisisList.length}
                  </p>
                  <div className="flex justify-center mb-4">
                    {getStatusIcon(currentAnalisis.status)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {currentAnalisis.pertanyaan}
                  </h3>
                </div>

                <div className="bg-white rounded-lg p-6 mb-6">
                  <p className="text-sm text-gray-500 mb-2">Jawaban:</p>
                  <p className={`text-2xl font-bold ${getStatusTextColor(currentAnalisis.status)}`}>
                    {currentAnalisis.jawaban}
                  </p>
                </div>

                <div className="bg-white bg-opacity-50 rounded-lg p-6">
                  <p className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">📋 Keterangan Lengkap</p>
                  <div className="text-gray-700 space-y-2 leading-relaxed">
                    {renderDetailFormatted(currentAnalisis.detail)}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      currentIndex === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Sebelumnya
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === analisisList.length - 1}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      currentIndex === analisisList.length - 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-900 text-white hover:bg-blue-800'
                    }`}
                  >
                    Selanjutnya
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLanjutKeHasil}
            className="inline-flex items-center px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg"
          >
            Lihat Data Lengkap Mahasiswa
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Lanjut ke halaman biodata dan riwayat akademik lengkap
          </p>
        </div>

        {/* Summary Box */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-900">{mahasiswaData.ipk.toFixed(2)}</p>
              <p className="text-sm text-gray-600">IPK</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{mahasiswaData.sks_lulus}</p>
              <p className="text-sm text-gray-600">SKS Lulus</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{mahasiswaData.lama_studi}</p>
              <p className="text-sm text-gray-600">Semester</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className={`text-xl font-bold ${
                hasilAnalisis.kategori === 'Berprestasi' ? 'text-yellow-600' :
                hasilAnalisis.kategori === 'Normal' ? 'text-green-600' : 'text-red-600'
              }`}>
                {hasilAnalisis.kategori}
              </p>
              <p className="text-sm text-gray-600">Kategori</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
