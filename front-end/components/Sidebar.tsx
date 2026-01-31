'use client';

import {
  ChartBarIcon,
  DocumentTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  StarIcon,
  GiftIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Cari Mahasiswa', href: '/cari-mahasiswa', icon: MagnifyingGlassIcon },
  { name: 'Pencarian & Analisis', href: '/analisis-search', icon: ChartBarIcon },
  { name: 'Analisis Status', href: '/analisis-mahasiswa', icon: AcademicCapIcon },
  { name: 'Fitur Utama', href: '/fitur-utama', icon: IdentificationIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-blue-900 shadow-xl">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4">
              <img
                src="/logo-putih.png"
                alt="UNISMUH Logo"
                className="h-14 w-36 object-contain"
                onError={(e) => {
                  // Fallback jika gambar tidak ada
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <nav className="mt-8 flex-1 px-3 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    } group flex items-center px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-300`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Footer Info */}
          <div className="flex-shrink-0 border-t border-blue-700/50 p-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Universitas Muhammadiyah Makassar</p>
              <p className="text-xs text-blue-200">Sistem Pelacakan Mahasiswa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-900 border-t border-blue-700 shadow-lg z-50">
        <div className="grid grid-cols-3 h-16">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-white/20 text-white border-t-2 border-white'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                } flex flex-col items-center justify-center py-2 transition-all duration-300`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-white' : 'text-blue-200'
                  } h-6 w-6 mb-1`}
                  aria-hidden="true"
                />
                <span className={`text-xs font-semibold ${
                  isActive ? 'text-white' : 'text-blue-200'
                }`}>
                  {item.name.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}