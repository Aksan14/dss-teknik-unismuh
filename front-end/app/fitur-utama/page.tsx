'use client';

import {
  HomeIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  StarIcon,
  GiftIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Feature {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  borderColor: string;
}

const features: Feature[] = [
  {
    name: 'Data Lengkap',
    href: '/fitur-utama/data-lengkap',
    icon: <DocumentTextIcon className="h-8 w-8" />,
    description: 'Lihat data lengkap mahasiswa per program studi',
    color: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200',
  },
  {
    name: 'Data Perangkatan',
    href: '/fitur-utama/data-perangkatan',
    icon: <CalendarDaysIcon className="h-8 w-8" />,
    description: 'Lihat data mahasiswa berdasarkan tahun angkatan',
    color: 'bg-purple-50 hover:bg-purple-100',
    borderColor: 'border-purple-200',
  },
  {
    name: 'Data Alumni',
    href: '/fitur-utama/data-alumni',
    icon: <AcademicCapIcon className="h-8 w-8" />,
    description: 'Lihat data alumni yang telah lulus',
    color: 'bg-indigo-50 hover:bg-indigo-100',
    borderColor: 'border-indigo-200',
  },
  {
    name: 'Prestasi Mahasiswa',
    href: '/fitur-utama/prestasi-mahasiswa',
    icon: <StarIcon className="h-8 w-8" />,
    description: 'Lihat mahasiswa dengan prestasi terbaik',
    color: 'bg-yellow-50 hover:bg-yellow-100',
    borderColor: 'border-yellow-200',
  },
  {
    name: 'Penerima Beasiswa',
    href: '/fitur-utama/penerima-beasiswa',
    icon: <GiftIcon className="h-8 w-8" />,
    description: 'Lihat mahasiswa penerima beasiswa',
    color: 'bg-red-50 hover:bg-red-100',
    borderColor: 'border-red-200',
  },
  {
    name: 'Mahasiswa Aktif',
    href: '/fitur-utama/mahasiswa-aktif',
    icon: <UserGroupIcon className="h-8 w-8" />,
    description: 'Lihat data mahasiswa yang sedang aktif kuliah',
    color: 'bg-green-50 hover:bg-green-100',
    borderColor: 'border-green-200',
  },
  {
    name: 'Mahasiswa Tidak Aktif',
    href: '/fitur-utama/mahasiswa-tidak-aktif',
    icon: <ChartBarIcon className="h-8 w-8" />,
    description: 'Lihat data mahasiswa yang tidak aktif',
    color: 'bg-orange-50 hover:bg-orange-100',
    borderColor: 'border-orange-200',
  },
];

export default function FiturUtama() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HomeIcon className="h-8 w-8 text-blue-900" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Fitur Utama Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Akses semua fitur analisis dan laporan data mahasiswa</p>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.name} href={feature.href}>
              <div
                className={`${feature.color} border-2 ${feature.borderColor} rounded-lg p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg h-full`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-shrink-0 text-blue-900">{feature.icon}</div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-900">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tentang Fitur Utama</h2>
          <p className="text-gray-700 mb-3">
            Fitur Utama menyediakan akses cepat ke berbagai laporan dan analisis data mahasiswa. Setiap fitur dirancang untuk membantu Anda dalam menganalisis dan memantau status akademik mahasiswa dari berbagai perspektif.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Lihat data mahasiswa berdasarkan program studi atau tahun angkatan</li>
            <li>Monitor prestasi akademik dan beasiswa mahasiswa</li>
            <li>Analisis status keaktifan mahasiswa</li>
            <li>Pantau data alumni yang telah lulus</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
