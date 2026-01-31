'use client';

import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MahasiswaData {
  nim: string;
  nama: string;
  jurusan: string;
  fakultas: string;
  angkatan: number;
  semester: number;
  status: string;
  ipk: number;
  kehadiran: number;
  sks_lulus: number;
  total_sks_wajib: number;
  mk_lulus: number;
  mk_mengulang: number;
  lama_studi: number;
  beasiswa: string | null;
  organisasi: string[];
  prestasi: string[];
  catatan_khusus: string | null;
  semester_data: any[];
}

interface AngkatanStats {
  angkatan: number;
  total_mahasiswa: number;
  mahasiswa_aktif: number;
  rata_rata_ipk: number;
  rata_rata_kehadiran: number;
  mahasiswa_berprestasi: number;
  mahasiswa_berisiko: number;
  total_sks_diselesaikan: number;
}

interface MahasiswaAngkatan extends MahasiswaData {
  status_akademik: 'Berprestasi' | 'Normal' | 'Berisiko';
}

const DUMMY_MAHASISWA: MahasiswaData[] = [
  {
    nim: '105841100420',
    nama: 'Ahmad Fauzi Rahman',
    jurusan: 'Teknik Informatika',
    fakultas: 'Fakultas Teknik',
    angkatan: 2020,
    semester: 8,
    status: 'Aktif',
    ipk: 3.75,
    kehadiran: 95,
    sks_lulus: 132,
    total_sks_wajib: 144,
    mk_lulus: 52,
    mk_mengulang: 0,
    lama_studi: 8,
    beasiswa: 'Beasiswa Prestasi Akademik',
    organisasi: ['BEM Fakultas Teknik', 'HMTI'],
    prestasi: ['Juara 1 Hackathon Nasional 2023', 'Best Paper ICIC 2022'],
    catatan_khusus: null,
    semester_data: []
  },
  {
    nim: '105841100421',
    nama: 'Siti Nurhaliza',
    jurusan: 'Teknik Informatika',
    fakultas: 'Fakultas Teknik',
    angkatan: 2020,
    semester: 8,
    status: 'Aktif',
    ipk: 3.25,
    kehadiran: 88,
    sks_lulus: 120,
    total_sks_wajib: 144,
    mk_lulus: 48,
    mk_mengulang: 3,
    lama_studi: 8,
    beasiswa: null,
    organisasi: ['HMTI'],
    prestasi: [],
    catatan_khusus: 'Perlu bimbingan tambahan',
    semester_data: []
  },
  {
    nim: '105841100422',
    nama: 'Muhammad Rizky Pratama',
    jurusan: 'Teknik Informatika',
    fakultas: 'Fakultas Teknik',
    angkatan: 2020,
    semester: 9,
    status: 'Aktif',
    ipk: 2.45,
    kehadiran: 72,
    sks_lulus: 98,
    total_sks_wajib: 144,
    mk_lulus: 40,
    mk_mengulang: 8,
    lama_studi: 9,
    beasiswa: null,
    organisasi: [],
    prestasi: [],
    catatan_khusus: 'Mahasiswa dengan status peringatan akademik',
    semester_data: []
  }
];

