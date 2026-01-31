'use client';

import {
  AcademicCapIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  StarIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  total_mahasiswa: number;
  mahasiswa_aktif: number;
  mahasiswa_tidak_aktif: number;
  berprestasi: number;
  alumni: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total_mahasiswa: 0,
    mahasiswa_aktif: 0,
    mahasiswa_tidak_aktif: 0,
    berprestasi: 0,
    alumni: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8080/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const features = [
    {
      icon: ClipboardDocumentListIcon,
      title: 'Data Lengkap',
      description: 'Lihat data lengkap mahasiswa berdasarkan program studi dengan informasi akademik detail.',
      href: '/data-lengkap',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      icon: CalendarDaysIcon,
      title: 'Data Perangkatan',
      description: 'Lihat statistik dan analisis mahasiswa berdasarkan tahun angkatan.',
      href: '/data-perangkatan',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Data Alumni',
      description: 'Lihat data alumni dan lulusan dari berbagai tahun angkatan.',
      href: '/data-alumni',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      icon: StarIcon,
      title: 'Prestasi Mahasiswa',
      description: 'Lihat prestasi dan pencapaian mahasiswa dari berbagai bidang.',
      href: '/prestasi-mahasiswa',
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600'
    },
    {
      icon: GiftIcon,
      title: 'Penerima Beasiswa',
      description: 'Lihat data mahasiswa penerima beasiswa dan informasi beasiswa mereka.',
      href: '/penerima-beasiswa',
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600'
    },
  ];

  const statCards = [
    { 
      label: 'Total Mahasiswa', 
      value: stats.total_mahasiswa.toString(), 
      icon: UserGroupIcon,
      color: 'text-blue-900',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    { 
      label: 'Mahasiswa Aktif', 
      value: stats.mahasiswa_aktif.toString(), 
      icon: AcademicCapIcon,
      color: 'text-green-900',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      link: '/fitur-utama/mahasiswa-aktif'
    },
    { 
      label: 'Mahasiswa Tidak Aktif', 
      value: stats.mahasiswa_tidak_aktif.toString(), 
      icon: ClipboardDocumentListIcon,
      color: 'text-red-900',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      link: '/fitur-utama/mahasiswa-tidak-aktif'
    },
    { 
      label: 'Prestasi', 
      value: stats.berprestasi.toString(), 
      icon: StarIcon,
      color: 'text-yellow-900',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    { 
      label: 'Alumni', 
      value: stats.alumni.toString(), 
      icon: GiftIcon,
      color: 'text-purple-900',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <HomeIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
              <p className="text-sm text-blue-600">Sistem Pelacakan Mahasiswa UNISMUH</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-blue-200 text-sm">Selamat datang di</p>
              <h2 className="text-3xl font-bold mt-1">SISTEM PELACAKAN MAHASISWA</h2>
              <p className="text-blue-200 mt-2">Sistem Pelacakan Mahasiswa Universitas Muhammadiyah Makassar</p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                href="/cari-mahasiswa"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Cari Data Mahasiswa
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Statistik</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map((stat, idx) => (
              <div key={idx} className="h-full">
                {stat.link ? (
                  <Link href={stat.link}>
                    <div className={`bg-white rounded-xl shadow-md border ${stat.borderColor} p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col justify-between`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                          <stat.icon className={`h-7 w-7 ${stat.color}`} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                        <p className="text-4xl font-bold text-gray-900 mt-2">{loading ? '-' : stat.value}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-blue-600 font-semibold hover:text-blue-700">Lihat Detail →</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className={`bg-white rounded-xl shadow-md border ${stat.borderColor} p-6 h-full flex flex-col justify-between`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`h-7 w-7 ${stat.color}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                      <p className="text-4xl font-bold text-gray-900 mt-2">{loading ? '-' : stat.value}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Fitur Utama</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow group"
              >
                <div className={`w-14 h-14 ${feature.color} ${feature.hoverColor} rounded-xl flex items-center justify-center mb-4 transition-colors`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm mt-2">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium mt-4">
                  Mulai
                  <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AcademicCapIcon className="h-6 w-6 text-blue-900" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-blue-900">Cara Menggunakan Sistem</h4>
              <ol className="mt-3 space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">1</span>
                  Klik pada salah satu fitur utama atau menu di sidebar untuk melihat data
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">2</span>
                  Gunakan filter dan pencarian untuk menemukan data yang diinginkan
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">3</span>
                  Klik pada statistik untuk melihat detail lebih lanjut
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">4</span>
                  Gunakan fitur pencarian mahasiswa untuk informasi individual
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2026 Universitas Muhammadiyah Makassar. All rights reserved.</p>
          <p>Sistem Pelacakan Mahasiswa v.2.0 | Crafted with ❤️ by COCONUTLab</p>
        </div>
      </main>
    </div>
  );
}
