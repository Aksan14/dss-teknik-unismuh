'use client';

import {
  HomeIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

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
const ANGKATAN_OPTIONS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

export default function DataLengkap() {
  const [selectedAngkatan, setSelectedAngkatan] = useState<number | null>(null);
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const totalPages = Math.ceil(totalData / PER_PAGE);

  const fetchData = useCallback(async (page: number, angkatan: number | null) => {
    setLoading(true);
    try {
      const offset = (page - 1) * PER_PAGE;
      let url = `http://localhost:8080/api/v1/mahasiswa?limit=${PER_PAGE}&offset=${offset}`;
      if (angkatan) {
        url = `http://localhost:8080/api/v1/mahasiswa/angkatan/${angkatan}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.data) {
        setData(result.data || []);
        setTotalData(result.pagination?.total || result.total || result.data.length);
      } else if (Array.isArray(result)) {
        setData(result || []);
        setTotalData(result.length);
      } else {
        setData([]);
        setTotalData(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, selectedAngkatan);
  }, [currentPage, selectedAngkatan, fetchData]);

  // Reset to page 1 when angkatan changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAngkatan]);

  // Filter data by search (client-side for current page)
  const filteredData = search
    ? data.filter(m => 
        m.nama.toLowerCase().includes(search.toLowerCase()) ||
        m.nim.includes(search)
      )
    : data;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <HomeIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Data Lengkap Mahasiswa</h1>
              <p className="text-sm text-blue-600">Teknik Informatika - UNISMUH</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-900 mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali ke Dashboard
        </Link>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Mahasiswa (halaman ini)</label>
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau NIM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter Angkatan</label>
              <select
                value={selectedAngkatan || ''}
                onChange={(e) => setSelectedAngkatan(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Semua Angkatan</option>
                {ANGKATAN_OPTIONS.map((angkatan) => (
                  <option key={angkatan} value={angkatan}>{angkatan}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <p className="text-blue-900 font-semibold">
              Total Mahasiswa: <span className="text-2xl text-blue-600">{loading ? '-' : totalData.toLocaleString()}</span>
            </p>
            <p className="text-blue-700">
              Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages || 1}</span>
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">No</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Nama</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">NIM</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Angkatan</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">IPK</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">SKS Lulus</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">SKS Diambil</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">MK Lulus</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">MK Diulang</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">SKS MK Diulang</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Kategori</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                      {search ? 'Tidak ada data yang cocok' : 'Tidak ada data mahasiswa'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((mahasiswa, idx) => (
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
                          mahasiswa.ipk >= 3.5 ? 'bg-green-100 text-green-800' :
                          mahasiswa.ipk >= 3.0 ? 'bg-blue-100 text-blue-800' :
                          mahasiswa.ipk >= 2.5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
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
                          mahasiswa.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                          mahasiswa.status === 'Alumni' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {mahasiswa.status}
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

          {/* Pagination */}
          {!selectedAngkatan && totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Menampilkan <span className="font-semibold">{(currentPage - 1) * PER_PAGE + 1}</span> - <span className="font-semibold">{Math.min(currentPage * PER_PAGE, totalData)}</span> dari <span className="font-semibold">{totalData.toLocaleString()}</span> mahasiswa
                </p>
                
                <div className="flex items-center gap-1">
                  {/* First Page */}
                  <button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1 || loading}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Halaman Pertama"
                  >
                    <ChevronDoubleLeftIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Prev Page */}
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || loading}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Page Numbers */}
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                      className={`px-3 py-1 rounded-lg border ${
                        page === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-100'
                      } disabled:opacity-50`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  {/* Next Page */}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || loading}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Halaman Berikutnya"
                  >
                    <ChevronLeftIcon className="h-4 w-4 rotate-180" />
                  </button>
                  
                  {/* Last Page */}
                  <button
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages || loading}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Halaman Terakhir"
                  >
                    <ChevronDoubleRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Summary for filtered angkatan */}
          {selectedAngkatan && filteredData.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Menampilkan: <span className="font-semibold text-gray-900">{filteredData.length}</span> mahasiswa angkatan {selectedAngkatan}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
