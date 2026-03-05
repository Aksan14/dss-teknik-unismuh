'use client';

import {
    AcademicCapIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ChevronDownIcon,
    ClipboardDocumentListIcon,
    GiftIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    StarIcon,
    UserGroupIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Cari Mahasiswa', href: '/cari-mahasiswa', icon: MagnifyingGlassIcon },
  { name: 'Peninjauan Mahasiswa', href: '/analisis-search', icon: ChartBarIcon },
];

const dataMahasiswaMenu = [
  { name: 'Data Lengkap', href: '/data-lengkap', icon: ClipboardDocumentListIcon },
  { name: 'Data Per Angkatan', href: '/data-perangkatan', icon: CalendarDaysIcon },
  { name: 'Data Alumni', href: '/data-alumni', icon: AcademicCapIcon },
  { name: 'Prestasi Mahasiswa', href: '/prestasi-mahasiswa', icon: StarIcon },
  { name: 'Penerima Beasiswa', href: '/penerima-beasiswa', icon: GiftIcon },
  { name: 'Mahasiswa Aktif', href: '/mahasiswa-aktif', icon: UserGroupIcon },
  { name: 'Mahasiswa Tidak Aktif', href: '/mahasiswa-tidak-aktif', icon: XMarkIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(() => {
    // Auto-expand if current path matches any sub-menu
    return dataMahasiswaMenu.some(item => item.href === pathname);
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDataMenuActive = dataMahasiswaMenu.some(item => item.href === pathname);

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

              {/* Data Mahasiswa Accordion */}
              <div>
                <button
                  onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                  className={`${
                    isDataMenuActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  } w-full group flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-300`}
                >
                  <div className="flex items-center">
                    <UserGroupIcon
                      className={`${
                        isDataMenuActive ? 'text-white' : 'text-blue-200 group-hover:text-white'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    Data Mahasiswa
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-blue-200 transition-transform duration-300 ${
                      isDataMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isDataMenuOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-4 pl-3 border-l border-blue-700/50 space-y-1">
                    {dataMahasiswaMenu.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`${
                            isActive
                              ? 'bg-white/15 text-white'
                              : 'text-blue-200 hover:bg-white/10 hover:text-white'
                          } group flex items-center px-3 py-2 text-xs font-medium rounded-md transition-all duration-200`}
                        >
                          <item.icon
                            className={`${
                              isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                            } mr-2 flex-shrink-0 h-4 w-4`}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
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
        <div className="grid grid-cols-4 h-16">
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
                onClick={() => setIsMobileMenuOpen(false)}
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

          {/* Data Mahasiswa mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`${
              isDataMenuActive || isMobileMenuOpen
                ? 'bg-white/20 text-white border-t-2 border-white'
                : 'text-blue-200 hover:text-white hover:bg-white/10'
            } flex flex-col items-center justify-center py-2 transition-all duration-300`}
          >
            <UserGroupIcon
              className={`${
                isDataMenuActive || isMobileMenuOpen ? 'text-white' : 'text-blue-200'
              } h-6 w-6 mb-1`}
              aria-hidden="true"
            />
            <span className={`text-xs font-semibold ${
              isDataMenuActive || isMobileMenuOpen ? 'text-white' : 'text-blue-200'
            }`}>
              Data
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Data Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute bottom-16 left-0 right-0 bg-blue-900 border-t border-blue-700 rounded-t-2xl p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide px-3 mb-2">Data Mahasiswa</p>
            {dataMahasiswaMenu.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  } flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-white' : 'text-blue-200'
                    } mr-3 h-5 w-5`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}