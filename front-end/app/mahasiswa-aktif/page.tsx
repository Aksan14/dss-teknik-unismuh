'use client';

import {
  HomeIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState, useCallback, useMemo } from 'react';

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

export default function MahasiswaAktif() {
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [allData, setAllData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/mahasiswa/aktif');
      const result = await response.json();
      setAllData(result.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data by search
  const filteredData = useMemo(() => search
    ? allData.filter(m => 
        m.nama.toLowerCase().includes(search.toLowerCase()) ||
        m.nim.includes(search)
      )
    : allData, [search, allData]);

  const totalPages = Math.ceil(filteredData.length / PER_PAGE);

  // Paginate filtered data
  useEffect(() => {
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    setData(filteredData.slice(start, end));
  }, [filteredData, currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md border-b border-green-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <HomeIcon className="h-8 w-8 text-green-900" />
            <div>
              <h1 className="text-2xl font-bold text-green-900">Mahasiswa Aktif</h1>
              <p className="text-sm text-green-600">Data mahasiswa yang sedang aktif</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-900 mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali ke Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau NIM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <p className="text-green-900 font-semibold">
              Total Mahasiswa Aktif: <span className="text-2xl text-green-600">{loading ? '-' : filteredData.length.toLocaleString()}</span>
            </p>
            {totalPages > 1 && (
              <p className="text-green-700">
                Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-green-900">No</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">Nama</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">NIM</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">Angkatan</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">IPK</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">SKS Lulus</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">SKS Diambil</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">MK Lulus</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">MK Diulang</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">SKS MK Diulang</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">Kategori</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-8 text-center text-gray-500">Loading data...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                      {search ? 'Tidak ada data yang cocok' : 'Tidak ada mahasiswa aktif'}
                    </td>
                  </tr>
                ) : (
                  data.map((mahasiswa, idx) => (
                    <tr key={mahasiswa.nim} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{mahasiswa.nama}</td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.nim}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {mahasiswa.angkatan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (mahasiswa.ipk || 0) >= 3.5 ? 'bg-green-100 text-green-800' :
                          (mahasiswa.ipk || 0) >= 3.0 ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {(mahasiswa.ipk || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.sks_lulus}</td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.sks_diambil}</td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.matakuliah_lulus}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mahasiswa.jumlah_mk_diulang > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {mahasiswa.jumlah_mk_diulang}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mahasiswa.sks_mk_diulang > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {mahasiswa.sks_mk_diulang}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          mahasiswa.kategori === 'Berprestasi' ? 'bg-yellow-100 text-yellow-800' :
                          mahasiswa.kategori === 'Normal' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {mahasiswa.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/detail-mahasiswa?nim=${mahasiswa.nim}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Detail</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Menampilkan <span className="font-semibold">{(currentPage - 1) * PER_PAGE + 1}</span> - <span className="font-semibold">{Math.min(currentPage * PER_PAGE, filteredData.length)}</span> dari <span className="font-semibold">{filteredData.length.toLocaleString()}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || loading} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronDoubleLeftIcon className="h-4 w-4" />
                  </button>
                  <button onClick={handlePrevPage} disabled={currentPage === 1 || loading} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  {getPageNumbers().map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)} disabled={loading} className={`px-3 py-1 rounded-lg border ${page === currentPage ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 hover:bg-gray-100'} disabled:opacity-50`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={handleNextPage} disabled={currentPage === totalPages || loading} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeftIcon className="h-4 w-4 rotate-180" />
                  </button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || loading} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronDoubleRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
