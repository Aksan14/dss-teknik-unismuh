'use client';

import { API_BASE_URL } from '@/lib/api';
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

// Backend computed analysis interfaces
interface Masalah {
  text: string;
  severity: string; // high, medium, low
}
interface TanyaJawab {
  question: string;
  answer: string;
  color: string; // green, blue, orange, red, gray
}
interface IPSStats {
  average: number;
  max: number;
  min: number;
  last: number;
  trend: string; // up, down, stable
}
interface Analisis {
  progress_sks: number;
  efisiensi: number;
  rasio_ulang: number;
  tahun_studi: number;
  semester_aktif: number;
  sks_per_semester: number;
  mk_lulus_per_sem: number;
  tingkat_kelulusan: number;
  sks_ganjil: number; // SKS in odd semesters
  sks_genap: number;  // SKS in even semesters
  ips_stats: IPSStats;
  estimasi_lulus: string;
  estimasi_bulan_tahun: string;
  semester_sisa: number;
  sks_sisa: number;
  sks_per_sem_ideal: number;
  skor_akademik: number;
  skor_akademik_label: string;
  nilai_saw: number;
  is_on_track: boolean;
  risk_do: boolean;
  bisa_cum_laude: boolean;
  masalah: Masalah[];
  prestasi: string[];
  rekomendasi: string[];
  tanya_jawab: TanyaJawab[];
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
  analisis?: Analisis; // Backend computed analysis
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

/* ───────── Search Result Interface ───────── */
interface SearchResult {
  nim: string;
  nama: string;
  ipk: number;
  angkatan: number;
  sks_lulus: number;
  status: string;
  kategori: string;
}

/* ───────── Main Page ───────── */
export default function CariMahasiswaPage() {
  const [query, setQuery] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<MahasiswaDetail | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'analisis' | 'akademik' | 'pribadi' | 'keluarga' | 'khs'>('analisis');

  // Check if query looks like NIM (all digits) or name
  const isNIMQuery = (q: string) => /^\d+$/.test(q.trim());

  const handleCari = async () => {
    setLocalError('');
    const trimmedQuery = query.trim();
    if (!trimmedQuery) { setLocalError('Masukkan NIM atau nama mahasiswa'); return; }
    
    setIsLoading(true);
    setData(null);
    setSearchResults([]);
    setShowResults(false);

    try {
      if (isNIMQuery(trimmedQuery)) {
        // Direct NIM search - get detail immediately
        const res = await fetch(`${API_BASE_URL}/mahasiswa/${trimmedQuery}/detail`);
        if (!res.ok) throw new Error('Mahasiswa tidak ditemukan');
        const result = await res.json();
        setData(result);
        setActiveTab('analisis');
      } else {
        // Name search - show list of results
        const res = await fetch(`${API_BASE_URL}/mahasiswa/search?q=${encodeURIComponent(trimmedQuery)}`);
        if (!res.ok) throw new Error('Pencarian gagal');
        const result = await res.json();
        const results = result.data || [];
        if (results.length === 0) {
          setLocalError(`Tidak ditemukan mahasiswa dengan nama "${trimmedQuery}"`);
        } else if (results.length === 1) {
          // Only one result, show detail directly
          await loadDetail(results[0].nim);
        } else {
          setSearchResults(results);
          setShowResults(true);
        }
      }
    } catch {
      setLocalError('Data tidak ditemukan. Pastikan NIM atau nama sudah benar.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDetail = async (nim: string) => {
    setIsLoading(true);
    setShowResults(false);
    try {
      const res = await fetch(`${API_BASE_URL}/mahasiswa/${nim}/detail`);
      if (!res.ok) throw new Error('Mahasiswa tidak ditemukan');
      const result = await res.json();
      setData(result);
      setActiveTab('analisis');
    } catch {
      setLocalError('Gagal memuat detail mahasiswa.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleCari(); };
  const handleKembali = () => { setData(null); setQuery(''); setSearchResults([]); setShowResults(false); };

  /* ════════════════════════════════════════════════ */
  /*  RESULT VIEW — all detail + analysis in one     */
  /* ════════════════════════════════════════════════ */
  if (data) {
    const m = data;
    const a = m.analisis; // Backend computed analysis
    
    // Use backend-computed values (fallback to basic calculation if analisis not available)
    const tahunStudi = a?.tahun_studi ?? (new Date().getFullYear() - m.angkatan);
    const progressSKS = a?.progress_sks ?? (m.sks_total > 0 ? Math.min((m.sks_lulus / m.sks_total) * 100, 100) : 0);
    const rasioUlang = a?.rasio_ulang ?? (m.sks_diambil > 0 ? ((m.sks_mk_diulang / m.sks_diambil) * 100) : 0);
    const efisiensi = a?.efisiensi ?? (m.sks_diambil > 0 ? ((m.sks_lulus / m.sks_diambil) * 100) : 0);
    const dosenNama = m.dosen_penasehat ? `${m.dosen_penasehat.gelar_depan || ''} ${m.dosen_penasehat.nama} ${m.dosen_penasehat.gelar_belakang || ''}`.trim() : '-';
    const khs = m.khs || [];
    
    // IPS statistics from backend
    const ipsAvg = a?.ips_stats?.average ?? 0;
    const ipsMax = a?.ips_stats?.max ?? 0;
    const ipsMin = a?.ips_stats?.min ?? 0;
    const ipsLast = a?.ips_stats?.last ?? 0;
    const trend = a?.ips_stats?.trend ?? 'stable';
    const totalMKDiulangKHS = khs.reduce((sum, k) => sum + (k.jumlah_mk_diulang || 0), 0);
    const semesterAktif = a?.semester_aktif ?? khs.length;
    const estimasiLulus = a?.estimasi_lulus ?? 'Tidak dapat diprediksi';

    // Use backend-computed analysis data
    const masalah = a?.masalah ?? [];
    const prestasi = a?.prestasi ?? [];
    const rekomendasi = a?.rekomendasi ?? ['Tetap konsisten dan jaga performa akademik saat ini'];
    const tanyaJawab = a?.tanya_jawab ?? [];

    // Skor kesehatan akademik from backend
    const skor = a?.skor_akademik ?? 50;
    const skorLabel = a?.skor_akademik_label ?? 'Cukup';
    const skorColor = skor >= 80 ? 'text-green-700' : skor >= 60 ? 'text-blue-700' : skor >= 40 ? 'text-yellow-700' : skor >= 20 ? 'text-orange-700' : 'text-red-700';
    const skorBg = skor >= 80 ? 'bg-green-500' : skor >= 60 ? 'bg-blue-500' : skor >= 40 ? 'bg-yellow-500' : skor >= 20 ? 'bg-orange-500' : 'bg-red-500';

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
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
            {[
              { label: 'IPK', value: (m.ipk || 0).toFixed(2), color: m.ipk >= 3.5 ? 'text-green-700' : m.ipk >= 3.0 ? 'text-blue-700' : m.ipk >= 2.0 ? 'text-orange-700' : 'text-red-700' },
              { label: 'IPS Terakhir', value: ipsLast.toFixed(2), color: ipsLast >= 3.5 ? 'text-green-700' : ipsLast >= 3.0 ? 'text-blue-700' : 'text-orange-700' },
              { label: 'SKS Lulus', value: `${m.sks_lulus}`, color: 'text-gray-900' },
              { label: 'Sisa SKS', value: `${a?.sks_sisa ?? '-'}`, color: (a?.sks_sisa ?? 0) <= 0 ? 'text-green-700' : (a?.sks_sisa ?? 0) <= 20 ? 'text-blue-700' : 'text-orange-700' },
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
                <GaugeBar value={m.sks_lulus} max={m.sks_total || 156} label="SKS Lulus" color={progressSKS >= 75 ? 'bg-green-500' : progressSKS >= 50 ? 'bg-blue-500' : 'bg-orange-500'} />
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

              {/* SKS Ganjil & Genap */}
              {(m.analisis?.sks_ganjil !== undefined || m.analisis?.sks_genap !== undefined) && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md border border-indigo-100 p-5">
                  <div className="flex items-center space-x-2 mb-4">
                    <BookOpenIcon className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-sm font-bold text-indigo-900">Distribusi SKS per Semester</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-indigo-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-indigo-600 font-medium uppercase">Semester Ganjil</span>
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">1, 3, 5, 7</span>
                      </div>
                      <p className="text-2xl font-bold text-indigo-900">{m.analisis?.sks_ganjil || 0} <span className="text-sm font-normal text-indigo-600">SKS</span></p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-purple-600 font-medium uppercase">Semester Genap</span>
                        <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">2, 4, 6, 8</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">{m.analisis?.sks_genap || 0} <span className="text-sm font-normal text-purple-600">SKS</span></p>
                    </div>
                  </div>
                  {/* Progress comparison */}
                  <div className="mt-4 pt-4 border-t border-indigo-200">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-indigo-700 font-medium">Perbandingan</span>
                      <span className="font-bold text-indigo-900">
                        {((m.analisis?.sks_ganjil || 0) + (m.analisis?.sks_genap || 0))} SKS Total
                      </span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="bg-indigo-500 transition-all duration-500" 
                        style={{ width: `${((m.analisis?.sks_ganjil || 0) / Math.max((m.analisis?.sks_ganjil || 0) + (m.analisis?.sks_genap || 0), 1)) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-purple-500 transition-all duration-500" 
                        style={{ width: `${((m.analisis?.sks_genap || 0) / Math.max((m.analisis?.sks_ganjil || 0) + (m.analisis?.sks_genap || 0), 1)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-indigo-600">Ganjil: {(((m.analisis?.sks_ganjil || 0) / Math.max((m.analisis?.sks_ganjil || 0) + (m.analisis?.sks_genap || 0), 1)) * 100).toFixed(0)}%</span>
                      <span className="text-[10px] text-purple-600">Genap: {(((m.analisis?.sks_genap || 0) / Math.max((m.analisis?.sks_ganjil || 0) + (m.analisis?.sks_genap || 0), 1)) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}

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
                            <p className="text-sm font-semibold leading-snug">{item.question}</p>
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
                              <p className={`text-sm leading-relaxed ${aText}`}>{item.answer}</p>
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
              <p className="text-sm text-blue-600">Masukkan NIM atau nama untuk melihat detail lengkap & analisis</p>
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
            <p className="text-blue-200 text-sm sm:text-base mb-8 max-w-lg mx-auto">Masukkan NIM atau nama mahasiswa untuk menampilkan detail lengkap, data pribadi, keluarga, riwayat KHS, dan analisis performa akademik</p>

            <div className="max-w-xl mx-auto">
              {localError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg flex items-center space-x-2">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-300 flex-shrink-0" />
                  <p className="text-sm text-red-200">{localError}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input id="query" type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Masukkan NIM atau nama mahasiswa..." className="w-full pl-12 pr-4 py-3.5 border-0 rounded-xl text-sm bg-white text-gray-900 shadow-lg focus:ring-2 focus:ring-blue-400 placeholder-gray-400" disabled={isLoading} />
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

        {/* Search Results Inline */}
        {showResults && searchResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-4">
            <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-blue-900 text-sm">Hasil Pencarian</h3>
                <p className="text-xs text-blue-600">Ditemukan {searchResults.length} mahasiswa dengan nama &quot;{query}&quot;</p>
              </div>
              <button onClick={() => { setShowResults(false); setSearchResults([]); }} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">No</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">NIM</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Angkatan</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">IPK</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((m, idx) => (
                    <tr key={m.nim} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{m.nama}</td>
                      <td className="px-4 py-3 text-gray-600">{m.nim}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {m.angkatan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          (m.ipk || 0) >= 3.5 ? 'bg-green-100 text-green-800' :
                          (m.ipk || 0) >= 3.0 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {(m.ipk || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          m.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                          m.status === 'Alumni' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => loadDetail(m.nim)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feature Cards - hide when showing results */}
        {!showResults && (
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
        )}

        {/* Instructions - hide when showing results */}
        {!showResults && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Cara Menggunakan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { step: '1', title: 'Masukkan NIM atau Nama', desc: 'Ketik NIM lengkap atau nama mahasiswa pada kolom pencarian' },
                { step: '2', title: 'Klik Cari', desc: 'Tekan tombol cari atau Enter untuk memulai pencarian' },
                { step: '3', title: 'Lihat Hasil', desc: 'Pilih mahasiswa dari daftar hasil, lalu lihat detail lengkapnya' },
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
        )}
      </main>
    </div>
  );
}
