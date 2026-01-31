'use client';

import {
    AcademicCapIcon,
    ArrowLeftIcon,
    BookOpenIcon,
    BuildingLibraryIcon,
    CalendarIcon,
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon,
    StarIcon,
    TrophyIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMahasiswa } from '../../context/MahasiswaContext';

export default function BiodataMahasiswaPage() {
  const { mahasiswaData, resetData } = useMahasiswa();
  const router = useRouter();

  // Redirect jika tidak ada data
  if (!mahasiswaData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Data Mahasiswa</h2>
          <p className="text-gray-600 mb-6">Silakan cari mahasiswa terlebih dahulu untuk melihat biodata.</p>
          <Link
            href="/cari-mahasiswa"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Cari Mahasiswa
          </Link>
        </div>
      </div>
    );
  }

  const formatTanggal = (tanggal: string) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-8 w-8 text-blue-900" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Biodata Mahasiswa</h1>
                <p className="text-sm text-blue-600">Data pribadi dan akademik lengkap</p>
              </div>
            </div>
            <Link
              href="/hasil-pencarian"
              className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Lihat Analisis
              <ArrowLeftIcon className="h-5 w-5 ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-full">
              <UserIcon className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{mahasiswaData.nama}</h2>
              <p className="text-blue-100">NIM: {mahasiswaData.nim}</p>
              <p className="text-blue-100">{mahasiswaData.jurusan} - {mahasiswaData.fakultas}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Biodata Pribadi */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-900 px-6 py-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Biodata Pribadi</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start space-x-3">
                <UserIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-semibold text-gray-900">{mahasiswaData.nama}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AcademicCapIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">NIM</p>
                  <p className="font-semibold text-gray-900">{mahasiswaData.nim}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Tempat, Tanggal Lahir</p>
                  <p className="font-semibold text-gray-900">
                    {mahasiswaData.tempat_lahir}, {formatTanggal(mahasiswaData.tanggal_lahir)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="font-semibold text-gray-900">{mahasiswaData.alamat}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <PhoneIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">No. HP</p>
                  <p className="font-semibold text-gray-900">{mahasiswaData.no_hp}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{mahasiswaData.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Akademik */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-900 px-6 py-4">
              <div className="flex items-center space-x-3">
                <AcademicCapIcon className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Data Akademik</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start space-x-3">
                <BuildingLibraryIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Fakultas</p>
                  <p className="font-semibold text-gray-900">{mahasiswaData.fakultas}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BookOpenIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Jurusan/Program Studi</p>
                  <p className="font-semibold text-gray-900">{mahasiswaData.jurusan}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Angkatan</p>
                    <p className="font-semibold text-gray-900">{mahasiswaData.angkatan}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpenIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Semester Aktif</p>
                    <p className="font-semibold text-gray-900">{mahasiswaData.semester}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <UserIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Dosen Pembimbing Akademik</p>
                  <p className="font-semibold text-gray-900">{mahasiswaData.dosen_pa}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Status Mahasiswa</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  mahasiswaData.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {mahasiswaData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Beasiswa & Organisasi */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-900 px-6 py-4">
              <div className="flex items-center space-x-3">
                <StarIcon className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Beasiswa & Organisasi</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500 mb-2">Beasiswa</p>
                {mahasiswaData.beasiswa ? (
                  <div className="flex items-center space-x-2">
                    <TrophyIcon className="h-5 w-5 text-yellow-500" />
                    <p className="font-semibold text-gray-900">{mahasiswaData.beasiswa}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Tidak menerima beasiswa</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Organisasi yang Diikuti</p>
                {mahasiswaData.organisasi.length > 0 ? (
                  <ul className="space-y-2">
                    {mahasiswaData.organisasi.map((org, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        <span className="font-medium text-gray-900">{org}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Tidak mengikuti organisasi</p>
                )}
              </div>
            </div>
          </div>

          {/* Prestasi */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-900 px-6 py-4">
              <div className="flex items-center space-x-3">
                <TrophyIcon className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Prestasi</h3>
              </div>
            </div>
            <div className="p-6">
              {mahasiswaData.prestasi.length > 0 ? (
                <ul className="space-y-3">
                  {mahasiswaData.prestasi.map((prestasi, idx) => (
                    <li key={idx} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <TrophyIcon className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                      <span className="font-medium text-gray-900">{prestasi}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <TrophyIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 italic">Belum ada prestasi tercatat</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
