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
}

const PROGRAMS = [
  { label: 'Informatika', value: 'Teknik Informatika' },
  { label: 'Arsitektur', value: 'Arsitektur' },
  { label: 'Pengairan', value: 'Teknik Pengairan' },
  { label: 'Sipil', value: 'Teknik Sipil' },
  { label: 'Elektro', value: 'Teknik Elektro' },
];

export default function DataLengkap() {
  const [activeTab, setActiveTab] = useState('Teknik Informatika');
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const encodedProdi = encodeURIComponent(activeTab);
        const response = await fetch(`http://localhost:8080/mahasiswa/prodi/${encodedProdi}`);
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
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <HomeIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Data Lengkap Mahasiswa</h1>
              <p className="text-sm text-blue-600">Berdasarkan Program Studi</p>
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {PROGRAMS.map((program) => (
              <button
                key={program.value}
                onClick={() => setActiveTab(program.value)}
                className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${
                  activeTab === program.value
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {program.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">No</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Nama</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">NIM</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">IPK</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">SKS Lulus</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">SKS Belum Lulus</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data untuk program studi ini
                    </td>
                  </tr>
                ) : (
                  data.map((mahasiswa, idx) => (
                    <tr key={mahasiswa.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.nama}</td>
                      <td className="px-6 py-4 text-gray-900">{mahasiswa.nim}</td>
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
                Total: <span className="font-semibold text-gray-900">{data.length}</span> mahasiswa
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
