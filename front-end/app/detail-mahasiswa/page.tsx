'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { UserIcon, AcademicCapIcon, ChevronLeftIcon, ExclamationTriangleIcon, PhoneIcon, EnvelopeIcon, IdentificationIcon, BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface OrangTua {
  nim: string; nik: string; nama: string; alamat: string; hp: string; email: string;
  pendidikan: string; pekerjaan: string; instansi: string; jabatan: string; penghasilan: string; status: string;
}
interface WaliData {
  nim: string; nama: string; alamat: string; hp: string; email: string;
  pendidikan: string; pekerjaan: string; instansi: string; jabatan: string; penghasilan: string;
}
interface KHS {
  tahun_akademik: string; total_sks_lulus: number; ips: number; ipk: number; status_kelulusan: string;
  jumlah_matakuliah: number; sks_diambil: number; sks_lulus: number; matakuliah_lulus: number;
  jumlah_mk_diulang: number; sks_mk_diulang: number;
}
interface DosenPA {
  nidn: string; nama: string; gelar_depan: string; gelar_belakang: string; email: string; prodi_id: string;
}
interface ProdiData {
  id: string; kode_fakultas: string; kode_prodi: string; nama_prodi: string; nama_prodi_eng: string;
  status_prodi: string; email_prodi: string; kode_nim: string; gelar_pendek: string; gelar_panjang: string; gelar_eng: string;
}
interface MahasiswaDetail {
  nim: string; kode_prodi: string; angkatan: number; nama: string; jenis_kelamin: string;
  tempat_lahir: string; tanggal_lahir: string; nik: string; hp: string; email: string;
  semester_awal: string; tahun_akademik_lulus: string; tanggal_lulus: string; lulus: boolean;
  no_seri_ijazah: string; masa_studi: string; status: string; kategori: string;
  ipk: number; sks_total: number; sks_diambil: number; sks_lulus: number;
  matakuliah_lulus: number; jumlah_mk_diulang: number; sks_mk_diulang: number;
  ayah: OrangTua | null; ibu: OrangTua | null; wali: WaliData | null;
  khs: KHS[]; dosen_penasehat: DosenPA | null; prodi: ProdiData | null;
}

export default function DetailMahasiswaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div></div>}>
      <DetailMahasiswa />
    </Suspense>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  const display = value !== null && value !== undefined && value !== '' ? String(value) : '-';
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{display}</span>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h3 className="text-lg font-bold text-blue-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function OrangTuaCard({ title, data }: { title: string; data: OrangTua | null }) {
  if (!data || !data.nama) return null;
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      <InfoRow label="Nama" value={data.nama} />
      <InfoRow label="NIK" value={data.nik} />
      <InfoRow label="HP" value={data.hp} />
      <InfoRow label="Email" value={data.email} />
      <InfoRow label="Alamat" value={data.alamat} />
      <InfoRow label="Pendidikan" value={data.pendidikan} />
      <InfoRow label="Pekerjaan" value={data.pekerjaan} />
      <InfoRow label="Instansi" value={data.instansi} />
      <InfoRow label="Jabatan" value={data.jabatan} />
      <InfoRow label="Penghasilan" value={data.penghasilan} />
      {data.status && <InfoRow label="Status" value={data.status} />}
    </div>
  );
}

