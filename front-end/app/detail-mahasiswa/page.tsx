'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  HomeIcon,
  ClipboardIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  no_ktp: string;
  status_pernikahan: string;
  agama: string;
  jumlah_saudara: number;
  anak_ke: number;
  suku_bangsa: string;
  kewarganegaraan: string;
  provinsi_sekarang: string;
  kabupaten_sekarang: string;
  kecamatan_sekarang: string;
  desa_sekarang: string;
  alamat_sekarang: string;
  jarak_kampus: number;
  kendaraan_kampus: string;
  telp: string;
  hp: string;
  email: string;
  provinsi_daerah: string;
  kabupaten_daerah: string;
  kecamatan_daerah: string;
  desa_daerah: string;
  alamat_daerah: string;
  nama_ayah: string;
  agama_ayah: string;
  pendidikan_ayah: string;
  pekerjaan_ayah: string;
  penghasilan_ayah: string;
  status_ayah: string;
  alamat_ayah: string;
  telepon_ayah: string;
  hp_ayah: string;
  nama_ibu: string;
  agama_ibu: string;
  pendidikan_ibu: string;
  pekerjaan_ibu: string;
  penghasilan_ibu: string;
  status_ibu: string;
  alamat_ibu: string;
  telepon_ibu: string;
  hp_ibu: string;
  kontak_utama: string;
  sd_asal: string;
  smp_asal: string;
  sma_asal: string;
  sumber_biaya: string;
  ipk: number;
  kehadiran: number;
  sks_lulus: number;
  mk_mengulang: number;
  lama_studi: number;
  jurusan: string;
  angkatan: number;
  semester: number;
  status: string;
  prestasi: string;
  beasiswa: string;
  beasiswa_luar: string;
  kipk: number;
  keterangan: string;
  sks_belum_lulus: number;
}

