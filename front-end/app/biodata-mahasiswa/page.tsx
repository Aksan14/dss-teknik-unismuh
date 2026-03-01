'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { UserIcon, AcademicCapIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

export default function BiodataMahasiswaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div></div>}>
      <BiodataMahasiswa />
    </Suspense>
  );
}

function BiodataMahasiswa() {
  const searchParams = useSearchParams();
  const nim = searchParams.get('nim');
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!nim) { setError('NIM tidak ditemukan'); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/mahasiswa/${nim}`);
      if (!res.ok) throw new Error('Data tidak ditemukan');
      const result = await res.json();
      setMahasiswa(result.data || result);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat data mahasiswa');
    } finally {
      setLoading(false);
    }
  }, [nim]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !mahasiswa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error || 'Data tidak ditemukan'}</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">Kembali</Link>
        </div>
      </div>
    );
  }

  const m = mahasiswa;
  const rasioUlang = m.sks_diambil > 0 ? ((m.sks_mk_diulang / m.sks_diambil) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Biodata Mahasiswa</h1>
              <p className="text-sm text-blue-600">Detail informasi akademik</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-3 sm:px-5 lg:px-6 py-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-900 mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-1" /> Kembali
        </Link>

        <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
          <div className="bg-blue-900 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{m.nama}</h2>
                <p className="text-blue-200">{m.nim}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-600">Angkatan</p>
                <p className="text-2xl font-bold text-blue-900">{m.angkatan}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600">IPK</p>
                <p className="text-2xl font-bold text-green-900">{(m.ipk || 0).toFixed(2)}</p>
              </div>
              <div className="rounded-lg p-4 text-center" style={{backgroundColor: m.status === 'Aktif' ? '#f0fdf4' : m.status === 'Alumni' ? '#faf5ff' : '#fef2f2'}}>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-bold">{m.status}</p>
              </div>
              <div className="rounded-lg p-4 text-center" style={{backgroundColor: m.kategori === 'Berprestasi' ? '#f0fdf4' : m.kategori === 'Normal' ? '#eff6ff' : '#fef2f2'}}>
                <p className="text-sm text-gray-600">Kategori</p>
                <p className="text-lg font-bold">{m.kategori}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <AcademicCapIcon className="h-6 w-6 text-blue-900" />
                <h3 className="text-lg font-bold text-blue-900">Data Akademik</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">SKS Total</p>
                  <p className="text-xl font-bold text-gray-900">{m.sks_total}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">SKS Diambil</p>
                  <p className="text-xl font-bold text-gray-900">{m.sks_diambil}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">SKS Lulus</p>
                  <p className="text-xl font-bold text-gray-900">{m.sks_lulus}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Matakuliah Lulus</p>
                  <p className="text-xl font-bold text-gray-900">{m.matakuliah_lulus}</p>
                </div>
                <div className={`rounded-lg p-4 ${m.jumlah_mk_diulang > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-sm text-gray-500">MK Diulang</p>
                  <p className={`text-xl font-bold ${m.jumlah_mk_diulang > 0 ? 'text-red-700' : 'text-green-700'}`}>{m.jumlah_mk_diulang}</p>
                </div>
                <div className={`rounded-lg p-4 ${m.sks_mk_diulang > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-sm text-gray-500">SKS MK Diulang</p>
                  <p className={`text-xl font-bold ${m.sks_mk_diulang > 0 ? 'text-red-700' : 'text-green-700'}`}>{m.sks_mk_diulang}</p>
                </div>
              </div>
            </div>

            {m.jumlah_mk_diulang > 0 && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">Perhatian: Mahasiswa Memiliki MK Diulang</h4>
                <p className="text-sm text-red-700">Rasio SKS MK Diulang terhadap SKS Diambil: <span className="font-bold">{rasioUlang}%</span></p>
                <p className="text-sm text-red-700 mt-1">Jumlah MK diulang: <span className="font-bold">{m.jumlah_mk_diulang}</span> | SKS MK diulang: <span className="font-bold">{m.sks_mk_diulang}</span></p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
