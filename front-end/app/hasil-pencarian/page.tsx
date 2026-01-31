'use client';

import {
  AcademicCapIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  PrinterIcon,
  StarIcon,
  TrophyIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMahasiswa } from '../../context/MahasiswaContext';

export default function HasilPencarianPage() {
  const { mahasiswaData, hasilAnalisis, resetData } = useMahasiswa();
  const router = useRouter();

  // Tampilkan pesan jika tidak ada data
  if (!mahasiswaData || !hasilAnalisis) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-blue-100">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-8 w-8 text-blue-900" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Data Lengkap Mahasiswa</h1>
                <p className="text-sm text-blue-600">Biodata dan riwayat akademik</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <MagnifyingGlassIcon className="h-10 w-10 text-blue-900" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Data Mahasiswa</h2>
            <p className="text-gray-600 mb-6">
              Silakan cari mahasiswa terlebih dahulu untuk melihat data lengkap biodata dan riwayat akademik.
            </p>
            <Link
              href="/cari-mahasiswa"
              className="inline-flex items-center px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Cari Mahasiswa
            </Link>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">Apa yang akan ditampilkan?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Biodata pribadi (TTL, alamat, kontak)
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Data akademik (fakultas, jurusan, dosen PA)
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Statistik (IPK, SKS lulus, semester)
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Riwayat per semester (IPS, SKS, MK)
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                Beasiswa, organisasi, dan prestasi
              </li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  const handleKembali = () => {
    resetData();
    router.push('/cari-mahasiswa');
  };

  const handleCetak = () => {
    window.print();
  };

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case 'Berprestasi':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Normal':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Berisiko':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getKategoriIcon = (kategori: string) => {
    switch (kategori) {
      case 'Berprestasi':
        return <TrophyIcon className="h-6 w-6" />;
      case 'Normal':
        return <CheckCircleIcon className="h-6 w-6" />;
      case 'Berisiko':
        return <ExclamationTriangleIcon className="h-6 w-6" />;
      default:
        return <UserIcon className="h-6 w-6" />;
    }
  };

  const formatTanggal = (tanggal: string) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const persenSks = Math.round((mahasiswaData.sks_lulus / mahasiswaData.total_sks_wajib) * 100);
  
  // Kalkulasi waktu studi
  const tahunKuliah = Math.floor(mahasiswaData.lama_studi / 2);
  const sisaSemester = 14 - mahasiswaData.lama_studi; // Batas maksimal 14 semester
  const sisaTahun = Math.floor(sisaSemester / 2);
  const sisaBulan = (sisaSemester % 2) * 6;
  const sksPerSemesterIdeal = 20;
  const sksBelumLulus = mahasiswaData.total_sks_wajib - mahasiswaData.sks_lulus;
  const semesterDibutuhkan = Math.ceil(sksBelumLulus / sksPerSemesterIdeal);
  const tahunMasuk = mahasiswaData.angkatan;
  const perkiraanLulus = tahunMasuk + Math.ceil((mahasiswaData.lama_studi + semesterDibutuhkan) / 2);

  // Data FAQ
  const faqData = [
    {
      kategori: "Biodata Pribadi",
      pertanyaan: [
        { q: "Siapa nama lengkap mahasiswa ini?", a: mahasiswaData.nama },
        { q: "Berapa NIM mahasiswa ini?", a: mahasiswaData.nim },
        { q: "Di mana tempat lahir mahasiswa ini?", a: mahasiswaData.tempat_lahir },
        { q: "Kapan tanggal lahir mahasiswa ini?", a: formatTanggal(mahasiswaData.tanggal_lahir) },
        { q: "Di mana alamat tinggal mahasiswa ini?", a: mahasiswaData.alamat },
        { q: "Berapa nomor HP mahasiswa ini?", a: mahasiswaData.no_hp },
        { q: "Apa email mahasiswa ini?", a: mahasiswaData.email },
      ]
    },
    {
      kategori: "Data Akademik",
      pertanyaan: [
        { q: "Di fakultas mana mahasiswa ini kuliah?", a: mahasiswaData.fakultas },
        { q: "Apa jurusan/program studi mahasiswa ini?", a: mahasiswaData.jurusan },
        { q: "Angkatan berapa mahasiswa ini?", a: mahasiswaData.angkatan.toString() },
        { q: "Semester berapa sekarang?", a: `Semester ${mahasiswaData.semester}` },
        { q: "Siapa dosen pembimbing akademik (PA) mahasiswa ini?", a: mahasiswaData.dosen_pa },
        { q: "Apa status mahasiswa saat ini?", a: mahasiswaData.status },
      ]
    },
    {
      kategori: "Statistik Akademik",
      pertanyaan: [
        { q: "Berapa IPK mahasiswa ini?", a: mahasiswaData.ipk.toFixed(2) },
        { q: "Berapa total SKS yang sudah lulus?", a: `${mahasiswaData.sks_lulus} SKS` },
        { q: "Berapa total SKS wajib yang harus ditempuh?", a: `${mahasiswaData.total_sks_wajib} SKS` },
        { q: "Berapa SKS yang belum lulus?", a: `${sksBelumLulus} SKS` },
        { q: "Berapa persentase progress kelulusan?", a: `${persenSks}%` },
        { q: "Berapa total mata kuliah yang sudah lulus?", a: `${mahasiswaData.mk_lulus} Mata Kuliah` },
        { q: "Berapa mata kuliah yang harus mengulang?", a: `${mahasiswaData.mk_mengulang} Mata Kuliah` },
      ]
    },
    {
      kategori: "Waktu Studi",
      pertanyaan: [
        { q: "Berapa lama studi yang sudah ditempuh?", a: `${mahasiswaData.lama_studi} Semester` },
        { q: "Berapa tahun mahasiswa ini sudah kuliah?", a: `${tahunKuliah} tahun ${mahasiswaData.lama_studi % 2 === 1 ? '6 bulan' : ''}` },
        { q: "Berapa sisa waktu studi hingga batas maksimal (14 semester)?", a: sisaSemester > 0 ? `${sisaSemester} semester (${sisaTahun} tahun ${sisaBulan > 0 ? sisaBulan + ' bulan' : ''})` : 'Sudah melewati batas!' },
        { q: "Berapa semester lagi hingga batas DO?", a: sisaSemester > 0 ? `${sisaSemester} semester` : 'Sudah melewati batas maksimal!' },
        { q: "Kapan perkiraan lulus jika studi lancar?", a: `Tahun ${perkiraanLulus} (butuh ${semesterDibutuhkan} semester lagi)` },
      ]
    },
    {
      kategori: "Beasiswa, Organisasi & Prestasi",
      pertanyaan: [
        { q: "Apakah mahasiswa ini menerima beasiswa?", a: mahasiswaData.beasiswa || 'Tidak ada beasiswa' },
        { q: "Organisasi apa saja yang diikuti?", a: mahasiswaData.organisasi.length > 0 ? mahasiswaData.organisasi.join(', ') : 'Tidak ada' },
        { q: "Prestasi apa saja yang pernah diraih?", a: mahasiswaData.prestasi.length > 0 ? mahasiswaData.prestasi.join(', ') : 'Tidak ada' },
        { q: "Berapa banyak organisasi yang diikuti?", a: `${mahasiswaData.organisasi.length} organisasi` },
        { q: "Berapa banyak prestasi yang diraih?", a: `${mahasiswaData.prestasi.length} prestasi` },
      ]
    },
    {
      kategori: "Hasil Analisis (SAW)",
      pertanyaan: [
        { q: "Apa kategori mahasiswa ini?", a: hasilAnalisis.kategori },
        { q: "Berapa skor performa akademik (nilai SAW)?", a: `${(hasilAnalisis.nilai_saw * 100).toFixed(1)}%` },
        { q: "Apa status kelulusan mahasiswa ini?", a: hasilAnalisis.status_kelulusan },
        { q: "Berapa rekomendasi SKS yang harus diambil?", a: `${hasilAnalisis.rekomendasi_sks} SKS` },
        { q: "Apa saja rekomendasi untuk mahasiswa ini?", a: hasilAnalisis.rekomendasi.join(' | ') },
        { q: "Apakah ada catatan khusus untuk mahasiswa ini?", a: mahasiswaData.catatan_khusus || 'Tidak ada catatan khusus' },
      ]
    },
  ];

  return (
    <div className="min-h-screen print:bg-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100 print:shadow-none print:border-b-2">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-8 w-8 text-blue-900" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Hasil Pencarian Mahasiswa</h1>
                <p className="text-sm text-blue-600">Data lengkap dan analisis akademik</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 print:hidden">
              <button
                onClick={handleCetak}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <PrinterIcon className="h-5 w-5 mr-2" />
                Cetak
              </button>
              <button
                onClick={handleKembali}
                className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Cari Lagi
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Kategori Banner */}
        <div className={`rounded-xl p-6 mb-8 border-2 ${getKategoriColor(hasilAnalisis.kategori)}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white bg-opacity-50 rounded-full">
                {getKategoriIcon(hasilAnalisis.kategori)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{mahasiswaData.nama}</h2>
                <p className="text-lg">NIM: {mahasiswaData.nim}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Kategori Mahasiswa</p>
              <p className="text-3xl font-bold">{hasilAnalisis.kategori}</p>
              <p className="text-sm">Skor Performa Akademik: {(hasilAnalisis.nilai_saw * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri - Biodata */}
          <div className="lg:col-span-1 space-y-6">
            {/* Biodata Pribadi */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-900 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-6 w-6 text-white" />
                  <h3 className="text-lg font-bold text-white">Biodata Pribadi</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Tempat, Tanggal Lahir</p>
                    <p className="font-medium text-gray-900">
                      {mahasiswaData.tempat_lahir}, {formatTanggal(mahasiswaData.tanggal_lahir)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-medium text-gray-900">{mahasiswaData.alamat}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">No. HP</p>
                    <p className="font-medium text-gray-900">{mahasiswaData.no_hp}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{mahasiswaData.email}</p>
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
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <BuildingLibraryIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Fakultas</p>
                    <p className="font-medium text-gray-900">{mahasiswaData.fakultas}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpenIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Jurusan</p>
                    <p className="font-medium text-gray-900">{mahasiswaData.jurusan}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Angkatan</p>
                    <p className="font-medium text-gray-900">{mahasiswaData.angkatan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Semester</p>
                    <p className="font-medium text-gray-900">{mahasiswaData.semester}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Dosen PA</p>
                    <p className="font-medium text-gray-900">{mahasiswaData.dosen_pa}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Beasiswa</p>
                  <p className="font-medium text-gray-900">
                    {mahasiswaData.beasiswa || 'Tidak ada'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organisasi</p>
                  {mahasiswaData.organisasi.length > 0 ? (
                    <ul className="mt-1 space-y-1">
                      {mahasiswaData.organisasi.map((org, idx) => (
                        <li key={idx} className="text-gray-900 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {org}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Tidak ada</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prestasi</p>
                  {mahasiswaData.prestasi.length > 0 ? (
                    <ul className="mt-1 space-y-1">
                      {mahasiswaData.prestasi.map((prestasi, idx) => (
                        <li key={idx} className="text-gray-900 flex items-center">
                          <TrophyIcon className="h-4 w-4 text-yellow-500 mr-2" />
                          {prestasi}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Tidak ada</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Statistik & Analisis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistik Utama */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center">
                <p className="text-3xl font-bold text-blue-900">{mahasiswaData.ipk.toFixed(2)}</p>
                <p className="text-sm text-gray-600">IPK</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{mahasiswaData.sks_lulus}</p>
                <p className="text-sm text-gray-600">SKS Lulus</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center">
                <p className="text-3xl font-bold text-orange-600">{mahasiswaData.lama_studi}</p>
                <p className="text-sm text-gray-600">Semester</p>
              </div>
            </div>

            {/* Progress SKS */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Progress Kelulusan</h3>
                <span className="text-sm text-gray-600">{hasilAnalisis.status_kelulusan}</span>
              </div>
              <div className="relative">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-500"
                    style={{ width: `${persenSks}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">{mahasiswaData.sks_lulus} SKS lulus</span>
                  <span className="font-bold text-blue-900">{persenSks}%</span>
                  <span className="text-gray-600">{mahasiswaData.total_sks_wajib} SKS wajib</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-900">{mahasiswaData.mk_lulus}</p>
                  <p className="text-xs text-gray-600">MK Lulus</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-xl font-bold text-red-600">{mahasiswaData.mk_mengulang}</p>
                  <p className="text-xs text-gray-600">MK Mengulang</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{hasilAnalisis.rekomendasi_sks}</p>
                  <p className="text-xs text-gray-600">Rekomendasi SKS</p>
                </div>
              </div>
            </div>

            {/* Riwayat Semester */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-900 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-6 w-6 text-white" />
                  <h3 className="text-lg font-bold text-white">Riwayat Per Semester</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Semester</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">IPS</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">SKS Diambil</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">SKS Lulus</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">MK Lulus</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">MK Ulang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mahasiswaData.semester_data.map((sem) => (
                      <tr key={sem.semester} className={sem.ips === 0 ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-medium">Semester {sem.semester}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`font-bold ${
                            sem.ips >= 3.5 ? 'text-green-600' : 
                            sem.ips >= 3.0 ? 'text-blue-600' : 
                            sem.ips >= 2.5 ? 'text-yellow-600' : 
                            sem.ips > 0 ? 'text-red-600' : 'text-gray-400'
                          }`}>
                            {sem.ips > 0 ? sem.ips.toFixed(2) : '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">{sem.sks_diambil || '-'}</td>
                        <td className="px-4 py-3 text-sm text-center">{sem.sks_lulus || '-'}</td>
                        <td className="px-4 py-3 text-sm text-center">{sem.mk_lulus || '-'}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          {sem.mk_mengulang > 0 ? (
                            <span className="text-red-600 font-medium">{sem.mk_mengulang}</span>
                          ) : (
                            <span className="text-gray-400">{sem.mk_mengulang || '-'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rekomendasi */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-900 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                  <h3 className="text-lg font-bold text-white">Analisis & Rekomendasi</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {hasilAnalisis.rekomendasi.map((rek, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        idx === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <p className="text-gray-700">{rek}</p>
                    </li>
                  ))}
                </ul>

                {/* Catatan Khusus */}
                {mahasiswaData.catatan_khusus && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                      <p className="font-semibold text-yellow-800">Catatan Khusus</p>
                    </div>
                    <p className="text-yellow-700">{mahasiswaData.catatan_khusus}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-600">
              <p>Laporan dicetak pada:</p>
              <p>Tanggal: {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long',
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </div>

        {/* Section FAQ - Pertanyaan & Jawaban Lengkap */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-5">
            <div className="flex items-center space-x-3">
              <MagnifyingGlassIcon className="h-7 w-7 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">Informasi Lengkap Mahasiswa</h3>
                <p className="text-blue-200 text-sm">Pertanyaan & Jawaban tentang {mahasiswaData.nama}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {faqData.map((section, sectionIdx) => (
                <div key={sectionIdx} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                    {section.kategori}
                  </h4>
                  <div className="space-y-4">
                    {section.pertanyaan.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <p className="text-sm font-semibold text-blue-900 mb-2 flex items-start">
                          <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                            Q
                          </span>
                          {item.q}
                        </p>
                        <p className="text-gray-700 pl-7 font-medium">
                          <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">
                            A
                          </span>
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Summary Cards */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
                <p className="text-3xl font-bold">{tahunKuliah}</p>
                <p className="text-sm opacity-90">Tahun Kuliah</p>
              </div>
              <div className={`rounded-xl p-4 text-white text-center ${sisaSemester > 4 ? 'bg-gradient-to-br from-green-500 to-green-600' : sisaSemester > 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                <p className="text-3xl font-bold">{sisaSemester > 0 ? sisaSemester : 0}</p>
                <p className="text-sm opacity-90">Sisa Semester (DO)</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center">
                <p className="text-3xl font-bold">{sksBelumLulus}</p>
                <p className="text-sm opacity-90">SKS Belum Lulus</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white text-center">
                <p className="text-3xl font-bold">{perkiraanLulus}</p>
                <p className="text-sm opacity-90">Perkiraan Lulus</p>
              </div>
            </div>

            {/* Status Alert */}
            <div className={`mt-6 p-4 rounded-xl flex items-center space-x-4 ${
              sisaSemester <= 2 ? 'bg-red-50 border-2 border-red-300' : 
              sisaSemester <= 4 ? 'bg-yellow-50 border-2 border-yellow-300' : 
              'bg-green-50 border-2 border-green-300'
            }`}>
              {sisaSemester <= 2 ? (
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 flex-shrink-0" />
              ) : sisaSemester <= 4 ? (
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              ) : (
                <CheckCircleIcon className="h-8 w-8 text-green-600 flex-shrink-0" />
              )}
              <div>
                <p className={`font-bold ${
                  sisaSemester <= 2 ? 'text-red-800' : 
                  sisaSemester <= 4 ? 'text-yellow-800' : 
                  'text-green-800'
                }`}>
                  {sisaSemester <= 2 ? '⚠️ PERINGATAN: Waktu studi hampir habis!' : 
                   sisaSemester <= 4 ? '⚡ PERHATIAN: Segera selesaikan studi!' : 
                   '✅ Status waktu studi masih aman'}
                </p>
                <p className={`text-sm ${
                  sisaSemester <= 2 ? 'text-red-700' : 
                  sisaSemester <= 4 ? 'text-yellow-700' : 
                  'text-green-700'
                }`}>
                  {sisaSemester > 0 
                    ? `Mahasiswa masih memiliki ${sisaSemester} semester (${sisaTahun} tahun ${sisaBulan > 0 ? sisaBulan + ' bulan' : ''}) hingga batas maksimal studi.`
                    : 'Mahasiswa telah melewati batas maksimal studi 14 semester!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
