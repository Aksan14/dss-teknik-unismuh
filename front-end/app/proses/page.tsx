'use client';
import { CalculatorIcon, ChartBarIcon, CheckCircleIcon, ExclamationTriangleIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';

interface MahasiswaData {
  nim: string;
  nama: string;
  ipk: number;
  angkatan: number;
  sks_total: number;
  sks_diambil: number;
  sks_lulus: number;
  matakuliah_lulus: number;
  jumlah_mk_diulang: number;
  sks_mk_diulang: number;
  status: string;
  kategori: string;
  jurusan: string;
}

interface HasilSAW {
  nim: string;
  nama: string;
  ipk: number;
  sks_total: number;
  sks_diambil: number;
  sks_lulus: number;
  matakuliah_lulus: number;
  jumlah_mk_diulang: number;
  sks_mk_diulang: number;
  angkatan: number;
  nilai_saw: number;
  kategori: string;
  jurusan: string;
  ranking: number;
  jurusan: string;
}

export default function Proses() {
  const [mahasiswa, setMahasiswa] = useState<MahasiswaData[]>([]);
  const [hasil, setHasil] = useState<HasilSAW[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [resMahasiswa, resHasil] = await Promise.all([
        fetch('http://localhost:8080/api/v1/mahasiswa/aktif'),
        fetch('http://localhost:8080/api/v1/analisis/saw', { method: 'POST' }),
      ]);
      if (!resMahasiswa.ok || !resHasil.ok) throw new Error('Gagal mengambil data dari server');
      const rawMahasiswa = await resMahasiswa.json();
      const rawHasil = await resHasil.json();
      const dataMahasiswa = rawMahasiswa?.data ?? (Array.isArray(rawMahasiswa) ? rawMahasiswa : []);
      const dataHasil = rawHasil?.data ?? (Array.isArray(rawHasil) ? rawHasil : []);
      setMahasiswa(dataMahasiswa);
      setHasil(dataHasil);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data. Pastikan server backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const filteredHasil = useMemo(() => {
    let filtered = hasil;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(h => h.nama.toLowerCase().includes(q) || h.nim.toLowerCase().includes(q));
    }
    if (selectedKategori) filtered = filtered.filter(h => h.kategori === selectedKategori);
    return filtered;
  }, [hasil, searchTerm, selectedKategori]);

  const filteredMahasiswa = useMemo(() => {
    const nimSet = new Set(filteredHasil.map(h => h.nim));
    return mahasiswa.filter(m => nimSet.has(m.nim));
  }, [mahasiswa, filteredHasil]);

  const normalisasiData = useMemo(() => {
    if (!filteredMahasiswa.length) return [];
    let maxIPK = 0, maxSKSLulus = 0, maxMKLulus = 0;
    let minMKUlang = Infinity, minSKSUlang = Infinity;
    filteredMahasiswa.forEach(m => {
      if (m.ipk > maxIPK) maxIPK = m.ipk;
      if (m.sks_lulus > maxSKSLulus) maxSKSLulus = m.sks_lulus;
      if (m.matakuliah_lulus > maxMKLulus) maxMKLulus = m.matakuliah_lulus;
      if (m.jumlah_mk_diulang < minMKUlang) minMKUlang = m.jumlah_mk_diulang;
      if (m.sks_mk_diulang < minSKSUlang) minSKSUlang = m.sks_mk_diulang;
    });
    if (maxIPK === 0) maxIPK = 4.0;
    if (maxSKSLulus === 0) maxSKSLulus = 1;
    if (maxMKLulus === 0) maxMKLulus = 1;
    return filteredMahasiswa.map(m => ({
      nim: m.nim, nama: m.nama,
      rIPK: m.ipk / maxIPK,
      rSKSLulus: m.sks_lulus / maxSKSLulus,
      rMKLulus: m.matakuliah_lulus / maxMKLulus,
      rMKUlang: m.jumlah_mk_diulang === 0 ? 1.0 : (minMKUlang === 0 ? 0.0 : minMKUlang / m.jumlah_mk_diulang),
      rSKSUlang: m.sks_mk_diulang === 0 ? 1.0 : (minSKSUlang === 0 ? 0.0 : minSKSUlang / m.sks_mk_diulang),
    }));
  }, [filteredMahasiswa]);

  const uniqueKategori = useMemo(() => [...new Set(hasil.map(h => h.kategori))], [hasil]);

  const summary = useMemo(() => {
    const berprestasi = filteredHasil.filter(h => h.kategori === 'Berprestasi').length;
    const normal = filteredHasil.filter(h => h.kategori === 'Normal').length;
    const berisiko = filteredHasil.filter(h => h.kategori === 'Berisiko').length;
    const bermasalah = filteredHasil.filter(h => h.jumlah_mk_diulang > 0).length;
    return { berprestasi, normal, berisiko, bermasalah };
  }, [filteredHasil]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div>
          <p className="text-gray-500 text-sm">Memproses perhitungan SAW...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Coba Lagi</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { label: 'Data Akademik', icon: '\u{1F4CA}' },
    { label: 'Normalisasi', icon: '\u{1F4D0}' },
    { label: 'Nilai Preferensi', icon: '\u{1F3C6}' },
    { label: 'Kategori & Masalah', icon: '\u26A0\uFE0F' },
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <CalculatorIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Proses Perhitungan SAW</h1>
              <p className="text-sm text-blue-600">Simple Additive Weighting - 5 Kriteria (IPK, SKS Lulus, MK Lulus, MK Diulang, SKS MK Diulang)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Bobot Kriteria */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-blue-900 mb-4">Bobot Kriteria SAW</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { nama: 'IPK', bobot: 0.30, jenis: 'Benefit', color: 'bg-green-100 text-green-800' },
              { nama: 'SKS Lulus', bobot: 0.20, jenis: 'Benefit', color: 'bg-blue-100 text-blue-800' },
              { nama: 'MK Lulus', bobot: 0.15, jenis: 'Benefit', color: 'bg-indigo-100 text-indigo-800' },
              { nama: 'MK Diulang', bobot: 0.20, jenis: 'Cost', color: 'bg-red-100 text-red-800' },
              { nama: 'SKS MK Diulang', bobot: 0.15, jenis: 'Cost', color: 'bg-orange-100 text-orange-800' },
            ].map(k => (
              <div key={k.nama} className={`rounded-lg p-4 ${k.color}`}>
                <p className="font-bold text-sm">{k.nama}</p>
                <p className="text-2xl font-bold">{(k.bobot * 100).toFixed(0)}%</p>
                <p className="text-xs mt-1">{k.jenis === 'Benefit' ? '\u2191 Semakin tinggi semakin baik' : '\u2193 Semakin rendah semakin baik'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-800">{summary.berprestasi}</p>
            <p className="text-sm text-green-600">Berprestasi</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">{summary.normal}</p>
            <p className="text-sm text-blue-600">Normal</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-800">{summary.berisiko}</p>
            <p className="text-sm text-red-600">Berisiko</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-800">{summary.bermasalah}</p>
            <p className="text-sm text-orange-600">Punya MK Diulang</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <FunnelIcon className="h-6 w-6 text-blue-900" />
            <h2 className="text-lg font-bold text-blue-900">Filter Data</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input type="text" placeholder="Cari nama atau NIM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <select value={selectedKategori} onChange={(e) => setSelectedKategori(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Semua Kategori</option>
              {uniqueKategori.map(k => (<option key={k} value={k}>{k}</option>))}
            </select>
          </div>
          <p className="mt-3 text-sm text-gray-500">Menampilkan <span className="font-bold text-blue-900">{filteredHasil.length}</span> dari {hasil.length} mahasiswa</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)} className={`flex-1 min-w-[160px] px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === i ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <span className="mr-2">{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 overflow-x-auto">
            {/* Tab 0: Data Akademik */}
            {activeTab === 0 && (
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-4">Langkah 1: Data Akademik Mahasiswa Aktif</h3>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-blue-900">No</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-blue-900">Nama</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-blue-900">NIM</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-blue-900">Angkatan</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-blue-900">Jurusan</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-blue-900">IPK</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-blue-900">SKS Lulus</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-blue-900">SKS Diambil</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-blue-900">MK Lulus</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-green-800 bg-green-50">MK Diulang</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-green-800 bg-green-50">SKS MK Diulang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMahasiswa.slice(0, 100).map((m, i) => (
                      <tr key={m.nim} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-200 px-3 py-2">{i + 1}</td>
                        <td className="border border-gray-200 px-3 py-2 font-medium">{m.nama}</td>
                        <td className="border border-gray-200 px-3 py-2">{m.nim}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{m.angkatan}</td>
                        <td className="border border-gray-200 px-3 py-2 text-xs">{m.jurusan}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{(m.ipk || 0).toFixed(2)}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{m.sks_lulus}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{m.sks_diambil}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{m.matakuliah_lulus}</td>
                        <td className={`border border-gray-200 px-3 py-2 text-center font-semibold ${m.jumlah_mk_diulang > 0 ? 'bg-red-50 text-red-700' : 'text-green-700'}`}>{m.jumlah_mk_diulang}</td>
                        <td className={`border border-gray-200 px-3 py-2 text-center font-semibold ${m.sks_mk_diulang > 0 ? 'bg-red-50 text-red-700' : 'text-green-700'}`}>{m.sks_mk_diulang}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredMahasiswa.length > 100 && (<p className="mt-3 text-sm text-gray-500 text-center">Menampilkan 100 dari {filteredMahasiswa.length} data. Gunakan filter untuk mempersempit.</p>)}
              </div>
            )}

            {/* Tab 1: Normalisasi */}
            {activeTab === 1 && (
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Langkah 2: Matriks Normalisasi (R)</h3>
                <p className="text-sm text-gray-600 mb-4"><strong>Benefit:</strong> r = x / max(x) | <strong>Cost:</strong> r = min(x) / x | Jika cost = 0 maka r = 1.0 (terbaik)</p>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-indigo-900">No</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-indigo-900">Nama</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-green-800 bg-green-50">R(IPK)<br/><span className="text-xs font-normal">Benefit</span></th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-green-800 bg-green-50">R(SKS Lulus)<br/><span className="text-xs font-normal">Benefit</span></th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-green-800 bg-green-50">R(MK Lulus)<br/><span className="text-xs font-normal">Benefit</span></th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-800 bg-red-50">R(MK Diulang)<br/><span className="text-xs font-normal">Cost</span></th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-800 bg-red-50">R(SKS MK Diulang)<br/><span className="text-xs font-normal">Cost</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalisasiData.slice(0, 100).map((n, i) => (
                      <tr key={n.nim} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-200 px-3 py-2">{i + 1}</td>
                        <td className="border border-gray-200 px-3 py-2 font-medium">{n.nama}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{n.rIPK.toFixed(4)}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{n.rSKSLulus.toFixed(4)}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{n.rMKLulus.toFixed(4)}</td>
                        <td className={`border border-gray-200 px-3 py-2 text-center ${n.rMKUlang < 1 ? 'text-red-700 font-semibold' : ''}`}>{n.rMKUlang.toFixed(4)}</td>
                        <td className={`border border-gray-200 px-3 py-2 text-center ${n.rSKSUlang < 1 ? 'text-red-700 font-semibold' : ''}`}>{n.rSKSUlang.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {normalisasiData.length > 100 && (<p className="mt-3 text-sm text-gray-500 text-center">Menampilkan 100 dari {normalisasiData.length} data.</p>)}
              </div>
            )}

            {/* Tab 2: Nilai Preferensi */}
            {activeTab === 2 && (
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Langkah 3: Nilai Preferensi (V) &amp; Ranking</h3>
                <p className="text-sm text-gray-600 mb-4">V = (0.30 x R_IPK) + (0.20 x R_SKS) + (0.15 x R_MK) + (0.20 x R_MKUlang) + (0.15 x R_SKSUlang)</p>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-yellow-50">
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-yellow-900">Ranking</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-yellow-900">Nama</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-yellow-900">NIM</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-yellow-900">Angkatan</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-yellow-900">Jurusan</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-yellow-900">IPK</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-yellow-900">MK Diulang</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-yellow-900">SKS MK Diulang</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-yellow-900">Nilai SAW</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-yellow-900">Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHasil.slice(0, 100).map((h, i) => (
                      <tr key={h.nim} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-200 px-3 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${h.ranking <= 3 ? 'bg-yellow-400 text-yellow-900' : h.ranking <= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>#{h.ranking}</span>
                        </td>
                        <td className="border border-gray-200 px-3 py-2 font-medium">{h.nama}</td>
                        <td className="border border-gray-200 px-3 py-2">{h.nim}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{h.angkatan}</td>
                        <td className="border border-gray-200 px-3 py-2 text-xs">{h.jurusan}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">{(h.ipk || 0).toFixed(2)}</td>
                        <td className={`border border-gray-200 px-3 py-2 text-center font-semibold ${h.jumlah_mk_diulang > 0 ? 'text-red-700' : 'text-green-700'}`}>{h.jumlah_mk_diulang}</td>
                        <td className={`border border-gray-200 px-3 py-2 text-center font-semibold ${h.sks_mk_diulang > 0 ? 'text-red-700' : 'text-green-700'}`}>{h.sks_mk_diulang}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center font-bold">{h.nilai_saw.toFixed(4)}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${h.kategori === 'Berprestasi' ? 'bg-green-100 text-green-800' : h.kategori === 'Normal' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>{h.kategori}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredHasil.length > 100 && (<p className="mt-3 text-sm text-gray-500 text-center">Menampilkan 100 dari {filteredHasil.length} data.</p>)}
              </div>
            )}

            {/* Tab 3: Kategori & Masalah */}
            {activeTab === 3 && (
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-4">Analisis Kategori &amp; Mahasiswa Bermasalah</h3>
                <div className="mb-6">
                  <h4 className="text-md font-bold text-red-800 mb-3 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    Mahasiswa dengan Matakuliah Diulang (Bermasalah)
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">Mahasiswa yang memiliki jumlah matakuliah diulang &gt; 0. Perbandingan SKS diambil vs SKS MK diulang menunjukkan tingkat masalah.</p>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-red-50">
                        <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-red-900">No</th>
                        <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-red-900">Nama</th>
                        <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-red-900">NIM</th>
                        <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-900">Angkatan</th>
                        <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-red-900">Jurusan</th>
                        <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-900">IPK</th>
                        <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-900">SKS Diambil</th>
                        <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-900">SKS Lulus</th>
                        <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-900">MK Diulang</th>
                        <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-900">SKS MK Diulang</th>
                        <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-900">Rasio Ulang</th>
                        <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-900">Nilai SAW</th>
                        <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-red-900">Kategori</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHasil.filter(h => h.jumlah_mk_diulang > 0).sort((a, b) => b.sks_mk_diulang - a.sks_mk_diulang).slice(0, 100).map((h, i) => {
                        const rasio = h.sks_diambil > 0 ? ((h.sks_mk_diulang / h.sks_diambil) * 100) : 0;
                        return (
                          <tr key={h.nim} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50/30'}>
                            <td className="border border-gray-200 px-3 py-2">{i + 1}</td>
                            <td className="border border-gray-200 px-3 py-2 font-medium">{h.nama}</td>
                            <td className="border border-gray-200 px-3 py-2">{h.nim}</td>
                            <td className="border border-gray-200 px-3 py-2 text-center">{h.angkatan}</td>
                            <td className="border border-gray-200 px-3 py-2 text-xs">{h.jurusan}</td>
                            <td className="border border-gray-200 px-3 py-2 text-center">{(h.ipk || 0).toFixed(2)}</td>
                            <td className="border border-gray-200 px-3 py-2 text-center">{h.sks_diambil}</td>
                            <td className="border border-gray-200 px-3 py-2 text-center">{h.sks_lulus}</td>
                            <td className="border border-gray-200 px-3 py-2 text-center font-bold text-red-700">{h.jumlah_mk_diulang}</td>
                            <td className="border border-gray-200 px-3 py-2 text-center font-bold text-red-700">{h.sks_mk_diulang}</td>
                            <td className={`border border-gray-200 px-3 py-2 text-center font-bold ${rasio > 20 ? 'text-red-700' : rasio > 10 ? 'text-orange-700' : 'text-yellow-700'}`}>{rasio.toFixed(1)}%</td>
                            <td className="border border-gray-200 px-3 py-2 text-center">{h.nilai_saw.toFixed(4)}</td>
                            <td className="border border-gray-200 px-3 py-2 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${h.kategori === 'Berprestasi' ? 'bg-green-100 text-green-800' : h.kategori === 'Normal' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>{h.kategori}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredHasil.filter(h => h.jumlah_mk_diulang > 0).length === 0 && (<p className="text-center text-gray-500 py-4">Tidak ada mahasiswa dengan matakuliah diulang.</p>)}
                </div>

                <div>
                  <h4 className="text-md font-bold text-blue-900 mb-3">Ringkasan per Kategori</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Berprestasi', 'Normal', 'Berisiko'].map(kat => {
                      const items = filteredHasil.filter(h => h.kategori === kat);
                      const mkUlang = items.filter(h => h.jumlah_mk_diulang > 0).length;
                      const avgIPK = items.length > 0 ? items.reduce((s, h) => s + h.ipk, 0) / items.length : 0;
                      const avgSAW = items.length > 0 ? items.reduce((s, h) => s + h.nilai_saw, 0) / items.length : 0;
                      const color = kat === 'Berprestasi' ? 'green' : kat === 'Normal' ? 'blue' : 'red';
                      return (
                        <div key={kat} className={`bg-${color}-50 border border-${color}-200 rounded-xl p-5`}>
                          <h5 className={`font-bold text-${color}-800 text-lg mb-3`}>{kat}</h5>
                          <div className="space-y-2 text-sm">
                            <p>Jumlah: <span className="font-bold">{items.length}</span></p>
                            <p>Rata-rata IPK: <span className="font-bold">{avgIPK.toFixed(2)}</span></p>
                            <p>Rata-rata Nilai SAW: <span className="font-bold">{avgSAW.toFixed(4)}</span></p>
                            <p>Punya MK Diulang: <span className={`font-bold ${mkUlang > 0 ? 'text-red-700' : 'text-green-700'}`}>{mkUlang}</span></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}