'use client';

import {
  HomeIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  jurusan: string;
  ipk: number;
  sks_lulus: number;
  sks_belum_lulus: number;
  status: string;
  keterangan: string;
}

export default function MahasiswaTidakAktif() {
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/mahasiswa/tidak-aktif');
        const result = await response.json();
        setData(result || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(mahasiswa => 
    mahasiswa.nama.toLowerCase().includes(search.toLowerCase()) ||
    mahasiswa.nim.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-red-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <HomeIcon className="h-8 w-8 text-red-900" />
            <div>
              <h1 className="text-2xl font-bold text-red-900">Mahasiswa Tidak Aktif</h1>
              <p className="text-sm text-red-600">Data mahasiswa yang tidak sedang aktif</p>
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

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau NIM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>

        {/* Stats Card */}
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-6 mb-8">
          <p className="text-red-900 font-semibold">
            Total Mahasiswa Tidak Aktif: <span className="text-2xl text-red-600">{loading ? '-' : data.length}</span>
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-red-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-red-900">No</th>
                  <th className="px-6 py-4 text-left font-semibold text-red-900">Nama</th>
                  <th className="px-6 py-4 text-left font-semibold text-red-900">NIM</th>
                  <th className="px-6 py-4 text-left font-semibold text-red-900">Jurusan</th>
                  <th className="px-6 py-4 text-left font-semibold text-red-900">IPK</th>
                  <th className="px-6 py-4 text-left font-semibold text-red-900">SKS Lulus</th>
                  <th className="px-6 py-4 text-left font-semibold text-red-900">SKS Belum Lulus</th>
                  <th className="px-6 py-4 text-left font-semibold text-red-900">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      {search ? 'Tidak ada data yang cocok' : 'Tidak ada mahasiswa tidak aktif'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((mahasiswa, idx) => (
                    <tr key={mahasiswa.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{mahasiswa.nama}</td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.nim}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {mahasiswa.jurusan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          mahasiswa.ipk >= 3.5 ? 'bg-green-100 text-green-800' :
                          mahasiswa.ipk >= 3.0 ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {mahasiswa.ipk.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.sks_lulus}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          mahasiswa.sks_belum_lulus === 0 ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {mahasiswa.sks_belum_lulus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          {mahasiswa.keterangan || 'Cuti'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {filteredData.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Menampilkan: <span className="font-semibold text-gray-900">{filteredData.length}</span> dari {data.length} mahasiswa
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
