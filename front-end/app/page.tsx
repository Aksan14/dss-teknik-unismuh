'use client';

import {
    AcademicCapIcon,
    ArrowRightIcon,
    ArrowTrendingUpIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ClipboardDocumentListIcon,
    GiftIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    StarIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell, Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis,
} from 'recharts';

interface Stats {
  total_mahasiswa: number;
  mahasiswa_aktif: number;
  mahasiswa_tidak_aktif: number;
  berprestasi: number;
  alumni: number;
  per_angkatan?: Record<string, number>;
  rata_rata_ipk?: number;
}

const STATUS_COLORS = ['#22c55e', '#ef4444', '#8b5cf6', '#f59e0b'];

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
        const response = await fetch('http://localhost:8080/api/v1/stats');
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

  // Data for pie chart - status distribution
  const statusData = useMemo(() => [
    { name: 'Aktif', value: stats?.mahasiswa_aktif ?? 0, color: '#22c55e' },
    { name: 'Tidak Aktif', value: stats?.mahasiswa_tidak_aktif ?? 0, color: '#ef4444' },
    { name: 'Alumni', value: stats?.alumni ?? 0, color: '#8b5cf6' },
  ], [stats]);

  // Data for bar chart - per angkatan
  const angkatanData = useMemo(() => {
    if (!stats?.per_angkatan) return [];
    return Object.entries(stats.per_angkatan)
      .map(([year, count]) => ({ angkatan: year, jumlah: count }))
      .sort((a, b) => a.angkatan.localeCompare(b.angkatan));
  }, [stats]);

  // Data for area chart - trend per angkatan (aktif ratio estimate)
  const trendData = useMemo(() => {
    if (!angkatanData.length) return [];
    const total = angkatanData.reduce((sum, d) => sum + d.jumlah, 0);
    return angkatanData.map(d => ({
      angkatan: d.angkatan,
      jumlah: d.jumlah,
      persentase: total > 0 ? Math.round((d.jumlah / total) * 100 * 10) / 10 : 0,
    }));
  }, [angkatanData]);

  // Data for kategori chart
  const kategoriData = useMemo(() => [
    { name: 'Berprestasi', value: stats?.berprestasi ?? 0, color: '#f59e0b' },
    { name: 'Normal', value: Math.max(0, (stats?.mahasiswa_aktif ?? 0) - (stats?.berprestasi ?? 0)), color: '#3b82f6' },
  ], [stats]);

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
      value: (stats?.total_mahasiswa ?? 0).toLocaleString(), 
      icon: UserGroupIcon,
      color: 'text-blue-900',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    { 
      label: 'Mahasiswa Aktif', 
      value: (stats?.mahasiswa_aktif ?? 0).toLocaleString(), 
      icon: AcademicCapIcon,
      color: 'text-green-900',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      link: '/mahasiswa-aktif'
    },
    { 
      label: 'Tidak Aktif', 
      value: (stats?.mahasiswa_tidak_aktif ?? 0).toLocaleString(), 
      icon: ClipboardDocumentListIcon,
      color: 'text-red-900',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      link: '/mahasiswa-tidak-aktif'
    },
    { 
      label: 'Berprestasi', 
      value: (stats?.berprestasi ?? 0).toLocaleString(), 
      icon: StarIcon,
      color: 'text-yellow-900',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    { 
      label: 'Alumni', 
      value: (stats?.alumni ?? 0).toLocaleString(), 
      icon: GiftIcon,
      color: 'text-purple-900',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm text-gray-600">
              {p.name}: <span className="font-bold text-blue-600">{p.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ipkPercentage = ((stats?.rata_rata_ipk ?? 0) / 4.0) * 100;

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
        <div className="bg-blue-900 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-blue-200 text-sm">Selamat datang di</p>
              <h2 className="text-3xl font-bold mt-1">SISTEM PELACAKAN MAHASISWA</h2>
              <p className="text-blue-200 mt-2">Universitas Muhammadiyah Makassar - Fakultas Teknik</p>
              {!loading && stats?.rata_rata_ipk && (
                <div className="mt-4 inline-flex items-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-300" />
                  <span className="text-sm">Rata-rata IPK: <span className="font-bold text-lg text-green-300">{stats.rata_rata_ipk.toFixed(2)}</span></span>
                </div>
              )}
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
          <h3 className="text-xl font-bold text-gray-900 mb-4">Statistik Ringkasan</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map((stat, idx) => {
              const content = (
                <div className={`bg-white rounded-xl shadow-md border ${stat.borderColor} p-5 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between group`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    {stat.link && (
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '-' : stat.value}</p>
                  </div>
                </div>
              );
              return stat.link ? (
                <Link key={idx} href={stat.link}>{content}</Link>
              ) : (
                <div key={idx}>{content}</div>
              );
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar Chart - Mahasiswa per Angkatan */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Distribusi Mahasiswa per Angkatan</h3>
                <p className="text-sm text-gray-500 mt-1">Jumlah mahasiswa berdasarkan tahun masuk</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Memuat grafik...</div>
              </div>
            ) : angkatanData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={angkatanData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="angkatan" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="jumlah" name="Jumlah" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400">Tidak ada data</div>
            )}
          </div>

          {/* Pie Chart - Status Distribution */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Status Mahasiswa</h3>
                <p className="text-sm text-gray-500 mt-1">Distribusi berdasarkan status</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Memuat grafik...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => <span className="text-sm text-gray-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Area Chart - Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tren Penerimaan Mahasiswa</h3>
                <p className="text-sm text-gray-500 mt-1">Perubahan jumlah mahasiswa tiap angkatan</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Memuat grafik...</div>
              </div>
            ) : trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="angkatan" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="jumlah" name="Jumlah" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.15} dot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400">Tidak ada data</div>
            )}
          </div>

          {/* IPK & Kategori Summary Card */}
          <div className="space-y-6">
            {/* IPK Gauge */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Rata-rata IPK</h3>
              <p className="text-sm text-gray-500 mb-4">Seluruh mahasiswa Fakultas Teknik</p>
              {loading ? (
                <div className="text-center py-6 text-gray-400 animate-pulse">Memuat...</div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#6366f1" strokeWidth="12"
                        strokeDasharray={`${ipkPercentage * 3.14} 314`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{(stats?.rata_rata_ipk ?? 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">dari skala 4.00</p>
                </div>
              )}
            </div>

            {/* Kategori Breakdown */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kategori Akademik</h3>
              {loading ? (
                <div className="text-center py-4 text-gray-400 animate-pulse">Memuat...</div>
              ) : (
                <div className="space-y-4">
                  {kategoriData.map((k, i) => {
                    const total = kategoriData.reduce((s, d) => s + d.value, 0);
                    const pct = total > 0 ? Math.round((k.value / total) * 100) : 0;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{k.name}</span>
                          <span className="text-gray-500">{k.value.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, backgroundColor: k.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${feature.color} ${feature.hoverColor} rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:scale-110 transition-transform`}>
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

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 Universitas Muhammadiyah Makassar. All rights reserved.</p>
          <p>Sistem Pelacakan Mahasiswa v.2.0 | Crafted with ❤️ by COCONUTLab</p>
        </div>
      </main>
    </div>
  );
}
