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
  angkatan: number;
  kipk: number;
  beasiswa: string;
  beasiswa_luar: string;
}

type FilterType = 'kipk' | 'beasiswa_luar';

export default function PenerimaBeasiswa() {
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('kipk');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/mahasiswa/beasiswa');
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

  const filteredData = data.filter(mahasiswa => {
    const matchesSearch = mahasiswa.nama.toLowerCase().includes(search.toLowerCase()) ||
      mahasiswa.nim.includes(search);
    
    if (filter === 'kipk') {
      return matchesSearch && mahasiswa.kipk > 0;
    } else {
      return matchesSearch && mahasiswa.beasiswa_luar && mahasiswa.beasiswa_luar !== 'Tidak Ada';
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-pink-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <HomeIcon className="h-8 w-8 text-pink-900" />
            <div>
              <h1 className="text-2xl font-bold text-pink-900">Penerima Beasiswa</h1>
              <p className="text-sm text-pink-600">Data mahasiswa penerima beasiswa</p>
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

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setFilter('kipk')}
              className={`px-6 py-4 font-semibold text-sm transition-colors ${
                filter === 'kipk'
                  ? 'border-b-2 border-pink-600 text-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              KIPK (Kompetisi IP Kelas)
            </button>
            <button
              onClick={() => setFilter('beasiswa_luar')}
              className={`px-6 py-4 font-semibold text-sm transition-colors ${
                filter === 'beasiswa_luar'
                  ? 'border-b-2 border-pink-600 text-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Beasiswa Luar
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau NIM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
          />
        </div>

        {/* Stats Card */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg shadow-md p-6 mb-8">
          <p className="text-pink-900 font-semibold">
            Total: <span className="text-2xl text-pink-600">{loading ? '-' : filteredData.length}</span> mahasiswa
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-pink-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-pink-900">No</th>
                  <th className="px-6 py-4 text-left font-semibold text-pink-900">Nama</th>
                  <th className="px-6 py-4 text-left font-semibold text-pink-900">NIM</th>
                  <th className="px-6 py-4 text-left font-semibold text-pink-900">Jurusan</th>
                  <th className="px-6 py-4 text-left font-semibold text-pink-900">Angkatan</th>
                  {filter === 'kipk' ? (
                    <th className="px-6 py-4 text-left font-semibold text-pink-900">KIPK</th>
                  ) : (
                    <th className="px-6 py-4 text-left font-semibold text-pink-900">Beasiswa Luar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      {search ? 'Tidak ada data yang cocok' : 'Tidak ada mahasiswa'}
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
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.angkatan}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                          {filter === 'kipk' ? mahasiswa.kipk.toFixed(2) : mahasiswa.beasiswa_luar}
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
