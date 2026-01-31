'use client';

import { useState, useEffect } from 'react';
import { ChartBarIcon, CalculatorIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  ipk: number;
  kehadiran: number;
  sks_lulus: number;
  mk_mengulang: number;
  lama_studi: number;
}

interface HasilSAW {
  mahasiswa: Mahasiswa;
  nilai: number;
  kategori: string;
}

interface Normalisasi {
  nama: string;
  ipk: number;
  kehadiran: number;
  sks: number;
  mk: number;
  lama: number;
}

export default function Proses() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [hasil, setHasil] = useState<HasilSAW[]>([]);
  const [filteredHasil, setFilteredHasil] = useState<HasilSAW[]>([]);
  const [normalisasi, setNormalisasi] = useState<Normalisasi[]>([]);
  const [filteredNormalisasi, setFilteredNormalisasi] = useState<Normalisasi[]>([]);
  const [preferensi, setPreferensi] = useState<{nama: string, nilai: number}[]>([]);
  const [filteredPreferensi, setFilteredPreferensi] = useState<{nama: string, nilai: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [mahasiswa, hasil, normalisasi, preferensi, searchTerm, selectedKategori]);

  const fetchData = async () => {
    try {
      const resMahasiswa = await fetch('http://localhost:8080/mahasiswa');
      const dataMahasiswa = await resMahasiswa.json();
      setMahasiswa(dataMahasiswa);

      const resHasil = await fetch('http://localhost:8080/proses', { method: 'POST' });
      const dataHasil = await resHasil.json();
      setHasil(dataHasil);

      // Hitung normalisasi dan preferensi untuk tampilan
      const norm: Normalisasi[] = dataMahasiswa.map((m: Mahasiswa) => ({
        nama: m.nama,
        ipk: m.ipk / 4.0,
        kehadiran: m.kehadiran / 100.0,
        sks: m.sks_lulus / 144.0,
        mk: m.mk_mengulang === 0 ? 1.0 : 0.0 / m.mk_mengulang,
        lama: 7.0 / m.lama_studi,
      }));
      setNormalisasi(norm);

      const pref = dataHasil.map((h: HasilSAW) => ({
        nama: h.mahasiswa.nama,
        nilai: h.nilai,
      }));
      setPreferensi(pref);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterData = () => {
    let filteredMhs = mahasiswa;
    let filteredHsl = hasil;
    let filteredNorm = normalisasi;
    let filteredPref = preferensi;

    // Filter berdasarkan search term (nama)
    if (searchTerm) {
      filteredMhs = filteredMhs.filter(m => m.nama.toLowerCase().includes(searchTerm.toLowerCase()));
      filteredHsl = filteredHsl.filter(h => h.mahasiswa.nama.toLowerCase().includes(searchTerm.toLowerCase()));
      filteredNorm = filteredNorm.filter(n => n.nama.toLowerCase().includes(searchTerm.toLowerCase()));
      filteredPref = filteredPref.filter(p => p.nama.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filter berdasarkan kategori
    if (selectedKategori) {
      filteredHsl = filteredHsl.filter(h => h.kategori === selectedKategori);
      const filteredNames = filteredHsl.map(h => h.mahasiswa.nama);
      filteredMhs = filteredMhs.filter(m => filteredNames.includes(m.nama));
      filteredNorm = filteredNorm.filter(n => filteredNames.includes(n.nama));
      filteredPref = filteredPref.filter(p => filteredNames.includes(p.nama));
    }

    setFilteredHasil(filteredHsl);
    setFilteredNormalisasi(filteredNorm);
    setFilteredPreferensi(filteredPref);
  };

  const uniqueKategori = [...new Set(hasil.map(h => h.kategori))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <CalculatorIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Proses Perhitungan</h1>
              <p className="text-sm text-blue-600">Langkah-langkah Metode SAW</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FunnelIcon className="h-6 w-6 text-blue-900" />
            <h2 className="text-xl font-bold text-blue-900">Filter Data</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Cari nama mahasiswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-600 text-gray-700 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Kategori Filter */}
            <div>
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              >
                <option value="" className="text-gray-700">Semua Kategori</option>
                {uniqueKategori.map((kategori) => (
                  <option key={kategori} value={kategori} className="text-gray-700">{kategori}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredHasil.length} dari {hasil.length} mahasiswa
            </p>
            {(searchTerm || selectedKategori) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedKategori('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Data Akademik Awal */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <ChartBarIcon className="h-6 w-6 text-blue-900" />
            <h2 className="text-xl font-bold text-blue-900">Data Akademik Mahasiswa</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Nama</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">IPK</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Kehadiran (%)</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">SKS Lulus</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">MK Mengulang</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Lama Studi (semester)</th>
                </tr>
              </thead>
              <tbody>
                {mahasiswa.filter(m => filteredHasil.some(h => h.mahasiswa.nama === m.nama)).map((m, index) => (
                  <tr key={m.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 p-3 font-medium text-gray-900">{m.nama}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{m.ipk}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{m.kehadiran}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{m.sks_lulus}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{m.mk_mengulang}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{m.lama_studi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Normalisasi */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <ChartBarIcon className="h-6 w-6 text-blue-900" />
            <h3 className="text-xl font-bold text-blue-900">Langkah 1: Normalisasi Data (SAW)</h3>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p className="text-blue-800 font-medium">Rumus Normalisasi:</p>
            <p className="text-blue-700">• <strong>Benefit:</strong> r_ij = x_ij / max(x_j)</p>
            <p className="text-blue-700">• <strong>Cost:</strong> r_ij = min(x_j) / x_ij</p>
            <p className="text-blue-700 mt-2">Kriteria: IPK, Kehadiran, SKS Lulus (Benefit) | MK Mengulang, Lama Studi (Cost)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Nama</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">IPK (Benefit)</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Kehadiran (Benefit)</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">SKS Lulus (Benefit)</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">MK Mengulang (Cost)</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Lama Studi (Cost)</th>
                </tr>
              </thead>
              <tbody>
                {filteredNormalisasi.map((n, index) => (
                  <tr key={n.nama} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 p-3 font-medium text-gray-900">{n.nama}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{n.ipk.toFixed(3)}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{n.kehadiran.toFixed(3)}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{n.sks.toFixed(3)}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{n.mk.toFixed(3)}</td>
                    <td className="border border-gray-300 p-3 text-gray-700">{n.lama.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preferensi */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <CalculatorIcon className="h-6 w-6 text-blue-900" />
            <h3 className="text-xl font-bold text-blue-900">Langkah 2: Perhitungan Nilai Preferensi</h3>
          </div>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <p className="text-green-800 font-medium">Rumus Preferensi:</p>
            <p className="text-green-700">V_i = Σ (w_j × r_ij)</p>
            <p className="text-green-700 mt-2">Bobot Kriteria:</p>
            <ul className="text-green-700 ml-4">
              <li>• IPK: 0.30</li>
              <li>• Kehadiran: 0.20</li>
              <li>• SKS Lulus: 0.20</li>
              <li>• MK Mengulang: 0.15</li>
              <li>• Lama Studi: 0.15</li>
            </ul>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Nama</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Nilai Preferensi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPreferensi.map((p, index) => (
                  <tr key={p.nama} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 p-3 font-medium text-gray-900">{p.nama}</td>
                    <td className="border border-gray-300 p-3 text-gray-700 font-mono">{p.nilai.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kategori */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <ChartBarIcon className="h-6 w-6 text-blue-900" />
            <h3 className="text-xl font-bold text-blue-900">Langkah 3: Pengelompokan Kategori</h3>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-4">
            <p className="text-purple-800 font-medium">Kriteria Kategori:</p>
            <ul className="text-purple-700 ml-4">
              <li>• ≥ 0.80: Berprestasi</li>
              <li>• 0.60 - 0.79: Normal</li>
              <li>• &lt; 0.60: Berisiko</li>
            </ul>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Nama</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Nilai SAW</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-blue-900">Kategori</th>
                </tr>
              </thead>
              <tbody>
                {filteredHasil.map((h, index) => (
                  <tr key={h.mahasiswa.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 p-3 font-medium text-gray-900">{h.mahasiswa.nama}</td>
                    <td className="border border-gray-300 p-3 text-gray-700 font-mono">{h.nilai.toFixed(3)}</td>
                    <td className="border border-gray-300 p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        h.kategori === 'Berprestasi' ? 'bg-yellow-100 text-yellow-800' :
                        h.kategori === 'Normal' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {h.kategori}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}