function DetailMahasiswa() {
  const searchParams = useSearchParams();
  const nim = searchParams.get('nim');
  const [data, setData] = useState<MahasiswaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'akademik' | 'pribadi' | 'keluarga' | 'khs'>('akademik');

  const fetchData = useCallback(async () => {
    if (!nim) { setError('NIM tidak ditemukan di URL'); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/mahasiswa/${nim}/detail`);
      if (!res.ok) throw new Error('Data tidak ditemukan');
      const result = await res.json();
      setData(result);
    } catch {
      setError('Gagal memuat data mahasiswa. Pastikan NIM benar.');
    } finally {
      setLoading(false);
    }
  }, [nim]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div></div>;
  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 font-medium mb-4">{error || 'Data tidak ditemukan'}</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Kembali</Link>
      </div>
    </div>
  );

  const m = data;
  const progressSKS = m.sks_total > 0 ? Math.min((m.sks_lulus / m.sks_total) * 100, 100) : 0;
  const rasioUlang = m.sks_diambil > 0 ? ((m.sks_mk_diulang / m.sks_diambil) * 100) : 0;
  const dosenNama = m.dosen_penasehat ? `${m.dosen_penasehat.gelar_depan || ''} ${m.dosen_penasehat.nama} ${m.dosen_penasehat.gelar_belakang || ''}`.trim() : '-';

  const tabs = [
    { id: 'akademik' as const, label: 'Akademik' },
    { id: 'pribadi' as const, label: 'Data Pribadi' },
    { id: 'keluarga' as const, label: 'Keluarga' },
    { id: 'khs' as const, label: 'KHS Per Semester' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Detail Mahasiswa</h1>
              <p className="text-sm text-blue-600">Informasi lengkap data akademik & pribadi</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-3 sm:px-5 lg:px-6 py-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-900 mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-1" /> Kembali ke Dashboard
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden mb-6">
          <div className="bg-blue-900 px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-white">{m.nama?.charAt(0) || '?'}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{m.nama}</h2>
                <p className="text-blue-200 text-lg">{m.nim}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-700 text-white">Angkatan {m.angkatan}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.status === 'Aktif' ? 'bg-green-500 text-white' : m.status === 'Alumni' ? 'bg-purple-500 text-white' : 'bg-red-500 text-white'}`}>{m.status}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.kategori === 'Berprestasi' ? 'bg-yellow-400 text-yellow-900' : m.kategori === 'Normal' ? 'bg-blue-400 text-white' : 'bg-orange-400 text-white'}`}>{m.kategori}</span>
                  {m.lulus && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">LULUS</span>}
                </div>
                {m.prodi && <p className="text-blue-300 text-sm mt-2">{m.prodi.nama_prodi} ({m.prodi.gelar_pendek})</p>}
                <p className="text-blue-300 text-sm">Dosen PA: {dosenNama}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 text-center">
            <p className="text-xs text-gray-500">IPK</p>
            <p className={`text-2xl font-bold ${(m.ipk||0) >= 3.5 ? 'text-green-700' : (m.ipk||0) >= 3.0 ? 'text-blue-700' : 'text-orange-700'}`}>{(m.ipk||0).toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 text-center">
            <p className="text-xs text-gray-500">SKS Lulus</p>
            <p className="text-2xl font-bold text-gray-900">{m.sks_lulus}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 text-center">
            <p className="text-xs text-gray-500">MK Lulus</p>
            <p className="text-2xl font-bold text-gray-900">{m.matakuliah_lulus}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 text-center">
            <p className="text-xs text-gray-500">MK Diulang</p>
            <p className={`text-2xl font-bold ${m.jumlah_mk_diulang > 0 ? 'text-red-700' : 'text-green-700'}`}>{m.jumlah_mk_diulang}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 text-center">
            <p className="text-xs text-gray-500">SKS MK Diulang</p>
            <p className={`text-2xl font-bold ${m.sks_mk_diulang > 0 ? 'text-red-700' : 'text-green-700'}`}>{m.sks_mk_diulang}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Progress Kelulusan SKS</span>
            <span className="font-bold text-gray-900">{m.sks_lulus} / {m.sks_total} ({progressSKS.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className={`h-4 rounded-full transition-all ${progressSKS >= 75 ? 'bg-green-500' : progressSKS >= 50 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{width: `${progressSKS}%`}}></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl shadow-md border border-blue-100 p-1 mb-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'akademik' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Data SKS" icon={<AcademicCapIcon className="h-6 w-6 text-blue-900" />}>
              <InfoRow label="SKS Total" value={m.sks_total} />
              <InfoRow label="SKS Diambil" value={m.sks_diambil} />
              <InfoRow label="SKS Lulus" value={m.sks_lulus} />
              <InfoRow label="Matakuliah Lulus" value={m.matakuliah_lulus} />
              <InfoRow label="MK Diulang" value={m.jumlah_mk_diulang} />
              <InfoRow label="SKS MK Diulang" value={m.sks_mk_diulang} />
              <InfoRow label="Rasio Ulang" value={`${rasioUlang.toFixed(1)}%`} />
            </SectionCard>
            <SectionCard title="Info Kelulusan" icon={<BookOpenIcon className="h-6 w-6 text-blue-900" />}>
              <InfoRow label="Status" value={m.status} />
              <InfoRow label="Kategori" value={m.kategori} />
              <InfoRow label="Lulus" value={m.lulus ? 'Ya' : 'Belum'} />
              <InfoRow label="Tanggal Lulus" value={m.tanggal_lulus} />
              <InfoRow label="Tahun Akademik Lulus" value={m.tahun_akademik_lulus} />
              <InfoRow label="No Seri Ijazah" value={m.no_seri_ijazah} />
              <InfoRow label="Masa Studi" value={m.masa_studi} />
              <InfoRow label="Semester Awal" value={m.semester_awal} />
            </SectionCard>
            {m.dosen_penasehat && (
              <SectionCard title="Dosen Penasehat Akademik" icon={<UserIcon className="h-6 w-6 text-blue-900" />}>
                <InfoRow label="Nama" value={dosenNama} />
                <InfoRow label="NIDN" value={m.dosen_penasehat.nidn} />
                <InfoRow label="Email" value={m.dosen_penasehat.email} />
              </SectionCard>
            )}
            {m.prodi && (
              <SectionCard title="Program Studi" icon={<AcademicCapIcon className="h-6 w-6 text-blue-900" />}>
                <InfoRow label="Nama Prodi" value={m.prodi.nama_prodi} />
                <InfoRow label="Kode Prodi" value={m.prodi.kode_prodi} />
                <InfoRow label="Status" value={m.prodi.status_prodi} />
                <InfoRow label="Gelar" value={`${m.prodi.gelar_pendek} (${m.prodi.gelar_panjang})`} />
                <InfoRow label="Email Prodi" value={m.prodi.email_prodi} />
              </SectionCard>
            )}
          </div>
        )}

        {activeTab === 'pribadi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Identitas" icon={<IdentificationIcon className="h-6 w-6 text-blue-900" />}>
              <InfoRow label="Nama Lengkap" value={m.nama} />
              <InfoRow label="NIM" value={m.nim} />
              <InfoRow label="NIK" value={m.nik} />
              <InfoRow label="Jenis Kelamin" value={m.jenis_kelamin === 'L' ? 'Laki-laki' : m.jenis_kelamin === 'P' ? 'Perempuan' : m.jenis_kelamin} />
              <InfoRow label="Tempat Lahir" value={m.tempat_lahir} />
              <InfoRow label="Tanggal Lahir" value={m.tanggal_lahir} />
            </SectionCard>
            <SectionCard title="Kontak" icon={<PhoneIcon className="h-6 w-6 text-blue-900" />}>
              <InfoRow label="HP" value={m.hp} />
              <InfoRow label="Email" value={m.email} />
              <InfoRow label="Angkatan" value={m.angkatan} />
              <InfoRow label="Kode Prodi" value={m.kode_prodi} />
            </SectionCard>
          </div>
        )}

        {activeTab === 'keluarga' && (
          <SectionCard title="Data Keluarga" icon={<UserGroupIcon className="h-6 w-6 text-blue-900" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <OrangTuaCard title="Ayah" data={m.ayah} />
              <OrangTuaCard title="Ibu" data={m.ibu} />
              {m.wali && m.wali.nama && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Wali</h4>
                  <InfoRow label="Nama" value={m.wali.nama} />
                  <InfoRow label="HP" value={m.wali.hp} />
                  <InfoRow label="Email" value={m.wali.email} />
                  <InfoRow label="Alamat" value={m.wali.alamat} />
                  <InfoRow label="Pendidikan" value={m.wali.pendidikan} />
                  <InfoRow label="Pekerjaan" value={m.wali.pekerjaan} />
                  <InfoRow label="Instansi" value={m.wali.instansi} />
                  <InfoRow label="Jabatan" value={m.wali.jabatan} />
                  <InfoRow label="Penghasilan" value={m.wali.penghasilan} />
                </div>
              )}
            </div>
            {!m.ayah?.nama && !m.ibu?.nama && !m.wali?.nama && (
              <p className="text-gray-500 text-center py-8">Data keluarga tidak tersedia</p>
            )}
          </SectionCard>
        )}

        {activeTab === 'khs' && (
          <SectionCard title="Kartu Hasil Studi (KHS)" icon={<BookOpenIcon className="h-6 w-6 text-blue-900" />}>
            {m.khs && m.khs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50 border-b border-gray-200">
                      <th className="px-3 py-3 text-left font-semibold text-blue-900">Tahun Akademik</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">IPS</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">IPK</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">SKS Diambil</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">SKS Lulus</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">Total SKS Lulus</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">Jml MK</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">MK Lulus</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">MK Diulang</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">SKS Diulang</th>
                      <th className="px-3 py-3 text-center font-semibold text-blue-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.khs.map((k, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{k.tahun_akademik}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${(k.ips||0) >= 3.5 ? 'bg-green-100 text-green-800' : (k.ips||0) >= 3.0 ? 'bg-blue-100 text-blue-800' : (k.ips||0) >= 2.0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{(k.ips||0).toFixed(2)}</span>
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-gray-900">{(k.ipk||0).toFixed(2)}</td>
                        <td className="px-3 py-3 text-center text-gray-700">{k.sks_diambil}</td>
                        <td className="px-3 py-3 text-center text-gray-700">{k.sks_lulus}</td>
                        <td className="px-3 py-3 text-center font-semibold text-gray-900">{k.total_sks_lulus}</td>
                        <td className="px-3 py-3 text-center text-gray-700">{k.jumlah_matakuliah}</td>
                        <td className="px-3 py-3 text-center text-gray-700">{k.matakuliah_lulus}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${(k.jumlah_mk_diulang||0) > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{k.jumlah_mk_diulang || 0}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${(k.sks_mk_diulang||0) > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{k.sks_mk_diulang || 0}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${k.status_kelulusan === 'Lulus' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{k.status_kelulusan || '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Data KHS tidak tersedia</p>
            )}
          </SectionCard>
        )}

        {/* Warning */}
        {m.jumlah_mk_diulang > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-800 mb-1">Perhatian: Mahasiswa Memiliki Matakuliah Diulang</h4>
                <p className="text-sm text-red-700">Terdapat <strong>{m.jumlah_mk_diulang}</strong> MK diulang ({m.sks_mk_diulang} SKS). Rasio: <strong>{rasioUlang.toFixed(1)}%</strong></p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
