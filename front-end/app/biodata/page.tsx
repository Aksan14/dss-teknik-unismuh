'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserIcon, AcademicCapIcon, MagnifyingGlassIcon, FunnelIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Mahasiswa {
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
}

const PER_PAGE = 30;

export default function Biodata() {
  const [allData, setAllData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAngkatan, setSelectedAngkatan] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/mahasiswa?limit=10000');
      const result = await res.json();
      setAllData(result.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = useMemo(() => {
    let filtered = allData;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(m => m.nama.toLowerCase().includes(q) || m.nim.includes(searchTerm));
    }
    if (selectedStatus) filtered = filtered.filter(m => m.status === selectedStatus);
    if (selectedAngkatan) filtered = filtered.filter(m => m.angkatan.toString() === selectedAngkatan);
    return filtered;
  }, [allData, searchTerm, selectedStatus, selectedAngkatan]);

  const totalPages = Math.ceil(filteredData.length / PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredData.slice(start, start + PER_PAGE);
  }, [filteredData, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedStatus, selectedAngkatan]);

  const uniqueStatus = useMemo(() => [...new Set(allData.map(m => m.status))], [allData]);
  const uniqueAngkatan = useMemo(() => [...new Set(allData.map(m => m.angkatan))].sort((a, b) => b - a), [allData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Biodata Mahasiswa</h1>
              <p className="text-sm text-blue-600">Informasi akademik mahasiswa UNISMUH</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-900 mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-1" /> Kembali ke Dashboard
        </Link>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FunnelIcon className="h-6 w-6 text-blue-900" />
            <h2 className="text-lg font-bold text-blue-900">Filter Mahasiswa</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input type="text" placeholder="Cari nama atau NIM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Semua Status</option>
              {uniqueStatus.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={selectedAngkatan} onChange={(e) => setSelectedAngkatan(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Semua Angkatan</option>
              {uniqueAngkatan.map(a => <option key={a} value={a.toString()}>{a}</option>)}
            </select>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">Menampilkan <span className="font-bold text-blue-900">{filteredData.length}</span> dari {allData.length} mahasiswa</p>
            {(searchTerm || selectedStatus || selectedAngkatan) && (
              <button onClick={() => { setSearchTerm(''); setSelectedStatus(''); setSelectedAngkatan(''); }} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Reset Filter</button>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((m) => (
            <div key={m.nim} className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-900 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{m.nama}</h3>
                    <p className="text-blue-200 text-sm">{m.nim}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">Angkatan</p>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{m.angkatan}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.status === 'Aktif' ? 'bg-green-100 text-green-800' : m.status === 'Alumni' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'}`}>{m.status}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Kategori</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.kategori === 'Berprestasi' ? 'bg-green-100 text-green-800' : m.kategori === 'Normal' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{m.kategori}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">IPK</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(m.ipk || 0) >= 3.5 ? 'bg-green-100 text-green-800' : (m.ipk || 0) >= 3.0 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{(m.ipk || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AcademicCapIcon className="h-5 w-5 text-blue-900" />
                    <h4 className="text-sm font-semibold text-blue-900">Data Akademik</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-gray-500">SKS Lulus</p><p className="font-bold text-gray-900">{m.sks_lulus}</p></div>
                    <div><p className="text-gray-500">SKS Diambil</p><p className="font-bold text-gray-900">{m.sks_diambil}</p></div>
                    <div><p className="text-gray-500">MK Lulus</p><p className="font-bold text-gray-900">{m.matakuliah_lulus}</p></div>
                    <div>
                      <p className="text-gray-500">MK Diulang</p>
                      <p className={`font-bold ${m.jumlah_mk_diulang > 0 ? 'text-red-700' : 'text-green-700'}`}>{m.jumlah_mk_diulang}</p>
                    </div>
                    <div><p className="text-gray-500">SKS Total</p><p className="font-bold text-gray-900">{m.sks_total}</p></div>
                    <div>
                      <p className="text-gray-500">SKS MK Diulang</p>
                      <p className={`font-bold ${m.sks_mk_diulang > 0 ? 'text-red-700' : 'text-green-700'}`}>{m.sks_mk_diulang}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3 text-center">
                  <Link href={`/detail-mahasiswa?nim=${m.nim}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Lihat Detail &rarr;</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada mahasiswa ditemukan</h3>
            <p className="mt-1 text-sm text-gray-500">Coba ubah kriteria filter.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100">Sebelumnya</button>
            <span className="text-sm text-gray-600">Halaman {currentPage} dari {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100">Selanjutnya</button>
          </div>
        )}
      </main>
    </div>
  );
}
