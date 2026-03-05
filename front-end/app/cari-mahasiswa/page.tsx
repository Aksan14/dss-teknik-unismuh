'use client';

import {
    AcademicCapIcon,
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    BookOpenIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    IdentificationIcon,
    LightBulbIcon,
    MagnifyingGlassIcon,
    PhoneIcon,
    ShieldCheckIcon,
    StarIcon,
    UserGroupIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

/* ───────── Interfaces ───────── */
interface OrangTua {
  nim: string; nik: string; nama: string; alamat: string; hp: string; email: string;
  pendidikan: string; pekerjaan: string; instansi: string; jabatan: string; penghasilan: string; status: string;
}
interface WaliData {
  nim: string; nama: string; alamat: string; hp: string; email: string;
  pendidikan: string; pekerjaan: string; instansi: string; jabatan: string; penghasilan: string;
}
interface KHS {
  tahun_akademik: string; total_sks_lulus: number; ips: number; ipk: number; status_kelulusan: string;
  jumlah_matakuliah: number; sks_diambil: number; sks_lulus: number; matakuliah_lulus: number;
  jumlah_mk_diulang: number; sks_mk_diulang: number;
}
interface DosenPA {
  nidn: string; nama: string; gelar_depan: string; gelar_belakang: string; email: string; prodi_id: string;
}
interface ProdiData {
  id: string; kode_fakultas: string; kode_prodi: string; nama_prodi: string; nama_prodi_eng: string;
  status_prodi: string; email_prodi: string; kode_nim: string; gelar_pendek: string; gelar_panjang: string; gelar_eng: string;
}
interface MahasiswaDetail {
  nim: string; kode_prodi: string; angkatan: number; nama: string; jenis_kelamin: string;
  tempat_lahir: string; tanggal_lahir: string; nik: string; hp: string; email: string;
  semester_awal: string; tahun_akademik_lulus: string; tanggal_lulus: string; lulus: boolean;
  no_seri_ijazah: string; masa_studi: string; status: string; kategori: string;
  ipk: number; sks_total: number; sks_diambil: number; sks_lulus: number;
  matakuliah_lulus: number; jumlah_mk_diulang: number; sks_mk_diulang: number;
  ayah: OrangTua | null; ibu: OrangTua | null; wali: WaliData | null;
  khs: KHS[]; dosen_penasehat: DosenPA | null; prodi: ProdiData | null;
}

/* ───────── Helper Components ───────── */
function InfoRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  const display = value !== null && value !== undefined && value !== '' ? String(value) : '-';
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0 w-[40%]">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right flex-1 break-words">{display}</span>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-blue-100 p-5">
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h3 className="text-base font-bold text-blue-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function OrangTuaCard({ title, data }: { title: string; data: OrangTua | null }) {
  if (!data || !data.nama) return null;
  return (
    <div className="bg-gray-50 rounded-lg p-4 h-full">
      <h4 className="font-semibold text-gray-800 mb-3 text-base border-b border-gray-200 pb-2">{title}</h4>
      <InfoRow label="Nama" value={data.nama} />
      <InfoRow label="NIK" value={data.nik} />
      <InfoRow label="HP" value={data.hp} />
      <InfoRow label="Email" value={data.email} />
      <InfoRow label="Alamat" value={data.alamat} />
      <InfoRow label="Pendidikan" value={data.pendidikan} />
      <InfoRow label="Pekerjaan" value={data.pekerjaan} />
      <InfoRow label="Instansi" value={data.instansi} />
      <InfoRow label="Jabatan" value={data.jabatan} />
      <InfoRow label="Penghasilan" value={data.penghasilan} />
      {data.status && <InfoRow label="Status" value={data.status} />}
    </div>
  );
}

function GaugeBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-gray-900">{value} / {max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

