'use client';

import { useState, useEffect } from 'react';
import { UserIcon, AcademicCapIcon, CalendarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  ipk: number;
  kehadiran: number;
  sks_lulus: number;
  mk_mengulang: number;
  lama_studi: number;
  // Biodata tambahan
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  no_hp: string;
  email: string;
  jurusan: string;
  angkatan: number;
  semester: number;
  status: string;
}

export default function Biodata() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [filteredMahasiswa, setFilteredMahasiswa] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterMahasiswa();
  }, [mahasiswa, searchTerm, selectedJurusan, selectedStatus]);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8080/mahasiswa');
      const data = await res.json();
      setMahasiswa(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterMahasiswa = () => {
    let filtered = mahasiswa;

    // Filter berdasarkan search term (nama atau NIM)
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nim.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan jurusan
    if (selectedJurusan) {
      filtered = filtered.filter(m => m.jurusan === selectedJurusan);
    }

    // Filter berdasarkan status
    if (selectedStatus) {
      filtered = filtered.filter(m => m.status === selectedStatus);
    }

    setFilteredMahasiswa(filtered);
  };

  const uniqueJurusan = [...new Set(mahasiswa.map(m => m.jurusan))];
  const uniqueStatus = [...new Set(mahasiswa.map(m => m.status))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Biodata Mahasiswa</h1>
              <p className="text-sm text-blue-600">Informasi lengkap mahasiswa UNISMUH</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FunnelIcon className="h-6 w-6 text-blue-900" />
            <h2 className="text-xl font-bold text-blue-900">Filter Mahasiswa</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Cari nama atau NIM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-600 text-gray-700 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Jurusan Filter */}
            <div>
              <select
                value={selectedJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              >
                <option value="" className="text-gray-700">Semua Jurusan</option>
                {uniqueJurusan.map((jurusan) => (
                  <option key={jurusan} value={jurusan} className="text-gray-700">{jurusan}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              >
                <option value="" className="text-gray-700">Semua Status</option>
                {uniqueStatus.map((status) => (
                  <option key={status} value={status} className="text-gray-700">{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredMahasiswa.length} dari {mahasiswa.length} mahasiswa
            </p>
            {(searchTerm || selectedJurusan || selectedStatus) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedJurusan('');
                  setSelectedStatus('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Mahasiswa Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMahasiswa.map((m) => (
            <div key={m.id} className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Header Card */}
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

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Biodata Dasar */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tempat Lahir</p>
                      <p className="text-sm text-gray-600">{m.tempat_lahir}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tanggal Lahir</p>
                      <p className="text-sm text-gray-600">{m.tanggal_lahir}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Alamat</p>
                      <p className="text-sm text-gray-600">{m.alamat}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">No. HP</p>
                      <p className="text-sm text-gray-600">{m.no_hp}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{m.email}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AcademicCapIcon className="h-5 w-5 text-blue-900" />
                    <h4 className="text-sm font-semibold text-blue-900">Data Akademik</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Jurusan</p>
                      <p className="text-gray-600">{m.jurusan}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Angkatan</p>
                      <p className="text-gray-600">{m.angkatan}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Semester</p>
                      <p className="text-gray-600">{m.semester}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Status</p>
                      <p className="text-gray-600">{m.status}</p>
                    </div>
                  </div>
                </div>

                {/* Prestasi Akademik */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Prestasi Akademik</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">IPK</p>
                      <p className="text-gray-600">{m.ipk}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Kehadiran</p>
                      <p className="text-gray-600">{m.kehadiran}%</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">SKS Lulus</p>
                      <p className="text-gray-600">{m.sks_lulus}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">MK Mengulang</p>
                      <p className="text-gray-600">{m.mk_mengulang}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="font-medium text-gray-900 text-sm">Lama Studi</p>
                    <p className="text-gray-600 text-sm">{m.lama_studi} semester</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMahasiswa.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada mahasiswa ditemukan</h3>
            <p className="mt-1 text-sm text-gray-500">
              Coba ubah kriteria filter atau reset filter untuk melihat semua mahasiswa.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}