export default function DataAngkatanPage() {
  const router = useRouter();
  const [angkatanList, setAngkatanList] = useState<AngkatanStats[]>([]);
  const [selectedAngkatan, setSelectedAngkatan] = useState<number | null>(null);
  const [mahasiswaAngkatan, setMahasiswaAngkatan] = useState<MahasiswaAngkatan[]>([]);
  const [view, setView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    // Generate statistik per angkatan
    const groupByAngkatan = DUMMY_MAHASISWA.reduce((acc, mhs) => {
      if (!acc[mhs.angkatan]) {
        acc[mhs.angkatan] = [];
      }
      acc[mhs.angkatan].push(mhs);
      return acc;
    }, {} as Record<number, MahasiswaData[]>);

    const stats: AngkatanStats[] = Object.entries(groupByAngkatan).map(([angkatan, mahasiswa]) => {
      const totalMahasiswa = mahasiswa.length;
      const mahasiswaAktif = mahasiswa.filter(m => m.status === 'Aktif').length;
      const rataRataIpk = mahasiswa.reduce((sum, m) => sum + m.ipk, 0) / totalMahasiswa;
      const rataRataKehadiran = mahasiswa.reduce((sum, m) => sum + m.kehadiran, 0) / totalMahasiswa;
      
      // Hitung status akademik
      const mahasiswaWithStatus = mahasiswa.map(m => {
        const normIpk = m.ipk / 4.0;
        const normSks = m.sks_lulus / m.total_sks_wajib;
        const normMk = m.mk_mengulang === 0 ? 1.0 : 1.0 / (1 + m.mk_mengulang);
        const normLama = Math.min(8 / m.lama_studi, 1.0);
        const nilaiSaw = (normIpk * 0.35 + normSks * 0.30 + normMk * 0.20 + normLama * 0.15);
        
        let status: 'Berprestasi' | 'Normal' | 'Berisiko';
        if (nilaiSaw >= 0.75) status = 'Berprestasi';
        else if (nilaiSaw >= 0.50) status = 'Normal';
        else status = 'Berisiko';
        
        return { ...m, status_akademik: status };
      });

      const mahasiswaBerprestasi = mahasiswaWithStatus.filter(m => m.status_akademik === 'Berprestasi').length;
      const mahasiswaBerisiko = mahasiswaWithStatus.filter(m => m.status_akademik === 'Berisiko').length;
      const totalSksDiselesaikan = mahasiswa.reduce((sum, m) => sum + m.sks_lulus, 0);

      return {
        angkatan: parseInt(angkatan),
        total_mahasiswa: totalMahasiswa,
        mahasiswa_aktif: mahasiswaAktif,
        rata_rata_ipk: rataRataIpk,
        rata_rata_kehadiran: rataRataKehadiran,
        mahasiswa_berprestasi: mahasiswaBerprestasi,
        mahasiswa_berisiko: mahasiswaBerisiko,
        total_sks_diselesaikan: totalSksDiselesaikan
      };
    });

    // Sort by angkatan descending
    stats.sort((a, b) => b.angkatan - a.angkatan);
    setAngkatanList(stats);
  }, []);

  const handleSelectAngkatan = (angkatan: number) => {
    setSelectedAngkatan(angkatan);
    
    // Filter dan process mahasiswa per angkatan
    const mahasiswa = DUMMY_MAHASISWA.filter(m => m.angkatan === angkatan);
    const withStatus = mahasiswa.map(m => {
      const normIpk = m.ipk / 4.0;
      const normSks = m.sks_lulus / m.total_sks_wajib;
      const normMk = m.mk_mengulang === 0 ? 1.0 : 1.0 / (1 + m.mk_mengulang);
      const normLama = Math.min(8 / m.lama_studi, 1.0);
      const nilaiSaw = (normIpk * 0.35 + normSks * 0.30 + normMk * 0.20 + normLama * 0.15);
      
      let status: 'Berprestasi' | 'Normal' | 'Berisiko';
      if (nilaiSaw >= 0.75) status = 'Berprestasi';
      else if (nilaiSaw >= 0.50) status = 'Normal';
      else status = 'Berisiko';
      
      return { ...m, status_akademik: status };
    });

    setMahasiswaAngkatan(withStatus);
    setView('detail');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Berprestasi':
        return 'bg-green-50 border-green-200';
      case 'Berisiko':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Berprestasi':
        return <CheckCircleIcon className="h-8 w-8 text-green-600" />;
      case 'Berisiko':
        return <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />;
      default:
        return <AcademicCapIcon className="h-8 w-8 text-blue-600" />;
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Berprestasi':
        return 'text-green-800';
      case 'Berisiko':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarDaysIcon className="h-8 w-8 text-blue-900" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Data Perangkatan</h1>
                <p className="text-sm text-blue-600">Statistik dan analisis mahasiswa per angkatan</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        {view === 'list' ? (
          <>
            {/* Daftar Angkatan */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar Angkatan ({angkatanList.length})</h2>
              
              {angkatanList.map((angkatan) => (
                <div
                  key={angkatan.angkatan}
                  onClick={() => handleSelectAngkatan(angkatan.angkatan)}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">ANGKATAN</p>
                      <h3 className="text-2xl font-bold text-blue-900">{angkatan.angkatan}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {new Date().getFullYear() - angkatan.angkatan} tahun yang lalu
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Total Mahasiswa</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{angkatan.total_mahasiswa}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Aktif</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{angkatan.mahasiswa_aktif}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Berprestasi</p>
                        <p className="text-2xl font-bold text-purple-600 mt-1">{angkatan.mahasiswa_berprestasi}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Berisiko</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{angkatan.mahasiswa_berisiko}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Rata-rata IPK</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">{angkatan.rata_rata_ipk.toFixed(2)}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Rata-rata Kehadiran</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">{angkatan.rata_rata_kehadiran.toFixed(0)}%</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg col-span-2">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Total SKS Diselesaikan</p>
                        <p className="text-2xl font-bold text-indigo-600 mt-1">{angkatan.total_sks_diselesaikan} SKS</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Klik untuk melihat detail mahasiswa angkatan ini</span>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Detail Angkatan */}
            <div>
              <button
                onClick={() => setView('list')}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mb-6"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali ke Daftar Angkatan
              </button>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <CalendarDaysIcon className="h-10 w-10 text-blue-900" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Angkatan {selectedAngkatan}</h2>
                    <p className="text-gray-600">
                      Total {mahasiswaAngkatan.length} mahasiswa | 
                      Rata-rata IPK {(mahasiswaAngkatan.reduce((sum, m) => sum + m.ipk, 0) / mahasiswaAngkatan.length).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Berprestasi</p>
                      <p className="text-3xl font-bold text-green-600">
                        {mahasiswaAngkatan.filter(m => m.status_akademik === 'Berprestasi').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
                  <div className="flex items-center space-x-3">
                    <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Normal</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {mahasiswaAngkatan.filter(m => m.status_akademik === 'Normal').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6">
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Berisiko</p>
                      <p className="text-3xl font-bold text-red-600">
                        {mahasiswaAngkatan.filter(m => m.status_akademik === 'Berisiko').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6">
                  <div className="flex items-center space-x-3">
                    <UserGroupIcon className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-3xl font-bold text-purple-600">{mahasiswaAngkatan.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* List Mahasiswa */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Mahasiswa</h3>
              <div className="space-y-3">
                {mahasiswaAngkatan.map((mahasiswa) => (
                  <div
                    key={mahasiswa.nim}
                    className={`rounded-xl border-2 p-5 ${getStatusColor(mahasiswa.status_akademik)}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(mahasiswa.status_akademik)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{mahasiswa.nama}</h4>
                            <p className="text-sm text-gray-600">NIM: {mahasiswa.nim}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusTextColor(mahasiswa.status_akademik)}`}>
                            {mahasiswa.status_akademik}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">IPK</p>
                            <p className="text-lg font-bold text-gray-900">{mahasiswa.ipk.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">Kehadiran</p>
                            <p className="text-lg font-bold text-gray-900">{mahasiswa.kehadiran}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">SKS Lulus</p>
                            <p className="text-lg font-bold text-gray-900">{mahasiswa.sks_lulus}/{mahasiswa.total_sks_wajib}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">Semester</p>
                            <p className="text-lg font-bold text-gray-900">{mahasiswa.semester}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">MK Mengulang</p>
                            <p className="text-lg font-bold text-gray-900">{mahasiswa.mk_mengulang}</p>
                          </div>
                        </div>

                        {mahasiswa.beasiswa && (
                          <div className="mt-3 text-sm text-gray-700">
                            <p><span className="font-semibold">Beasiswa:</span> {mahasiswa.beasiswa}</p>
                          </div>
                        )}

                        {mahasiswa.prestasi.length > 0 && (
                          <div className="mt-3 text-sm text-gray-700">
                            <p className="font-semibold mb-1">Prestasi:</p>
                            <ul className="list-disc list-inside">
                              {mahasiswa.prestasi.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
