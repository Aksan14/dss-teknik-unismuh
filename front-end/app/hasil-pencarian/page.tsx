'use client';

import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

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
  jurusan: string;
  jurusan: string;
}

const PER_PAGE = 30;

export default function HasilPencarianPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div></div>}>
      <HasilPencarian />
    </Suspense>
  );
}

function HasilPencarian() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [allData, setAllData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/mahasiswa/search?q=${encodeURIComponent(query)}`);
      const result = await res.json();
      setAllData(result.data || []);
    } catch (error) {
      console.error('Error:', error);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(allData.length / PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return allData.slice(start, start + PER_PAGE);
  }, [allData, currentPage]);

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
            <MagnifyingGlassIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Hasil Pencarian</h1>
              <p className="text-sm text-blue-600">Menampilkan hasil untuk: &quot;{query}&quot;</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-900 mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-1" /> Kembali ke Dashboard
        </Link>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-900">Ditemukan <span className="font-bold text-2xl">{allData.length}</span> mahasiswa untuk pencarian &quot;{query}&quot;</p>
        </div>

        {allData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-12 text-center">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada hasil</h3>
            <p className="text-gray-500">Coba gunakan kata kunci lain atau periksa ejaan.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">No</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">Nama</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">NIM</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">Angkatan</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">Jurusan</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">IPK</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">SKS Lulus</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">SKS Diambil</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">MK Lulus</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">MK Diulang</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">SKS MK Diulang</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((m, idx) => (
                    <tr key={m.nim} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                      <td className="px-4 py-3 font-medium">{m.nama}</td>
                      <td className="px-4 py-3">{m.nim}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{m.angkatan}</span></td>
                      <td className="px-4 py-3 text-xs">{m.jurusan}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(m.ipk||0) >= 3.5 ? 'bg-green-100 text-green-800' : (m.ipk||0) >= 3.0 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{(m.ipk||0).toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">{m.sks_lulus}</td>
                      <td className="px-4 py-3">{m.sks_diambil}</td>
                      <td className="px-4 py-3">{m.matakuliah_lulus}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.jumlah_mk_diulang > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{m.jumlah_mk_diulang}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.sks_mk_diulang > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{m.sks_mk_diulang}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.status === 'Aktif' ? 'bg-green-100 text-green-800' : m.status === 'Alumni' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'}`}>{m.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/detail-mahasiswa?nim=${m.nim}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Detail</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100">Sebelumnya</button>
            <span className="text-sm text-gray-600">Halaman {currentPage} dari {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100">Selanjutnya</button>
          </div>
        )}
      </main>
    </div>
  );
}