/* ───────── Main Page ───────── */
export default function CariMahasiswaPage() {
  const [nim, setNim] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<MahasiswaDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'analisis' | 'akademik' | 'pribadi' | 'keluarga' | 'khs'>('analisis');

  const handleCari = async () => {
    setLocalError('');
    if (!nim.trim()) { setLocalError('NIM mahasiswa wajib diisi'); return; }
    setIsLoading(true);
    setData(null);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/mahasiswa/${nim.trim()}/detail`);
      if (!res.ok) throw new Error('Mahasiswa tidak ditemukan');
      const result = await res.json();
      setData(result);
      setActiveTab('analisis');
    } catch {
      setLocalError('Mahasiswa dengan NIM tersebut tidak ditemukan. Pastikan NIM sudah benar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleCari(); };
  const handleKembali = () => { setData(null); setNim(''); };

  /* ════════════════════════════════════════════════ */
  /*  RESULT VIEW — all detail + analysis in one     */
  /* ════════════════════════════════════════════════ */
  if (data) {
    const m = data;
    const tahunStudi = new Date().getFullYear() - m.angkatan;
    const progressSKS = m.sks_total > 0 ? Math.min((m.sks_lulus / m.sks_total) * 100, 100) : 0;
    const rasioUlang = m.sks_diambil > 0 ? ((m.sks_mk_diulang / m.sks_diambil) * 100) : 0;
    const efisiensi = m.sks_diambil > 0 ? ((m.sks_lulus / m.sks_diambil) * 100) : 0;
    const dosenNama = m.dosen_penasehat ? `${m.dosen_penasehat.gelar_depan || ''} ${m.dosen_penasehat.nama} ${m.dosen_penasehat.gelar_belakang || ''}`.trim() : '-';
    const khs = m.khs || [];
    const ipsValues = khs.map(k => k.ips || 0);
    const ipsAvg = ipsValues.length > 0 ? ipsValues.reduce((a, b) => a + b, 0) / ipsValues.length : 0;
    const ipsMax = ipsValues.length > 0 ? Math.max(...ipsValues) : 0;
    const ipsMin = ipsValues.length > 0 ? Math.min(...ipsValues) : 0;
    const ipsLast = ipsValues.length > 0 ? ipsValues[ipsValues.length - 1] : 0;
    const totalMKDiulangKHS = khs.reduce((a, k) => a + (k.jumlah_mk_diulang || 0), 0);
    const semesterAktif = khs.length;
    const trend = ipsValues.length >= 2 ? (ipsLast > ipsValues[ipsValues.length - 2] + 0.1 ? 'up' : ipsLast < ipsValues[ipsValues.length - 2] - 0.1 ? 'down' : 'stable') : 'stable';

    // Prediksi kelulusan
    const sksPerSemester = semesterAktif > 0 ? m.sks_lulus / semesterAktif : 0;
    const sisaSKS = Math.max(m.sks_total - m.sks_lulus, 0);
    const semesterSisa = sksPerSemester > 0 ? Math.ceil(sisaSKS / sksPerSemester) : 0;
    const estimasiLulus = semesterSisa > 0 ? `~${semesterSisa} semester lagi` : m.lulus ? 'Sudah Lulus' : 'Tidak dapat diprediksi';

    // Masalah
    const masalah: { text: string; severity: 'high' | 'medium' | 'low' }[] = [];
    if (m.ipk < 2.0) masalah.push({ text: `IPK sangat rendah (${m.ipk.toFixed(2)})`, severity: 'high' });
    else if (m.ipk < 2.5) masalah.push({ text: `IPK di bawah standar (${m.ipk.toFixed(2)})`, severity: 'medium' });
    if (m.jumlah_mk_diulang >= 5) masalah.push({ text: `${m.jumlah_mk_diulang} MK diulang — banyak pengulangan`, severity: 'high' });
    else if (m.jumlah_mk_diulang >= 3) masalah.push({ text: `${m.jumlah_mk_diulang} MK diulang`, severity: 'medium' });
    if (m.sks_mk_diulang >= 15) masalah.push({ text: `${m.sks_mk_diulang} SKS MK diulang (tinggi)`, severity: 'high' });
    else if (m.sks_mk_diulang >= 8) masalah.push({ text: `${m.sks_mk_diulang} SKS MK diulang`, severity: 'medium' });
    if (tahunStudi > 6) masalah.push({ text: `Masa studi ${tahunStudi} tahun — sangat lama`, severity: 'high' });
    else if (tahunStudi > 5) masalah.push({ text: `Masa studi ${tahunStudi} tahun — melebihi batas normal`, severity: 'medium' });
    if (efisiensi < 70 && m.sks_diambil > 0) masalah.push({ text: `Efisiensi SKS rendah (${efisiensi.toFixed(0)}%)`, severity: 'medium' });
    if (trend === 'down') masalah.push({ text: 'Tren IPS menurun', severity: 'low' });
    const expectedProg = Math.min((tahunStudi / 4) * 100, 100);
    if (progressSKS < expectedProg * 0.5 && m.sks_total > 0) masalah.push({ text: 'Progress SKS sangat lambat', severity: 'high' });
    else if (progressSKS < expectedProg * 0.7 && m.sks_total > 0) masalah.push({ text: 'Progress SKS lambat', severity: 'medium' });

    // Prestasi
    const prestasi: string[] = [];
    if (m.ipk >= 3.75) prestasi.push('Kandidat Cum Laude');
    else if (m.ipk >= 3.5) prestasi.push('IPK Sangat Memuaskan');
    else if (m.ipk >= 3.0) prestasi.push('IPK Memuaskan');
    if (m.jumlah_mk_diulang === 0 && m.sks_diambil > 0) prestasi.push('Tidak ada MK diulang');
    if (progressSKS >= 90 && !m.lulus) prestasi.push('Hampir menyelesaikan studi');
    if (trend === 'up') prestasi.push('Tren IPS meningkat');
    if (efisiensi >= 95 && m.sks_diambil > 0) prestasi.push('Efisiensi SKS sangat baik');
    if (m.lulus) prestasi.push('Telah menyelesaikan studi');
    if (ipsMax >= 3.8) prestasi.push(`IPS tertinggi: ${ipsMax.toFixed(2)}`);

    // Rekomendasi
    const rekomendasi: string[] = [];
    if (m.ipk < 2.5 && m.ipk > 0) rekomendasi.push('Perlu konsultasi intensif dengan Dosen PA untuk perbaikan strategi belajar');
    if (m.jumlah_mk_diulang > 3) rekomendasi.push('Fokus prioritaskan mata kuliah yang diulang agar tidak menumpuk');
    if (tahunStudi > 5 && !m.lulus) rekomendasi.push('Segera susun rencana penyelesaian studi dengan pembimbing akademik');
    if (trend === 'down') rekomendasi.push('Evaluasi faktor penyebab penurunan IPS dan lakukan perbaikan');
    if (efisiensi < 80 && m.sks_diambil > 0) rekomendasi.push('Tingkatkan tingkat kelulusan mata kuliah yang diambil');
    if (m.ipk >= 3.5 && m.jumlah_mk_diulang === 0) rekomendasi.push('Pertahankan performa, pertimbangkan ikut kompetisi akademik');
    if (progressSKS >= 80 && !m.lulus) rekomendasi.push('Segera selesaikan tugas akhir/skripsi');
    if (rekomendasi.length === 0) rekomendasi.push('Tetap konsisten dan jaga performa akademik saat ini');

    // Skor kesehatan akademik (0-100)
    let skor = 50;
    skor += m.ipk >= 3.5 ? 20 : m.ipk >= 3.0 ? 15 : m.ipk >= 2.5 ? 5 : m.ipk >= 2.0 ? -5 : -15;
    skor += m.jumlah_mk_diulang === 0 ? 15 : m.jumlah_mk_diulang <= 2 ? 5 : m.jumlah_mk_diulang <= 4 ? -5 : -15;
    skor += progressSKS >= 80 ? 10 : progressSKS >= 50 ? 5 : -5;
    skor += efisiensi >= 90 ? 5 : efisiensi >= 75 ? 0 : -5;
    skor += trend === 'up' ? 5 : trend === 'down' ? -5 : 0;
    skor = Math.max(0, Math.min(100, skor));
    const skorLabel = skor >= 80 ? 'Sangat Baik' : skor >= 60 ? 'Baik' : skor >= 40 ? 'Cukup' : skor >= 20 ? 'Kurang' : 'Kritis';
    const skorColor = skor >= 80 ? 'text-green-700' : skor >= 60 ? 'text-blue-700' : skor >= 40 ? 'text-yellow-700' : skor >= 20 ? 'text-orange-700' : 'text-red-700';
    const skorBg = skor >= 80 ? 'bg-green-500' : skor >= 60 ? 'bg-blue-500' : skor >= 40 ? 'bg-yellow-500' : skor >= 20 ? 'bg-orange-500' : 'bg-red-500';

    // ─── Prediksi & Tanya Jawab Akademik ───
    const totalSKSWajib = m.sks_total || 144;
    const sksSisa = Math.max(totalSKSWajib - m.sks_lulus, 0);
    const semesterIdeal = 8;
    const semesterSisaIdeal = Math.max(semesterIdeal - semesterAktif, 0);
    const sksPerSemIdeal = semesterSisaIdeal > 0 ? Math.ceil(sksSisa / semesterSisaIdeal) : 0;
    const mkLulusPerSem = semesterAktif > 0 ? (m.matakuliah_lulus / semesterAktif).toFixed(1) : '0';
    const tingkatKelulusanMK = m.sks_diambil > 0 ? ((m.sks_lulus / m.sks_diambil) * 100) : 0;
    const semTerbaik = khs.length > 0 ? khs.reduce((best, k) => (k.ips > best.ips ? k : best), khs[0]) : null;
    const semTerburuk = khs.length > 0 ? khs.reduce((worst, k) => (k.ips < worst.ips ? k : worst), khs[0]) : null;
    const isOnTrack = !m.lulus && semesterAktif <= semesterIdeal && progressSKS >= ((semesterAktif / semesterIdeal) * 100) * 0.8;
    const riskDO = m.ipk < 2.0 && tahunStudi > 5 && !m.lulus;
    const bisaCumLaude = m.ipk >= 3.5 && m.jumlah_mk_diulang === 0;
    const estimasiBulanTahunLulus = semesterSisa > 0 ? (() => {
      const now = new Date();
      const bulanTambahan = semesterSisa * 6;
      const est = new Date(now.getFullYear(), now.getMonth() + bulanTambahan);
      return est.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    })() : null;

    const tanyaJawab: { q: string; a: string; color: string }[] = [];

    // Q: Sudah lulus / Berapa lama lagi lulus?
    if (m.lulus) {
      tanyaJawab.push({ q: 'Apakah mahasiswa ini sudah lulus?', a: `Ya, mahasiswa telah menyelesaikan studi${m.tanggal_lulus ? ' pada ' + m.tanggal_lulus : ''}${m.masa_studi ? ' dengan masa studi ' + m.masa_studi : ''}.`, color: 'green' });
    } else if (sksPerSemester > 0 && sksSisa > 0) {
      tanyaJawab.push({ q: 'Berapa lama lagi mahasiswa ini bisa lulus?', a: `Dengan rata-rata ${sksPerSemester.toFixed(1)} SKS per semester, mahasiswa membutuhkan sekitar ${semesterSisa} semester lagi (~${(semesterSisa / 2).toFixed(1)} tahun) untuk menyelesaikan sisa ${sksSisa} SKS dari total ${totalSKSWajib} SKS.${estimasiBulanTahunLulus ? ' Estimasi lulus sekitar ' + estimasiBulanTahunLulus + '.' : ''}`, color: semesterSisa <= 2 ? 'green' : semesterSisa <= 4 ? 'blue' : 'orange' });
    } else if (!m.lulus) {
      tanyaJawab.push({ q: 'Berapa lama lagi mahasiswa ini bisa lulus?', a: 'Belum dapat diprediksi karena belum ada data semester yang cukup untuk perhitungan.', color: 'gray' });
    }

    // Q: Rata-rata SKS per semester
    tanyaJawab.push({ q: 'Berapa rata-rata SKS yang ditempuh per semester?', a: `Rata-rata ${sksPerSemester.toFixed(1)} SKS per semester selama ${semesterAktif} semester aktif. Rata-rata mata kuliah lulus per semester: ${mkLulusPerSem} MK. Total SKS lulus saat ini: ${m.sks_lulus} dari ${totalSKSWajib} SKS.`, color: 'blue' });

    // Q: On-track?
    if (!m.lulus) {
      const expectedProgressPct = Math.round((semesterAktif / semesterIdeal) * 100);
      tanyaJawab.push({ q: 'Apakah mahasiswa ini on-track untuk lulus tepat waktu (4 tahun)?', a: isOnTrack ? `Ya, mahasiswa berada di jalur yang tepat. Sudah menyelesaikan ${progressSKS.toFixed(0)}% SKS di semester ke-${semesterAktif} (target ~${expectedProgressPct}%).` : `Tidak. Baru ${progressSKS.toFixed(0)}% SKS selesai di semester ke-${semesterAktif}, sementara seharusnya sudah sekitar ${expectedProgressPct}% pada titik ini.`, color: isOnTrack ? 'green' : 'orange' });
    }

    // Q: SKS per semester agar lulus tepat waktu
    if (!m.lulus && sksSisa > 0) {
      if (semesterSisaIdeal > 0) {
        tanyaJawab.push({ q: 'Berapa SKS yang harus diambil per semester agar lulus tepat waktu?', a: `Untuk lulus dalam ${semesterIdeal} semester (4 tahun), mahasiswa harus mengambil minimal ${sksPerSemIdeal} SKS per semester selama ${semesterSisaIdeal} semester ke depan. ${sksPerSemIdeal > 24 ? 'Jumlah ini melebihi batas normal (20-24 SKS), sehingga kelulusan tepat waktu kemungkinan sulit tercapai.' : sksPerSemIdeal > 20 ? 'Beban ini cukup berat namun masih memungkinkan.' : 'Target ini sangat realistis dan bisa dicapai.'}`, color: sksPerSemIdeal > 24 ? 'red' : sksPerSemIdeal > 20 ? 'orange' : 'green' });
      } else {
        tanyaJawab.push({ q: 'Berapa SKS yang harus diambil per semester agar segera lulus?', a: `Mahasiswa sudah melewati batas ${semesterIdeal} semester ideal. Sisa ${sksSisa} SKS harus diselesaikan secepatnya. Dengan mengambil ~${Math.min(24, sksSisa)} SKS per semester, dibutuhkan sekitar ${Math.ceil(sksSisa / 20)} semester lagi.`, color: 'red' });
      }
    }

    // Q: Semester terbaik
    if (semTerbaik && khs.length > 1) {
      tanyaJawab.push({ q: 'Semester mana yang memiliki performa terbaik?', a: `Semester terbaik adalah ${semTerbaik.tahun_akademik} dengan IPS ${semTerbaik.ips.toFixed(2)}, lulus ${semTerbaik.matakuliah_lulus} MK (${semTerbaik.sks_lulus} SKS).`, color: 'green' });
    }

    // Q: Semester terburuk
    if (semTerburuk && khs.length > 1 && semTerburuk.tahun_akademik !== semTerbaik?.tahun_akademik) {
      tanyaJawab.push({ q: 'Semester mana yang memiliki performa terburuk?', a: `Semester terburuk adalah ${semTerburuk.tahun_akademik} dengan IPS ${semTerburuk.ips.toFixed(2)}${semTerburuk.jumlah_mk_diulang > 0 ? ', dengan ' + semTerburuk.jumlah_mk_diulang + ' MK yang harus diulang' : ''}.`, color: 'red' });
    }

    // Q: Tingkat kelulusan MK
    tanyaJawab.push({ q: 'Berapa tingkat kelulusan mata kuliah?', a: `Tingkat kelulusan (efisiensi) adalah ${tingkatKelulusanMK.toFixed(1)}%. Dari setiap SKS yang diambil, ${tingkatKelulusanMK.toFixed(0)}% berhasil lulus. ${tingkatKelulusanMK >= 95 ? 'Sangat baik!' : tingkatKelulusanMK >= 85 ? 'Cukup baik.' : tingkatKelulusanMK >= 70 ? 'Perlu ditingkatkan.' : 'Perlu perhatian serius.'}`, color: tingkatKelulusanMK >= 90 ? 'green' : tingkatKelulusanMK >= 75 ? 'blue' : 'orange' });

    // Q: Risiko DO
    if (!m.lulus) {
      tanyaJawab.push({ q: 'Apakah ada risiko drop out (DO)?', a: riskDO ? `Ya, ada indikasi risiko DO. IPK mahasiswa ${m.ipk.toFixed(2)} (di bawah 2.0) dan masa studi sudah ${tahunStudi} tahun. Perlu penanganan segera dari dosen PA.` : `Tidak ada indikasi risiko DO saat ini. ${m.ipk >= 2.5 ? 'IPK dalam batas aman.' : m.ipk >= 2.0 ? 'Namun IPK perlu dijaga agar tidak turun di bawah 2.0.' : 'Namun IPK perlu segera ditingkatkan.'}`, color: riskDO ? 'red' : 'green' });
    }

    // Q: Peluang cum laude
    if (!m.lulus) {
      tanyaJawab.push({ q: 'Apakah mahasiswa ini berpeluang mendapat predikat cum laude?', a: bisaCumLaude ? `Ya, berpeluang! IPK saat ini ${m.ipk.toFixed(2)} (>= 3.50) dan tidak ada mata kuliah yang diulang. Pertahankan performa ini!` : m.ipk >= 3.5 && m.jumlah_mk_diulang > 0 ? `Tidak bisa cum laude karena ada ${m.jumlah_mk_diulang} MK yang diulang, meskipun IPK ${m.ipk.toFixed(2)} sudah memenuhi syarat.` : m.ipk < 3.5 && m.ipk >= 3.0 ? `Belum memenuhi syarat cum laude (IPK ${m.ipk.toFixed(2)}, syarat >= 3.50). Masih ada peluang jika performa ditingkatkan secara konsisten.` : `Belum memenuhi syarat cum laude (IPK ${m.ipk.toFixed(2)}, syarat >= 3.50).`, color: bisaCumLaude ? 'green' : m.ipk >= 3.0 ? 'blue' : 'gray' });
    }

    // Q: Tren performa
    tanyaJawab.push({ q: 'Bagaimana tren performa akademik mahasiswa ini?', a: trend === 'up' ? `Performa akademik menunjukkan tren meningkat. IPS terakhir: ${ipsLast.toFixed(2)} (naik dari semester sebelumnya). Hal positif yang perlu dipertahankan.` : trend === 'down' ? `Performa akademik menunjukkan tren menurun. IPS terakhir: ${ipsLast.toFixed(2)} (turun dari semester sebelumnya). Perlu evaluasi dan perbaikan strategi belajar.` : `Performa akademik relatif stabil. IPS terakhir: ${ipsLast.toFixed(2)}. ${ipsLast >= 3.0 ? 'Stabil di level yang baik.' : 'Perlu upaya untuk peningkatan.'}`, color: trend === 'up' ? 'green' : trend === 'down' ? 'red' : 'blue' });

    // Q: Dampak MK diulang
    if (m.jumlah_mk_diulang > 0) {
      tanyaJawab.push({ q: 'Bagaimana dampak mata kuliah yang diulang?', a: `Mahasiswa memiliki ${m.jumlah_mk_diulang} MK yang diulang (${m.sks_mk_diulang} SKS), mengkonsumsi ${rasioUlang.toFixed(1)}% dari total SKS yang diambil. ${rasioUlang > 15 ? 'Rasio ini sangat tinggi dan memperlambat kelulusan secara signifikan.' : rasioUlang > 8 ? 'Rasio ini cukup berpengaruh terhadap kecepatan penyelesaian studi.' : 'Dampaknya masih terkelola, namun tetap perlu diminimalisir.'}`, color: rasioUlang > 15 ? 'red' : rasioUlang > 8 ? 'orange' : 'blue' });
    }

    // Q: Beban studi
    if (!m.lulus && khs.length > 0) {
      const sksAmbilTerakhir = khs[khs.length - 1].sks_diambil;
      const batasMaxSKS = m.ipk >= 3.0 ? 24 : m.ipk >= 2.5 ? 21 : 18;
      tanyaJawab.push({ q: 'Berapa batas SKS yang bisa diambil berdasarkan IPK?', a: `Dengan IPK ${m.ipk.toFixed(2)}, mahasiswa dapat mengambil maksimal ${batasMaxSKS} SKS per semester (IPK >= 3.0: 24 SKS, IPK 2.5-2.99: 21 SKS, IPK < 2.5: 18 SKS). Semester terakhir mengambil ${sksAmbilTerakhir} SKS.${sksAmbilTerakhir > batasMaxSKS ? ' Perlu perhatian, melebihi batas yang disarankan.' : ''}`, color: 'blue' });
    }

    // Q: Sudah berapa semester + berapa tahun
    tanyaJawab.push({ q: 'Sudah berapa lama mahasiswa ini menempuh studi?', a: `Mahasiswa angkatan ${m.angkatan} telah menempuh ${semesterAktif} semester aktif (${tahunStudi} tahun). ${m.lulus ? 'Sudah menyelesaikan studi.' : tahunStudi <= 4 ? 'Masih dalam batas waktu normal.' : tahunStudi <= 6 ? 'Sudah melewati batas normal 4 tahun, namun masih dalam toleransi.' : 'Sudah jauh melewati batas normal. Perlu perhatian khusus.'}`, color: tahunStudi <= 4 ? 'green' : tahunStudi <= 6 ? 'orange' : 'red' });

    const tabs = [
      { id: 'analisis' as const, label: 'Analisis Status' },
      { id: 'akademik' as const, label: 'Akademik' },
      { id: 'pribadi' as const, label: 'Data Pribadi' },
      { id: 'keluarga' as const, label: 'Keluarga' },
      { id: 'khs' as const, label: 'KHS Per Semester' },
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-blue-100">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-7 w-7 text-blue-900" />
              <div>
                <h1 className="text-xl font-bold text-blue-900">Detail & Analisis Mahasiswa</h1>
                <p className="text-sm text-blue-600">Informasi lengkap data akademik, pribadi & analisis performa</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-3 sm:px-5 lg:px-6 py-5">
          <button onClick={handleKembali} className="inline-flex items-center text-blue-600 hover:text-blue-900 mb-4 text-sm font-medium">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Cari Mahasiswa Lain
          </button>

          {/* ── Profile Header ── */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden mb-5">
            <div className="bg-blue-900 px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{m.nama}</h2>
                  <p className="text-blue-200 text-sm mt-0.5">{m.nim} • Angkatan {m.angkatan} • Semester {semesterAktif > 0 ? semesterAktif : '-'}</p>
                  {m.prodi && <p className="text-blue-300 text-xs mt-1">{m.prodi.nama_prodi} ({m.prodi.gelar_pendek}) • PA: {dosenNama}</p>}
                </div>
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.status === 'Aktif' ? 'bg-green-500 text-white' : m.status === 'Alumni' ? 'bg-purple-500 text-white' : 'bg-red-500 text-white'}`}>{m.status}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.kategori === 'Berprestasi' ? 'bg-yellow-400 text-yellow-900' : m.kategori === 'Normal' ? 'bg-blue-400 text-white' : 'bg-orange-500 text-white'}`}>{m.kategori}</span>
                  {m.lulus && <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">LULUS</span>}
                </div>
              </div>
            </div>

            {/* Skor Kesehatan Akademik */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3 flex-shrink-0">
                <ShieldCheckIcon className={`h-8 w-8 ${skorColor}`} />
                <div>
                  <p className="text-xs text-gray-500">Skor Kesehatan Akademik</p>
                  <p className={`text-2xl font-black ${skorColor}`}>{skor}<span className="text-sm font-medium text-gray-400">/100</span></p>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all duration-700 ${skorBg}`} style={{ width: `${skor}%` }}></div>
                </div>
                <p className={`text-xs font-semibold mt-1 ${skorColor}`}>{skorLabel}</p>
              </div>
            </div>
          </div>

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
            {[
              { label: 'IPK', value: (m.ipk || 0).toFixed(2), color: m.ipk >= 3.5 ? 'text-green-700' : m.ipk >= 3.0 ? 'text-blue-700' : m.ipk >= 2.0 ? 'text-orange-700' : 'text-red-700' },
              { label: 'IPS Terakhir', value: ipsLast.toFixed(2), color: ipsLast >= 3.5 ? 'text-green-700' : ipsLast >= 3.0 ? 'text-blue-700' : 'text-orange-700' },
              { label: 'SKS Lulus', value: `${m.sks_lulus}`, color: 'text-gray-900' },
              { label: 'MK Diulang', value: `${m.jumlah_mk_diulang}`, color: m.jumlah_mk_diulang > 0 ? 'text-red-700' : 'text-green-700' },
              { label: 'Efisiensi', value: `${efisiensi.toFixed(0)}%`, color: efisiensi >= 90 ? 'text-green-700' : efisiensi >= 75 ? 'text-blue-700' : 'text-red-700' },
              { label: 'Masa Studi', value: `${tahunStudi} Thn`, color: tahunStudi > 5 ? 'text-red-700' : 'text-gray-900' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-lg shadow border border-gray-100 p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div className="flex flex-wrap gap-1 bg-white rounded-xl shadow-md border border-blue-100 p-1 mb-5">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ════════════════════════ TAB: ANALISIS ════════════════════════ */}
          {activeTab === 'analisis' && (
            <div className="space-y-5">
              {/* Progress Bars */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Progress Akademik</h3>
                <GaugeBar value={m.sks_lulus} max={m.sks_total || 144} label="SKS Lulus" color={progressSKS >= 75 ? 'bg-green-500' : progressSKS >= 50 ? 'bg-blue-500' : 'bg-orange-500'} />
                <GaugeBar value={m.matakuliah_lulus} max={Math.max(m.matakuliah_lulus + m.jumlah_mk_diulang, m.matakuliah_lulus, 1)} label="MK Lulus" color="bg-blue-500" />
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">Rasio MK Diulang</span>
                    <span className="font-bold text-gray-900">{rasioUlang.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all duration-500 ${rasioUlang > 15 ? 'bg-red-500' : rasioUlang > 5 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(rasioUlang, 100)}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600">Estimasi kelulusan:</span>
                  </div>
                  <span className="text-xs font-bold text-blue-800">{estimasiLulus}</span>
                </div>
              </div>

              {/* Masalah & Prestasi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`rounded-xl border p-4 ${masalah.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center space-x-2 mb-3">
                    {masalah.length > 0 ? <ExclamationTriangleIcon className="h-5 w-5 text-red-600" /> : <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                    <h3 className={`font-bold text-sm ${masalah.length > 0 ? 'text-red-800' : 'text-green-800'}`}>
                      {masalah.length > 0 ? `${masalah.length} Masalah Terdeteksi` : 'Tidak Ada Masalah'}
                    </h3>
                  </div>
                  {masalah.length > 0 ? (
                    <div className="space-y-2">
                      {masalah.map((issue, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${issue.severity === 'high' ? 'bg-red-600' : issue.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}`}></span>
                          <span className="text-sm text-red-700">{issue.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-700">Tidak ditemukan indikasi masalah akademik. Performa baik!</p>
                  )}
                </div>

                <div className={`rounded-xl border p-4 ${prestasi.length > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center space-x-2 mb-3">
                    <StarIcon className={`h-5 w-5 ${prestasi.length > 0 ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <h3 className={`font-bold text-sm ${prestasi.length > 0 ? 'text-emerald-800' : 'text-gray-600'}`}>
                      {prestasi.length > 0 ? `${prestasi.length} Pencapaian Positif` : 'Belum Ada Pencapaian Khusus'}
                    </h3>
                  </div>
                  {prestasi.length > 0 ? (
                    <div className="space-y-2">
                      {prestasi.map((item, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-emerald-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada pencapaian khusus yang terdeteksi.</p>
                  )}
                </div>
              </div>

              {/* Rekomendasi */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <LightBulbIcon className="h-5 w-5 text-amber-600" />
                  <h3 className="font-bold text-amber-800 text-sm">Rekomendasi</h3>
                </div>
                <div className="space-y-2">
                  {rekomendasi.map((r, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="text-amber-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                      <span className="text-sm text-amber-800">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Prediksi & Tanya Jawab Akademik ── */}
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-black text-slate-900">?</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Tanya Jawab Akademik</h3>
                      <p className="text-xs text-slate-500">Analisis prediktif berdasarkan data performa mahasiswa</p>
                    </div>
                  </div>
                  <span className="bg-slate-900 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full">{tanyaJawab.length} Q&A</span>
                </div>

                {/* Chat-style Q&A */}
                <div className="space-y-4">
                  {tanyaJawab.map((item, idx) => {
                    const dot = item.color === 'green' ? 'bg-emerald-500' : item.color === 'blue' ? 'bg-blue-500' : item.color === 'orange' ? 'bg-amber-500' : item.color === 'red' ? 'bg-red-500' : 'bg-slate-400';
                    const aBg = item.color === 'green' ? 'bg-emerald-50 border-emerald-200' : item.color === 'blue' ? 'bg-blue-50 border-blue-200' : item.color === 'orange' ? 'bg-amber-50 border-amber-200' : item.color === 'red' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200';
                    const aText = item.color === 'green' ? 'text-emerald-800' : item.color === 'blue' ? 'text-blue-800' : item.color === 'orange' ? 'text-amber-800' : item.color === 'red' ? 'text-red-800' : 'text-slate-700';
                    const labelBg = item.color === 'green' ? 'bg-emerald-100 text-emerald-700' : item.color === 'blue' ? 'bg-blue-100 text-blue-700' : item.color === 'orange' ? 'bg-amber-100 text-amber-700' : item.color === 'red' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600';
                    const statusLabel = item.color === 'green' ? 'Baik' : item.color === 'blue' ? 'Info' : item.color === 'orange' ? 'Perhatian' : item.color === 'red' ? 'Kritis' : 'Netral';

                    return (
                      <div key={idx} className="group">
                        {/* Question bubble — right aligned like a chat */}
                        <div className="flex justify-end mb-2">
                          <div className="bg-slate-800 text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%] shadow-md">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Q{idx + 1}</span>
                            </div>
                            <p className="text-sm font-semibold leading-snug">{item.q}</p>
                          </div>
                        </div>
                        {/* Answer bubble — left aligned */}
                        <div className="flex justify-start">
                          <div className="flex gap-2.5 max-w-[90%]">
                            <div className={`w-2 rounded-full shrink-0 ${dot}`}></div>
                            <div className={`rounded-2xl rounded-bl-sm border px-4 py-3 shadow-sm ${aBg}`}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${labelBg}`}>{statusLabel}</span>
                              </div>
                              <p className={`text-sm leading-relaxed ${aText}`}>{item.a}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statistik IPS + Bar Chart */}
              {khs.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpenIcon className="h-5 w-5 text-blue-900" />
                      <h3 className="font-bold text-blue-900 text-sm">Statistik & Grafik IPS</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      {trend === 'up' && <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />}
                      {trend === 'down' && <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />}
                      <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                        {trend === 'up' ? 'Meningkat' : trend === 'down' ? 'Menurun' : 'Stabil'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'IPS Rata-rata', value: ipsAvg.toFixed(2) },
                      { label: 'IPS Tertinggi', value: ipsMax.toFixed(2) },
                      { label: 'IPS Terendah', value: ipsMin.toFixed(2) },
                      { label: 'IPS Terakhir', value: ipsLast.toFixed(2) },
                    ].map((s, i) => (
                      <div key={i} className="bg-blue-50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-blue-600 uppercase">{s.label}</p>
                        <p className="text-base font-bold text-blue-900">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* IPS Bar Chart */}
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-2">Grafik IPS per Semester</p>
                    <div className="flex items-end gap-1.5" style={{ height: 120 }}>
                      {khs.map((k, idx) => {
                        const barH = ((k.ips || 0) / 4.0) * 100;
                        const barColor = (k.ips || 0) >= 3.5 ? 'bg-green-500' : (k.ips || 0) >= 3.0 ? 'bg-blue-500' : (k.ips || 0) >= 2.0 ? 'bg-yellow-500' : 'bg-red-500';
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap transition-opacity z-10">
                              {k.tahun_akademik}: {(k.ips || 0).toFixed(2)}
                            </div>
                            <div className={`w-full rounded-t ${barColor} transition-all duration-300 hover:opacity-80`} style={{ height: `${barH}%`, minHeight: 4 }}></div>
                            <p className="text-[8px] text-gray-400 mt-1 truncate w-full text-center">{k.tahun_akademik.slice(-5)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════ TAB: AKADEMIK ════════════════════════ */}
          {activeTab === 'akademik' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SectionCard title="Data SKS" icon={<AcademicCapIcon className="h-5 w-5 text-blue-900" />}>
                <InfoRow label="SKS Total" value={m.sks_total} />
                <InfoRow label="SKS Diambil" value={m.sks_diambil} />
                <InfoRow label="SKS Lulus" value={m.sks_lulus} />
                <InfoRow label="Matakuliah Lulus" value={m.matakuliah_lulus} />
                <InfoRow label="MK Diulang" value={m.jumlah_mk_diulang} />
                <InfoRow label="SKS MK Diulang" value={m.sks_mk_diulang} />
                <InfoRow label="Rasio Ulang" value={`${rasioUlang.toFixed(1)}%`} />
              </SectionCard>
              <SectionCard title="Info Kelulusan" icon={<BookOpenIcon className="h-5 w-5 text-blue-900" />}>
                <InfoRow label="Status" value={m.status} />
                <InfoRow label="Kategori" value={m.kategori} />
                <InfoRow label="Lulus" value={m.lulus ? 'Ya' : 'Belum'} />
                <InfoRow label="Tanggal Lulus" value={m.tanggal_lulus} />
                <InfoRow label="Tahun Akademik Lulus" value={m.tahun_akademik_lulus} />
                <InfoRow label="No Seri Ijazah" value={m.no_seri_ijazah} />
                <InfoRow label="Masa Studi" value={m.masa_studi} />
                <InfoRow label="Semester Awal" value={m.semester_awal} />
              </SectionCard>
              {m.dosen_penasehat && (
                <SectionCard title="Dosen Penasehat Akademik" icon={<UserIcon className="h-5 w-5 text-blue-900" />}>
                  <InfoRow label="Nama" value={dosenNama} />
                  <InfoRow label="NIDN" value={m.dosen_penasehat.nidn} />
                  <InfoRow label="Email" value={m.dosen_penasehat.email} />
                </SectionCard>
              )}
              {m.prodi && (
                <SectionCard title="Program Studi" icon={<AcademicCapIcon className="h-5 w-5 text-blue-900" />}>
                  <InfoRow label="Nama Prodi" value={m.prodi.nama_prodi} />
                  <InfoRow label="Kode Prodi" value={m.prodi.kode_prodi} />
                  <InfoRow label="Status" value={m.prodi.status_prodi} />
                  <InfoRow label="Gelar" value={`${m.prodi.gelar_pendek} (${m.prodi.gelar_panjang})`} />
                  <InfoRow label="Email Prodi" value={m.prodi.email_prodi} />
                </SectionCard>
              )}
            </div>
          )}

          {/* ════════════════════════ TAB: PRIBADI ════════════════════════ */}
          {activeTab === 'pribadi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SectionCard title="Identitas" icon={<IdentificationIcon className="h-5 w-5 text-blue-900" />}>
                <InfoRow label="Nama Lengkap" value={m.nama} />
                <InfoRow label="NIM" value={m.nim} />
                <InfoRow label="NIK" value={m.nik} />
                <InfoRow label="Jenis Kelamin" value={m.jenis_kelamin === 'L' ? 'Laki-laki' : m.jenis_kelamin === 'P' ? 'Perempuan' : m.jenis_kelamin} />
                <InfoRow label="Tempat Lahir" value={m.tempat_lahir} />
                <InfoRow label="Tanggal Lahir" value={m.tanggal_lahir} />
              </SectionCard>
              <SectionCard title="Kontak" icon={<PhoneIcon className="h-5 w-5 text-blue-900" />}>
                <InfoRow label="HP" value={m.hp} />
                <InfoRow label="Email" value={m.email} />
                <InfoRow label="Angkatan" value={m.angkatan} />
                <InfoRow label="Kode Prodi" value={m.kode_prodi} />
              </SectionCard>
            </div>
          )}

          {/* ════════════════════════ TAB: KELUARGA ════════════════════════ */}
          {activeTab === 'keluarga' && (
            <SectionCard title="Data Keluarga" icon={<UserGroupIcon className="h-5 w-5 text-blue-900" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OrangTuaCard title="Ayah" data={m.ayah} />
                <OrangTuaCard title="Ibu" data={m.ibu} />
              </div>
              {m.wali && m.wali.nama && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-4 h-full">
                    <h4 className="font-semibold text-gray-800 mb-3 text-base border-b border-gray-200 pb-2">Wali</h4>
                    <InfoRow label="Nama" value={m.wali.nama} />
                    <InfoRow label="HP" value={m.wali.hp} />
                    <InfoRow label="Email" value={m.wali.email} />
                    <InfoRow label="Alamat" value={m.wali.alamat} />
                    <InfoRow label="Pendidikan" value={m.wali.pendidikan} />
                    <InfoRow label="Pekerjaan" value={m.wali.pekerjaan} />
                    <InfoRow label="Instansi" value={m.wali.instansi} />
                    <InfoRow label="Jabatan" value={m.wali.jabatan} />
                    <InfoRow label="Penghasilan" value={m.wali.penghasilan} />
                  </div>
                </div>
              )}
              {!m.ayah?.nama && !m.ibu?.nama && !m.wali?.nama && (
                <p className="text-gray-500 text-center py-8">Data keluarga tidak tersedia</p>
              )}
            </SectionCard>
          )}

          {/* ════════════════════════ TAB: KHS ════════════════════════ */}
          {activeTab === 'khs' && (
            <SectionCard title="Kartu Hasil Studi (KHS)" icon={<BookOpenIcon className="h-5 w-5 text-blue-900" />}>
              {khs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-blue-50 border-b border-gray-200">
                        <th className="px-2 py-2 text-left font-semibold text-blue-900">Tahun Akademik</th>
                        <th className="px-2 py-2 text-center font-semibold text-blue-900">IPS</th>
                        <th className="px-2 py-2 text-center font-semibold text-blue-900">IPK</th>
                        <th className="px-2 py-2 text-center font-semibold text-blue-900">SKS Ambil</th>
                        <th className="px-2 py-2 text-center font-semibold text-blue-900">SKS Lulus</th>
                        <th className="px-2 py-2 text-center font-semibold text-blue-900">Total SKS</th>
                        <th className="px-2 py-2 text-center font-semibold text-blue-900">MK</th>
                        <th className="px-2 py-2 text-center font-semibold text-blue-900">MK Lulus</th>
                        <th className="px-2 py-2 text-center font-semibold text-blue-900">MK Ulang</th>
                        <th className="px-2 py-2 text-center font-semibold text-blue-900">SKS Ulang</th>
                      </tr>
                    </thead>
                    <tbody>
                      {khs.map((k, idx) => (
                        <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-2 py-2 font-medium text-gray-900">{k.tahun_akademik}</td>
                          <td className="px-2 py-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${(k.ips||0) >= 3.5 ? 'bg-green-100 text-green-800' : (k.ips||0) >= 3.0 ? 'bg-blue-100 text-blue-800' : (k.ips||0) >= 2.0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{(k.ips||0).toFixed(2)}</span>
                          </td>
                          <td className="px-2 py-2 text-center font-semibold text-gray-900">{(k.ipk||0).toFixed(2)}</td>
                          <td className="px-2 py-2 text-center text-gray-700">{k.sks_diambil}</td>
                          <td className="px-2 py-2 text-center text-gray-700">{k.sks_lulus}</td>
                          <td className="px-2 py-2 text-center font-semibold text-gray-900">{k.total_sks_lulus}</td>
                          <td className="px-2 py-2 text-center text-gray-700">{k.jumlah_matakuliah}</td>
                          <td className="px-2 py-2 text-center text-gray-700">{k.matakuliah_lulus}</td>
                          <td className="px-2 py-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${(k.jumlah_mk_diulang||0) > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{k.jumlah_mk_diulang || 0}</span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${(k.sks_mk_diulang||0) > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{k.sks_mk_diulang || 0}</span>
                          </td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="bg-blue-50 border-t-2 border-blue-200 font-bold">
                        <td className="px-2 py-2 text-blue-900">Total / Rata-rata</td>
                        <td className="px-2 py-2 text-center text-blue-900">{ipsAvg.toFixed(2)}</td>
                        <td className="px-2 py-2 text-center text-blue-900">{(m.ipk || 0).toFixed(2)}</td>
                        <td className="px-2 py-2 text-center text-blue-900">{m.sks_diambil}</td>
                        <td className="px-2 py-2 text-center text-blue-900">{m.sks_lulus}</td>
                        <td className="px-2 py-2 text-center text-blue-900">{m.sks_lulus}</td>
                        <td className="px-2 py-2 text-center text-blue-900">{khs.reduce((a, k) => a + k.jumlah_matakuliah, 0)}</td>
                        <td className="px-2 py-2 text-center text-blue-900">{m.matakuliah_lulus}</td>
                        <td className="px-2 py-2 text-center text-red-700">{totalMKDiulangKHS}</td>
                        <td className="px-2 py-2 text-center text-red-700">{m.sks_mk_diulang}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Data KHS tidak tersedia</p>
              )}
            </SectionCard>
          )}

          {/* Warning for MK Diulang */}
          {m.jumlah_mk_diulang > 0 && activeTab !== 'analisis' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-5">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 text-sm mb-1">Perhatian: Mahasiswa Memiliki Matakuliah Diulang</h4>
                  <p className="text-sm text-red-700">Terdapat <strong>{m.jumlah_mk_diulang}</strong> MK diulang ({m.sks_mk_diulang} SKS). Rasio: <strong>{rasioUlang.toFixed(1)}%</strong></p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  /* ════════════════════════════════════════════════ */
  /*  SEARCH FORM — initial view                    */
  /* ════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <MagnifyingGlassIcon className="h-7 w-7 text-blue-900" />
            <div>
              <h1 className="text-xl font-bold text-blue-900">Cari Data Mahasiswa</h1>
              <p className="text-sm text-blue-600">Masukkan NIM untuk melihat detail lengkap & analisis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-3 sm:px-5 lg:px-6 py-4 pb-20 md:pb-4">
        {/* Hero Search Section */}
        <div className="bg-blue-900 rounded-2xl shadow-xl overflow-hidden mb-4">
          <div className="px-4 sm:px-8 py-8 sm:py-12 text-center">
            <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-5">
              <MagnifyingGlassIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pencarian Data Mahasiswa</h2>
            <p className="text-blue-200 text-sm sm:text-base mb-8 max-w-lg mx-auto">Masukkan NIM untuk menampilkan detail lengkap, data pribadi, keluarga, riwayat KHS, dan analisis performa akademik</p>

            <div className="max-w-xl mx-auto">
              {localError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg flex items-center space-x-2">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-300 flex-shrink-0" />
                  <p className="text-sm text-red-200">{localError}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <IdentificationIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input id="nim" type="text" value={nim} onChange={(e) => setNim(e.target.value)} onKeyDown={handleKeyDown} placeholder="Masukkan NIM mahasiswa..." className="w-full pl-12 pr-4 py-3.5 border-0 rounded-xl text-sm bg-white text-gray-900 shadow-lg focus:ring-2 focus:ring-blue-400 placeholder-gray-400" disabled={isLoading} />
                </div>
                <button type="button" onClick={handleCari} disabled={isLoading} className="flex items-center justify-center px-6 py-3.5 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 text-sm shadow-lg whitespace-nowrap">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900 mr-2"></div>
                  ) : (
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? 'Mencari...' : 'Cari & Tampilkan'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { icon: <ShieldCheckIcon className="h-7 w-7 text-blue-600" />, title: 'Analisis Status', desc: 'Skor kesehatan akademik, deteksi masalah, dan rekomendasi perbaikan', bg: 'bg-blue-50 border-blue-200' },
            { icon: <AcademicCapIcon className="h-7 w-7 text-emerald-600" />, title: 'Data Akademik', desc: 'SKS, IPK, info kelulusan, dosen PA, dan program studi', bg: 'bg-emerald-50 border-emerald-200' },
            { icon: <UserIcon className="h-7 w-7 text-purple-600" />, title: 'Data Pribadi & Keluarga', desc: 'Identitas, kontak, serta data orang tua dan wali', bg: 'bg-purple-50 border-purple-200' },
            { icon: <BookOpenIcon className="h-7 w-7 text-amber-600" />, title: 'Riwayat KHS', desc: 'Kartu Hasil Studi per semester lengkap dengan grafik IPS', bg: 'bg-amber-50 border-amber-200' },
          ].map((f, i) => (
            <div key={i} className={`rounded-xl border p-4 ${f.bg}`}>
              <div className="mb-2">{f.icon}</div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed hidden sm:block">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Cara Menggunakan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { step: '1', title: 'Masukkan NIM', desc: 'Ketik NIM mahasiswa pada kolom pencarian di atas' },
              { step: '2', title: 'Klik Cari', desc: 'Tekan tombol cari atau Enter untuk memulai pencarian' },
              { step: '3', title: 'Lihat Hasil', desc: 'Semua data akan ditampilkan dalam tab yang terorganisir' },
            ].map((s, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">{s.step}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
