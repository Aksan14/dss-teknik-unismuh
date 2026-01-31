'use client';

import {
    AcademicCapIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    DocumentMagnifyingGlassIcon,
    ExclamationTriangleIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    UserGroupIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MahasiswaItem {
  id: number;
  nim: string;
  nama: string;
  jurusan: string;
  angkatan: number;
  semester: number;
  status: string;
  ipk: number;
  kehadiran: number;
  prestasi: string;
  beasiswa: string;
  keterangan: string;
}

export default function AnalisisSearchPage() {
  const router = useRouter();
  const [mahasiswaList, setMahasiswaList] = useState<MahasiswaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterJurusan, setFilterJurusan] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8080/mahasiswa');
        if (!response.ok) throw new Error('Gagal mengambil data');
        const data = await response.json();
        setMahasiswaList(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data
  const filteredData = mahasiswaList.filter((m) => {
    const matchSearch = !searchTerm || 
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nim.includes(searchTerm);
    
    const matchStatus = !filterStatus || m.status === filterStatus;
    const matchJurusan = !filterJurusan || m.jurusan === filterJurusan;
    
    return matchSearch && matchStatus && matchJurusan;
  });

  // Get unique values for filters
  const uniqueStatus = [...new Set(mahasiswaList.map(m => m.status))];
  const uniqueJurusan = [...new Set(mahasiswaList.map(m => m.jurusan))];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aktif': return 'bg-green-100 text-green-800';
      case 'Alumni': return 'bg-blue-100 text-blue-800';
      case 'Cuti': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIPKStatus = (ipk: number) => {
    if (ipk >= 3.5) return { color: 'text-green-600', label: 'Sangat Baik', icon: CheckCircleIcon };
    if (ipk >= 3.0) return { color: 'text-blue-600', label: 'Baik', icon: CheckCircleIcon };
    if (ipk >= 2.0) return { color: 'text-yellow-600', label: 'Cukup', icon: ExclamationTriangleIcon };
    return { color: 'text-red-600', label: 'Kurang', icon: XMarkIcon };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentMagnifyingGlassIcon className="h-8 w-8 text-blue-900" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Pencarian & Analisis Data Mahasiswa</h1>
                <p className="text-sm text-blue-600">Cari, filter, dan analisis data mahasiswa secara komprehensif</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <MagnifyingGlassIcon className="h-6 w-6 text-blue-900" />
            <h2 className="text-lg font-bold text-gray-900">Pencarian & Filter</h2>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Nama atau NIM</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Masukkan nama atau NIM mahasiswa..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status Mahasiswa</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                {uniqueStatus.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Jurusan Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jurusan</label>
              <select
                value={filterJurusan}
                onChange={(e) => setFilterJurusan(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Jurusan</option>
                {uniqueJurusan.map(jurusan => (
                  <option key={jurusan} value={jurusan}>{jurusan}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircleIcon className="h-5 w-5 text-blue-600" />
            <span>Menampilkan <strong>{filteredData.length}</strong> dari <strong>{mahasiswaList.length}</strong> mahasiswa</span>
          </div>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="text-center py-12">
            <svg className="animate-spin h-12 w-12 text-blue-900 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-3">
            <XMarkIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <MagnifyingGlassIcon className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold text-yellow-900 mb-1">Tidak ada hasil</h3>
            <p className="text-yellow-700 text-sm">Coba ubah kriteria pencarian atau filter Anda</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nama / NIM</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Jurusan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">IPK</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kehadiran</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((m) => {
                    const ipkStatus = getIPKStatus(m.ipk);
                    const IPKIcon = ipkStatus.icon;
                    return (
                      <React.Fragment key={m.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{m.nama}</p>
                              <p className="text-sm text-gray-600">NIM: {m.nim}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{m.jurusan}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(m.status)}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className={`font-bold ${ipkStatus.color}`}>{m.ipk.toFixed(2)}</span>
                              <IPKIcon className={`h-4 w-4 ${ipkStatus.color}`} />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    m.kehadiran >= 80 ? 'bg-green-600' : 
                                    m.kehadiran >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                                  }`}
                                  style={{ width: `${m.kehadiran}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-semibold text-gray-900">{m.kehadiran}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setExpandedRow(expandedRow === m.id ? null : m.id)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              {expandedRow === m.id ? (
                                <ChevronUpIcon className="h-5 w-5 text-blue-900" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5 text-blue-900" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {/* Expanded Row */}
                        {expandedRow === m.id && (
                          <tr className="bg-blue-50 border-b border-gray-200">
                            <td colSpan={6} className="px-6 py-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Column 1 */}
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 mb-3">Informasi Akademik</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="text-gray-600">Angkatan:</span> <span className="font-semibold text-gray-900">{m.angkatan}</span></div>
                                    <div><span className="text-gray-600">Semester:</span> <span className="font-semibold text-gray-900">{m.semester}</span></div>
                                    <div><span className="text-gray-600">Status:</span> <span className="font-semibold text-gray-900">{m.status}</span></div>
                                  </div>
                                </div>

                                {/* Column 2 */}
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 mb-3">Prestasi & Beasiswa</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <p className="text-gray-600 text-xs">Prestasi</p>
                                      <p className="font-semibold text-gray-900">{m.prestasi || 'Tidak Ada'}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 text-xs">Beasiswa</p>
                                      <p className="font-semibold text-gray-900">{m.beasiswa || 'Tidak Ada'}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Column 3 - Buttons */}
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 mb-3">Aksi</h4>
                                  <div className="space-y-2 flex flex-col">
                                    <button
                                      onClick={() => router.push(`/detail-mahasiswa?nim=${encodeURIComponent(m.nim)}`)}
                                      className="px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
                                    >
                                      <DocumentMagnifyingGlassIcon className="h-4 w-4" />
                                      <span>Lihat Detail</span>
                                    </button>
                                    <Link href="/cari-mahasiswa">
                                      <button
                                        onClick={() => {
                                          // Store NIM for analysis
                                          sessionStorage.setItem('analyzeNim', m.nim);
                                        }}
                                        className="w-full px-4 py-2 bg-green-900 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center space-x-2"
                                      >
                                        <SparklesIcon className="h-4 w-4" />
                                        <span>Analisis</span>
                                      </button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {!isLoading && !error && mahasiswaList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Mahasiswa</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{mahasiswaList.length}</p>
                </div>
                <UserGroupIcon className="h-10 w-10 text-blue-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Hasil Pencarian</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{filteredData.length}</p>
                </div>
                <CheckCircleIcon className="h-10 w-10 text-green-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Rata-rata IPK</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {(mahasiswaList.reduce((acc, m) => acc + m.ipk, 0) / mahasiswaList.length).toFixed(2)}
                  </p>
                </div>
                <AcademicCapIcon className="h-10 w-10 text-purple-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Rata-rata Kehadiran</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {Math.round(mahasiswaList.reduce((acc, m) => acc + m.kehadiran, 0) / mahasiswaList.length)}%
                  </p>
                </div>
                <FunnelIcon className="h-10 w-10 text-orange-200" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Add React import at top level
import React from 'react';