export default function DetailMahasiswa() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nim = searchParams.get('nim');
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('biodata');

  useEffect(() => {
    if (!nim) {
      setError('NIM tidak ditemukan');
      setLoading(false);
      return;
    }

    const fetchMahasiswa = async () => {
      try {
        const response = await fetch(`http://localhost:8080/mahasiswa/${nim}`);
        if (!response.ok) {
          throw new Error('Mahasiswa tidak ditemukan');
        }
        const data = await response.json();
        setMahasiswa(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchMahasiswa();
  }, [nim]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Memuat data...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !mahasiswa) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Kembali
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">{error || 'Data tidak ditemukan'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'Aktif': 'bg-green-100 text-green-800',
      'Alumni': 'bg-blue-100 text-blue-800',
      'Cuti': 'bg-yellow-100 text-yellow-800',
      'Keluar': 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const analysisQuestions = [
    {
      title: 'Status Akademik',
      icon: <ClipboardIcon className="w-5 h-5" />,
      questions: [
        { q: 'Apakah mahasiswa masih aktif?', a: mahasiswa.status === 'Aktif' ? 'Ya' : 'Tidak' },
        { q: 'Semester Mahasiswa?', a: `${mahasiswa.semester}` },
        { q: 'Total SKS Lulus?', a: `${mahasiswa.sks_lulus} SKS` },
        { q: 'SKS Belum Lulus?', a: `${mahasiswa.sks_belum_lulus} SKS` },
        { q: 'Matakuliah Mengulang?', a: `${mahasiswa.mk_mengulang} MK` },
        { q: 'Lama Studi?', a: `${mahasiswa.lama_studi} Semester` },
      ]
    },
    {
      title: 'Prestasi & Beasiswa',
      icon: <StarIcon className="w-5 h-5" />,
      questions: [
        { q: 'Apakah mahasiswa berprestasi?', a: mahasiswa.prestasi && mahasiswa.prestasi !== 'Tidak Ada' ? 'Ya' : 'Tidak' },
        { q: 'Prestasi Mahasiswa?', a: mahasiswa.prestasi || '-' },
        { q: 'Apakah menerima beasiswa?', a: mahasiswa.beasiswa && mahasiswa.beasiswa !== 'Tidak Ada' ? 'Ya' : 'Tidak' },
        { q: 'Jenis Beasiswa Dalam?', a: mahasiswa.beasiswa || '-' },
        { q: 'Beasiswa Luar Negeri?', a: mahasiswa.beasiswa_luar || '-' },
        { q: 'KIPK (GPA)?', a: `${mahasiswa.kipk}` },
      ]
    },
    {
      title: 'Informasi Keuangan',
      icon: <CreditCardIcon className="w-5 h-5" />,
      questions: [
        { q: 'Sumber Biaya?', a: mahasiswa.sumber_biaya || '-' },
        { q: 'Penghasilan Orang Tua (Ayah)?', a: mahasiswa.penghasilan_ayah || '-' },
        { q: 'Penghasilan Orang Tua (Ibu)?', a: mahasiswa.penghasilan_ibu || '-' },
        { q: 'Jumlah Saudara?', a: `${mahasiswa.jumlah_saudara}` },
        { q: 'Anak ke?', a: `${mahasiswa.anak_ke}` },
      ]
    },
    {
      title: 'Informasi Tempat Tinggal',
      icon: <HomeIcon className="w-5 h-5" />,
      questions: [
        { q: 'Alamat Sekarang?', a: mahasiswa.alamat_sekarang || '-' },
        { q: 'Kota Sekarang?', a: `${mahasiswa.kabupaten_sekarang}, ${mahasiswa.provinsi_sekarang}` },
        { q: 'Jarak ke Kampus?', a: `${mahasiswa.jarak_kampus} km` },
        { q: 'Kendaraan ke Kampus?', a: mahasiswa.kendaraan_kampus || '-' },
        { q: 'Alamat Asal?', a: mahasiswa.alamat_daerah || '-' },
        { q: 'Kota Asal?', a: `${mahasiswa.kabupaten_daerah}, ${mahasiswa.provinsi_daerah}` },
      ]
    },
    {
      title: 'Informasi Keluarga',
      icon: <UserGroupIcon className="w-5 h-5" />,
      questions: [
        { q: 'Nama Ayah?', a: mahasiswa.nama_ayah || '-' },
        { q: 'Pekerjaan Ayah?', a: mahasiswa.pekerjaan_ayah || '-' },
        { q: 'Pendidikan Ayah?', a: mahasiswa.pendidikan_ayah || '-' },
        { q: 'Nama Ibu?', a: mahasiswa.nama_ibu || '-' },
        { q: 'Pekerjaan Ibu?', a: mahasiswa.pekerjaan_ibu || '-' },
        { q: 'Pendidikan Ibu?', a: mahasiswa.pendidikan_ibu || '-' },
        { q: 'Kontak Utama?', a: mahasiswa.kontak_utama || '-' },
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detail Mahasiswa</h1>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{mahasiswa.nama}</h2>
              <p className="text-gray-600 mt-1">NIM: {mahasiswa.nim}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(mahasiswa.status)}`}>
              {mahasiswa.status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Jurusan</p>
              <p className="font-semibold text-gray-900">{mahasiswa.jurusan}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Angkatan</p>
              <p className="font-semibold text-gray-900">{mahasiswa.angkatan}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">IPK</p>
              <p className="font-semibold text-gray-900">{mahasiswa.ipk}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Kehadiran</p>
              <p className="font-semibold text-gray-900">{mahasiswa.kehadiran}%</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 bg-white rounded-lg p-2">
          {[
            { id: 'biodata', label: 'Biodata', icon: UserIcon },
            { id: 'akademik', label: 'Akademik', icon: AcademicCapIcon },
            { id: 'dokumen', label: 'Dokumen', icon: DocumentTextIcon },
            { id: 'analisis', label: 'Analisis', icon: ClipboardIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Biodata Tab */}
        {activeTab === 'biodata' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Informasi Pribadi
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Nama Lengkap', value: mahasiswa.nama },
                  { label: 'NIM', value: mahasiswa.nim },
                  { label: 'Tempat/Tanggal Lahir', value: `${mahasiswa.tempat_lahir}, ${mahasiswa.tanggal_lahir}` },
                  { label: 'Jenis Kelamin', value: mahasiswa.jenis_kelamin },
                  { label: 'Agama', value: mahasiswa.agama },
                  { label: 'Status Pernikahan', value: mahasiswa.status_pernikahan },
                  { label: 'KTP', value: mahasiswa.no_ktp },
                  { label: 'Kewarganegaraan', value: mahasiswa.kewarganegaraan },
                  { label: 'Suku Bangsa', value: mahasiswa.suku_bangsa },
                  { label: 'Telepon', value: mahasiswa.telp },
                  { label: 'HP', value: mahasiswa.hp },
                  { label: 'Email', value: mahasiswa.email },
                ].map((item, idx) => (
                  <div key={idx} className="border-b pb-3">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HomeIcon className="w-5 h-5" />
                Alamat Sekarang
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Alamat', value: mahasiswa.alamat_sekarang },
                  { label: 'Desa/Kelurahan', value: mahasiswa.desa_sekarang },
                  { label: 'Kecamatan', value: mahasiswa.kecamatan_sekarang },
                  { label: 'Kabupaten', value: mahasiswa.kabupaten_sekarang },
                  { label: 'Provinsi', value: mahasiswa.provinsi_sekarang },
                  { label: 'Jarak ke Kampus', value: `${mahasiswa.jarak_kampus} km` },
                  { label: 'Kendaraan', value: mahasiswa.kendaraan_kampus },
                ].map((item, idx) => (
                  <div key={idx} className="border-b pb-3">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HomeIcon className="w-5 h-5" />
                Alamat Asal
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Alamat', value: mahasiswa.alamat_daerah },
                  { label: 'Desa/Kelurahan', value: mahasiswa.desa_daerah },
                  { label: 'Kecamatan', value: mahasiswa.kecamatan_daerah },
                  { label: 'Kabupaten', value: mahasiswa.kabupaten_daerah },
                  { label: 'Provinsi', value: mahasiswa.provinsi_daerah },
                ].map((item, idx) => (
                  <div key={idx} className="border-b pb-3">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Akademik Tab */}
        {activeTab === 'akademik' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5" />
                Informasi Akademik
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Jurusan', value: mahasiswa.jurusan },
                  { label: 'Angkatan', value: mahasiswa.angkatan },
                  { label: 'Semester', value: mahasiswa.semester },
                  { label: 'IPK', value: mahasiswa.ipk },
                  { label: 'Kehadiran', value: `${mahasiswa.kehadiran}%` },
                  { label: 'SKS Lulus', value: mahasiswa.sks_lulus },
                  { label: 'SKS Belum Lulus', value: mahasiswa.sks_belum_lulus },
                  { label: 'MK Mengulang', value: mahasiswa.mk_mengulang },
                  { label: 'Lama Studi', value: `${mahasiswa.lama_studi} Semester` },
                  { label: 'Status', value: mahasiswa.status },
                  { label: 'Prestasi', value: mahasiswa.prestasi || '-' },
                  { label: 'KIPK', value: mahasiswa.kipk },
                ].map((item, idx) => (
                  <div key={idx} className="border-b pb-3">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <StarIcon className="w-5 h-5" />
                Beasiswa & Prestasi
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Beasiswa Dalam', value: mahasiswa.beasiswa || '-' },
                  { label: 'Beasiswa Luar', value: mahasiswa.beasiswa_luar || '-' },
                  { label: 'Prestasi', value: mahasiswa.prestasi || '-' },
                  { label: 'Keterangan', value: mahasiswa.keterangan || '-' },
                ].map((item, idx) => (
                  <div key={idx} className="border-b pb-3">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dokumen Tab */}
        {activeTab === 'dokumen' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5" />
              Informasi Keluarga
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Data Ayah</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: 'Nama', value: mahasiswa.nama_ayah },
                    { label: 'Agama', value: mahasiswa.agama_ayah },
                    { label: 'Pendidikan', value: mahasiswa.pendidikan_ayah },
                    { label: 'Pekerjaan', value: mahasiswa.pekerjaan_ayah },
                    { label: 'Penghasilan', value: mahasiswa.penghasilan_ayah },
                    { label: 'Status', value: mahasiswa.status_ayah },
                    { label: 'Alamat', value: mahasiswa.alamat_ayah },
                    { label: 'Telepon', value: mahasiswa.telepon_ayah },
                    { label: 'HP', value: mahasiswa.hp_ayah },
                  ].map((item, idx) => (
                    <div key={idx} className="border-b pb-3">
                      <p className="text-gray-500 text-sm">{item.label}</p>
                      <p className="font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Data Ibu</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: 'Nama', value: mahasiswa.nama_ibu },
                    { label: 'Agama', value: mahasiswa.agama_ibu },
                    { label: 'Pendidikan', value: mahasiswa.pendidikan_ibu },
                    { label: 'Pekerjaan', value: mahasiswa.pekerjaan_ibu },
                    { label: 'Penghasilan', value: mahasiswa.penghasilan_ibu },
                    { label: 'Status', value: mahasiswa.status_ibu },
                    { label: 'Alamat', value: mahasiswa.alamat_ibu },
                    { label: 'Telepon', value: mahasiswa.telepon_ibu },
                    { label: 'HP', value: mahasiswa.hp_ibu },
                  ].map((item, idx) => (
                    <div key={idx} className="border-b pb-3">
                      <p className="text-gray-500 text-sm">{item.label}</p>
                      <p className="font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">
                  <strong>Jumlah Saudara:</strong> {mahasiswa.jumlah_saudara} | <strong>Anak ke:</strong> {mahasiswa.anak_ke} | <strong>Kontak Utama:</strong> {mahasiswa.kontak_utama} | <strong>Sumber Biaya:</strong> {mahasiswa.sumber_biaya}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Riwayat Pendidikan</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: 'Asal SD', value: mahasiswa.sd_asal },
                    { label: 'Asal SMP', value: mahasiswa.smp_asal },
                    { label: 'Asal SMA', value: mahasiswa.sma_asal },
                  ].map((item, idx) => (
                    <div key={idx} className="border-b pb-3">
                      <p className="text-gray-500 text-sm">{item.label}</p>
                      <p className="font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analisis Tab */}
        {activeTab === 'analisis' && (
          <div className="space-y-4">
            {analysisQuestions.map((section, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.questions.map((qa, qidx) => (
                    <div key={qidx} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-gray-700 font-medium">{qa.q}</p>
                      <p className="text-blue-600 font-semibold mt-1">{qa.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
