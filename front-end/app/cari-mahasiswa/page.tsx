'use client';

import {
    AcademicCapIcon,
    DocumentCheckIcon,
    ExclamationCircleIcon,
    IdentificationIcon,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMahasiswa } from '../../context/MahasiswaContext';

export default function CariMahasiswaPage() {
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [localError, setLocalError] = useState('');
  const { cariMahasiswa, isLoading, error } = useMahasiswa();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validasi input
    if (!nim.trim()) {
      setLocalError('NIM mahasiswa wajib diisi');
      return;
    }

    // Redirect ke detail page dengan NIM
    router.push(`/detail-mahasiswa?nim=${encodeURIComponent(nim.trim())}`);
  };

  const handleLihatAnalisis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validasi input
    if (!nama.trim() || !nim.trim()) {
      setLocalError('Nama dan NIM mahasiswa wajib diisi untuk analisis');
      return;
    }

    // Cari mahasiswa untuk analisis
    const found = await cariMahasiswa(nama, nim);
    
    if (found) {
      router.push('/analisis-mahasiswa');
    }
  };

  // Data contoh mahasiswa
  const contohMahasiswa = [
    { nim: '105841100420', nama: 'Ahmad Fauzi Rahman' },
    { nim: '105841100421', nama: 'Siti Nurhaliza' },
    { nim: '105841100422', nama: 'Muhammad Rizky Pratama' },
  ];

  const pilihContoh = (nim: string, nama: string) => {
    setNim(nim);
    setNama(nama);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <MagnifyingGlassIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Cari Data Mahasiswa</h1>
              <p className="text-sm text-blue-600">Masukkan NIM dan Nama Mahasiswa</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start space-x-3">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Petunjuk Pencarian</h3>
            <p className="text-sm text-blue-700 mt-1">
              Masukkan NIM mahasiswa untuk:
            </p>
            <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
              <li><strong>Lihat Detail Lengkap</strong> - Semua informasi biodata, akademik, dan keuangan</li>
              <li><strong>Lihat Analisis Status</strong> - Analisis performa akademik dan rekomendasi (memerlukan nama dan NIM)</li>
            </ul>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <UserIcon className="h-8 w-8 text-blue-900" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Pencarian Mahasiswa</h2>
            <p className="text-gray-600 text-sm mt-1">
              Masukkan data mahasiswa yang ingin dilihat
            </p>
          </div>

          {/* Error Messages */}
          {(localError || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{localError || error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NIM Input */}
            <div>
              <label htmlFor="nim" className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Induk Mahasiswa (NIM)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IdentificationIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nim"
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Contoh: 105841100420"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Nama Input */}
            <div>
              <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Mahasiswa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama mahasiswa"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Membuka Data...
                  </>
                ) : (
                  <>
                    <DocumentCheckIcon className="h-5 w-5 mr-2" />
                    Lihat Detail Lengkap
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleLihatAnalisis}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-4 bg-green-900 text-white font-semibold rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <AcademicCapIcon className="h-5 w-5 mr-2" />
                    Lihat Analisis Status
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Contoh Mahasiswa */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Data Mahasiswa Tersedia (Klik untuk mengisi):</p>
            <div className="grid grid-cols-1 gap-2">
              {contohMahasiswa.map((m) => (
                <button
                  key={m.nim}
                  onClick={() => pilihContoh(m.nim, m.nama)}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-gray-900">{m.nama}</p>
                    <p className="text-sm text-gray-600">NIM: {m.nim}</p>
                  </div>
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
