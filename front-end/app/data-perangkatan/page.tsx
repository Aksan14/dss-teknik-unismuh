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
}

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

export default function DataPerangkatan() {
  const [activeYear, setActiveYear] = useState(2022);
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/mahasiswa/angkatan/${activeYear}`);
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
  }, [activeYear]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <HomeIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Data Perangkatan Mahasiswa</h1>
              <p className="text-sm text-blue-600">Berdasarkan Tahun Angkatan</p>
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

        {/* Year Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilih Tahun Angkatan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeYear === year
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year}
              </button>
            ))}
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
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Jurusan</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data untuk tahun angkatan {activeYear}
                    </td>
                  </tr>
                ) : (
                  data.map((mahasiswa, idx) => (
                    <tr key={mahasiswa.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.nama}</td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.nim}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {mahasiswa.jurusan}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {data.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total: <span className="font-semibold text-gray-900">{data.length}</span> mahasiswa (Angkatan {activeYear})
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
