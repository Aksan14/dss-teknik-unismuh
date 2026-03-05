'use client';

import { ChatBubbleLeftRightIcon, CheckIcon, ChevronLeftIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, PhoneIcon, ShieldExclamationIcon, StarIcon, UsersIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Mahasiswa {
  nim: string; nama: string; ipk: number; angkatan: number;
  sks_total: number; sks_diambil: number; sks_lulus: number;
  matakuliah_lulus: number; jumlah_mk_diulang: number; sks_mk_diulang: number;
  status: string; kategori: string; jurusan: string;
}

interface DetailMahasiswa {
  nim: string; nama: string; angkatan: number; ipk: number;
  sks_lulus: number; sks_diambil: number; matakuliah_lulus: number;
  jumlah_mk_diulang: number; sks_mk_diulang: number; status: string;
  hp: string;
  ayah: { nama: string; hp: string } | null;
  ibu: { nama: string; hp: string } | null;
  wali: { nama: string; hp: string } | null;
  dosen_penasehat: { nama: string; gelar_depan: string; gelar_belakang: string } | null;
  prodi: { nama_prodi: string } | null;
  khs: { tahun_akademik: string; ips: number; ipk: number; sks_diambil: number; sks_lulus: number; matakuliah_lulus: number; jumlah_mk_diulang: number; sks_mk_diulang: number }[];
}

type TabType = 'bermasalah' | 'berprestasi';

function getMasalah(m: Mahasiswa): string[] {
  const masalah: string[] = [];
  if (m.ipk < 2.0) masalah.push('IPK sangat rendah (' + (m.ipk||0).toFixed(2) + ')');
  else if (m.ipk < 2.5) masalah.push('IPK rendah (' + (m.ipk||0).toFixed(2) + ')');
  if (m.jumlah_mk_diulang >= 5) masalah.push('Banyak MK diulang (' + m.jumlah_mk_diulang + ' MK)');
  else if (m.jumlah_mk_diulang >= 3) masalah.push('Beberapa MK diulang (' + m.jumlah_mk_diulang + ' MK)');
  const tahun = new Date().getFullYear();
  const lama = tahun - m.angkatan;
  if (lama > 6) masalah.push('Studi sangat lama (' + lama + ' tahun)');
  else if (lama > 5) masalah.push('Studi melebihi batas (' + lama + ' tahun)');
  if (m.sks_mk_diulang >= 15) masalah.push('SKS MK diulang tinggi (' + m.sks_mk_diulang + ' SKS)');
  if (m.sks_lulus < 20 && lama >= 2) masalah.push('Progress SKS sangat lambat');
  return masalah;
}

function getPrestasi(m: Mahasiswa): string[] {
  const prestasi: string[] = [];
  if (m.ipk >= 3.75) prestasi.push('IPK Cum Laude (' + (m.ipk||0).toFixed(2) + ')');
  else if (m.ipk >= 3.5) prestasi.push('IPK Sangat Baik (' + (m.ipk||0).toFixed(2) + ')');
  if (m.jumlah_mk_diulang === 0 && m.sks_lulus >= 40) prestasi.push('Tidak pernah mengulang MK');
  const tahun = new Date().getFullYear();
  const lama = tahun - m.angkatan;
  if (lama <= 4 && m.sks_lulus >= 120) prestasi.push('On track lulus tepat waktu');
  return prestasi;
}

function generatePesanMasalah(detail: DetailMahasiswa): string {
  const masalah: string[] = [];
  if (detail.ipk < 2.0) masalah.push('IPK yang sangat rendah yaitu ' + (detail.ipk||0).toFixed(2));
  else if (detail.ipk < 2.5) masalah.push('IPK yang rendah yaitu ' + (detail.ipk||0).toFixed(2));
  if (detail.jumlah_mk_diulang >= 3) masalah.push('terdapat ' + detail.jumlah_mk_diulang + ' mata kuliah yang harus diulang (' + detail.sks_mk_diulang + ' SKS)');
  const tahun = new Date().getFullYear();
  const lama = tahun - detail.angkatan;
  if (lama > 5) masalah.push('masa studi yang sudah ' + lama + ' tahun');
  if (detail.khs && detail.khs.length > 0) {
    const lastKhs = detail.khs[detail.khs.length - 1];
    if (lastKhs.ips < 2.0) masalah.push('IPS semester terakhir hanya ' + lastKhs.ips.toFixed(2));
  }

  const namaOrtu = detail.ayah?.nama || detail.ibu?.nama || 'Bapak/Ibu';
  const prodi = detail.prodi?.nama_prodi || 'Program Studi';
  const dosenPA = detail.dosen_penasehat ? (detail.dosen_penasehat.gelar_depan ? detail.dosen_penasehat.gelar_depan + ' ' : '') + detail.dosen_penasehat.nama + (detail.dosen_penasehat.gelar_belakang ? ', ' + detail.dosen_penasehat.gelar_belakang : '') : '';

  let pesan = 'Assalamualaikum Wr. Wb.\n\n';
  pesan += 'Yth. ' + namaOrtu + ',\n\n';
  pesan += 'Perkenalkan, kami dari ' + prodi + ' Universitas Muhammadiyah Makassar. ';
  pesan += 'Kami ingin menyampaikan informasi terkait perkembangan akademik putra/putri Bapak/Ibu, ';
  pesan += '*' + detail.nama + '* (NIM: ' + detail.nim + ', Angkatan ' + detail.angkatan + ').\n\n';
  pesan += 'Berdasarkan data akademik kami, terdapat beberapa hal yang perlu mendapat perhatian:\n';
  masalah.forEach((m, i) => { pesan += (i + 1) + '. ' + m.charAt(0).toUpperCase() + m.slice(1) + '\n'; });
  pesan += '\nKami sangat berharap Bapak/Ibu dapat memberikan motivasi dan dukungan kepada ' + detail.nama + ' agar dapat memperbaiki prestasi akademiknya.\n\n';
  if (dosenPA) pesan += 'Untuk konsultasi lebih lanjut, dapat menghubungi Dosen Penasehat Akademik: ' + dosenPA + '.\n\n';
  pesan += 'Terima kasih atas perhatian dan kerjasamanya.\n';
  pesan += 'Wassalamualaikum Wr. Wb.\n\n';
  pesan += '_Pesan otomatis dari Sistem Pelacakan Mahasiswa UNISMUH_';
  return pesan;
}

function generatePesanPrestasi(detail: DetailMahasiswa): string {
  const prestasi: string[] = [];
  if (detail.ipk >= 3.75) prestasi.push('meraih IPK Cum Laude yaitu ' + (detail.ipk||0).toFixed(2));
  else if (detail.ipk >= 3.5) prestasi.push('meraih IPK Sangat Baik yaitu ' + (detail.ipk||0).toFixed(2));
  if (detail.jumlah_mk_diulang === 0 && detail.sks_lulus >= 40) prestasi.push('berhasil lulus semua mata kuliah tanpa mengulang');
  if (detail.sks_lulus >= 120) prestasi.push('sudah menyelesaikan ' + detail.sks_lulus + ' SKS');

  const namaOrtu = detail.ayah?.nama || detail.ibu?.nama || 'Bapak/Ibu';
  const prodi = detail.prodi?.nama_prodi || 'Program Studi';
  const dosenPA = detail.dosen_penasehat ? (detail.dosen_penasehat.gelar_depan ? detail.dosen_penasehat.gelar_depan + ' ' : '') + detail.dosen_penasehat.nama + (detail.dosen_penasehat.gelar_belakang ? ', ' + detail.dosen_penasehat.gelar_belakang : '') : '';

  let pesan = 'Assalamualaikum Wr. Wb.\n\n';
  pesan += 'Yth. ' + namaOrtu + ',\n\n';
  pesan += 'Perkenalkan, kami dari ' + prodi + ' Universitas Muhammadiyah Makassar. ';
  pesan += 'Dengan bangga kami ingin menyampaikan kabar baik terkait perkembangan akademik putra/putri Bapak/Ibu, ';
  pesan += '*' + detail.nama + '* (NIM: ' + detail.nim + ', Angkatan ' + detail.angkatan + ').\n\n';
  pesan += 'Berikut pencapaian akademik yang membanggakan:\n';
  prestasi.forEach((p, i) => { pesan += (i + 1) + '. ' + p.charAt(0).toUpperCase() + p.slice(1) + '\n'; });
  pesan += '\nKami mengapresiasi dukungan Bapak/Ibu yang turut berkontribusi pada prestasi ini. ';
  pesan += 'Semoga ' + detail.nama + ' dapat mempertahankan dan meningkatkan prestasinya.\n\n';
  if (dosenPA) pesan += 'Dosen Penasehat Akademik: ' + dosenPA + '.\n\n';
  pesan += 'Terima kasih.\n';
  pesan += 'Wassalamualaikum Wr. Wb.\n\n';
  pesan += '_Pesan otomatis dari Sistem Pelacakan Mahasiswa UNISMUH_';
  return pesan;
}

function formatPhone(hp: string): string {
  if (!hp) return '';
  let clean = hp.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) clean = '62' + clean.substring(1);
  if (!clean.startsWith('62')) clean = '62' + clean;
  return clean;
}

export default function PeninjauanMahasiswa() {
  const [allData, setAllData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAngkatan, setSelectedAngkatan] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('bermasalah');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<DetailMahasiswa | null>(null);
  const [selectedMhs, setSelectedMhs] = useState<Mahasiswa | null>(null);
  // Bulk contact states
  const [checkedNims, setCheckedNims] = useState<Set<string>>(new Set());
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkContacts, setBulkContacts] = useState<Array<{ nim: string; nama: string; angkatan: number; masalah: string[]; kontakList: Array<{ label: string; nama: string | undefined; hp: string; pesan: string }> }>>([]);
  const [bulkSentNims, setBulkSentNims] = useState<Set<string>>(new Set());
  const PER_PAGE = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch('http://localhost:8080/api/v1/mahasiswa?limit=10000', { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Server error: ' + res.status);
      const result = await res.json();
      setAllData(result.data || []);
    } catch (err) {
      setAllData([]);
      setError(err instanceof Error && err.name === 'AbortError'
        ? 'Koneksi timeout. Pastikan backend server berjalan.'
        : 'Gagal memuat data. Pastikan backend server berjalan di port 8080.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const bermasalah = useMemo(() => {
    return allData.filter(m => {
      if (m.status === 'Alumni' || m.status === 'Tidak Aktif') return false;
      return getMasalah(m).length > 0;
    }).sort((a, b) => getMasalah(b).length - getMasalah(a).length || a.ipk - b.ipk);
  }, [allData]);

  const berprestasi = useMemo(() => {
    return allData.filter(m => {
      return getPrestasi(m).length > 0;
    }).sort((a, b) => b.ipk - a.ipk);
  }, [allData]);

  const currentList = activeTab === 'bermasalah' ? bermasalah : berprestasi;

  const filteredList = useMemo(() => {
    let filtered = currentList;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(m => m.nama.toLowerCase().includes(q) || m.nim.includes(searchTerm));
    }
    if (selectedAngkatan) filtered = filtered.filter(m => m.angkatan.toString() === selectedAngkatan);
    return filtered;
  }, [currentList, searchTerm, selectedAngkatan]);

  const totalPages = Math.ceil(filteredList.length / PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredList.slice(start, start + PER_PAGE);
  }, [filteredList, currentPage, PER_PAGE]);

  useEffect(() => { setCurrentPage(1); setCheckedNims(new Set()); }, [searchTerm, selectedAngkatan, activeTab]);
  const uniqueAngkatan = useMemo(() => [...new Set(allData.map(m => m.angkatan))].sort((a, b) => b - a), [allData]);

  // Bulk selection handlers
  const isAllPageChecked = paginatedData.length > 0 && paginatedData.every(m => checkedNims.has(m.nim));
  const isAllFilteredChecked = filteredList.length > 0 && filteredList.every(m => checkedNims.has(m.nim));

  const toggleCheck = (nim: string) => {
    setCheckedNims(prev => {
      const next = new Set(prev);
      if (next.has(nim)) next.delete(nim); else next.add(nim);
      return next;
    });
  };

  const toggleAllPage = () => {
    setCheckedNims(prev => {
      const next = new Set(prev);
      if (isAllPageChecked) {
        paginatedData.forEach(m => next.delete(m.nim));
      } else {
        paginatedData.forEach(m => next.add(m.nim));
      }
      return next;
    });
  };

  const selectAllFiltered = () => {
    setCheckedNims(new Set(filteredList.map(m => m.nim)));
  };

  const clearSelection = () => setCheckedNims(new Set());

  // Bulk contact handler
  const handleBulkContact = async () => {
    const selectedList = filteredList.filter(m => checkedNims.has(m.nim));
    if (selectedList.length === 0) return;
    setBulkModalOpen(true);
    setBulkLoading(true);
    setBulkContacts([]);
    setBulkSentNims(new Set());

    const results: typeof bulkContacts = [];
    // Fetch details in batches of 5 to avoid overloading
    for (let i = 0; i < selectedList.length; i += 5) {
      const batch = selectedList.slice(i, i + 5);
      const promises = batch.map(async (m) => {
        try {
          const res = await fetch(`http://localhost:8080/api/v1/mahasiswa/${m.nim}/detail`);
          if (!res.ok) return null;
          const detail: DetailMahasiswa = await res.json();
          const pesan = activeTab === 'bermasalah' ? generatePesanMasalah(detail) : generatePesanPrestasi(detail);
          const kontakList = [
            { label: 'Ayah', nama: detail.ayah?.nama, hp: detail.ayah?.hp || '', pesan },
            { label: 'Ibu', nama: detail.ibu?.nama, hp: detail.ibu?.hp || '', pesan },
            { label: 'Wali', nama: detail.wali?.nama, hp: detail.wali?.hp || '', pesan },
            { label: 'Mahasiswa', nama: detail.nama, hp: detail.hp || '', pesan },
          ].filter(k => k.hp && k.hp.trim() !== '');
          return {
            nim: m.nim,
            nama: m.nama,
            angkatan: m.angkatan,
            masalah: activeTab === 'bermasalah' ? getMasalah(m) : getPrestasi(m),
            kontakList,
          };
        } catch { return null; }
      });
      const batchResults = await Promise.all(promises);
      batchResults.forEach(r => { if (r) results.push(r); });
      setBulkContacts([...results]);
    }
    setBulkLoading(false);
  };

  const handleBulkWA = (hp: string, pesan: string, nim: string) => {
    const formatted = formatPhone(hp);
    const url = `https://wa.me/${formatted}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
    setBulkSentNims(prev => new Set(prev).add(nim));
  };

  const handleSendAllWA = () => {
    bulkContacts.forEach((contact, idx) => {
      if (contact.kontakList.length > 0) {
        const primaryKontak = contact.kontakList.find(k => k.label === 'Ayah' || k.label === 'Ibu') || contact.kontakList[0];
        setTimeout(() => {
          handleBulkWA(primaryKontak.hp, primaryKontak.pesan, contact.nim);
        }, idx * 800); // Delay 800ms between opens to avoid browser blocking
      }
    });
  };

  const handleTindakLanjut = async (m: Mahasiswa) => {
    setSelectedMhs(m);
    setModalOpen(true);
    setModalLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/mahasiswa/${m.nim}/detail`);
      if (!res.ok) throw new Error('Gagal');
      setSelectedDetail(await res.json());
    } catch { setSelectedDetail(null); }
    finally { setModalLoading(false); }
  };

  const pesan = selectedDetail
    ? (activeTab === 'bermasalah' ? generatePesanMasalah(selectedDetail) : generatePesanPrestasi(selectedDetail))
    : '';

  const kontakList = selectedDetail ? [
    { label: 'Ayah', nama: selectedDetail.ayah?.nama, hp: selectedDetail.ayah?.hp },
    { label: 'Ibu', nama: selectedDetail.ibu?.nama, hp: selectedDetail.ibu?.hp },
    { label: 'Wali', nama: selectedDetail.wali?.nama, hp: selectedDetail.wali?.hp },
    { label: 'Mahasiswa', nama: selectedDetail.nama, hp: selectedDetail.hp },
  ].filter(k => k.hp && k.hp.trim() !== '') : [];

  const handleWA = (hp: string) => {
    const formatted = formatPhone(hp);
    const url = `https://wa.me/${formatted}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pesan);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data mahasiswa...</p>
        </div>
      </div>
    );
  }

  if (error && allData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium mb-2">Gagal Memuat Data</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <ShieldExclamationIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Peninjauan & Tindak Lanjut</h1>
              <p className="text-sm text-blue-600">Monitoring mahasiswa bermasalah & berprestasi dengan tindak lanjut otomatis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-900 mb-6">
          <ChevronLeftIcon className="h-5 w-5 mr-1" /> Kembali ke Dashboard
        </Link>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-50 rounded-xl border border-red-200 p-6 flex items-center space-x-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="h-7 w-7 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Mahasiswa Bermasalah</p>
              <p className="text-3xl font-bold text-red-800">{bermasalah.length}</p>
              <p className="text-xs text-red-500">IPK rendah, MK diulang, studi lama</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-200 p-6 flex items-center space-x-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <StarIcon className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Mahasiswa Berprestasi</p>
              <p className="text-3xl font-bold text-green-800">{berprestasi.length}</p>
              <p className="text-xs text-green-500">IPK tinggi, tanpa MK diulang</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-6">
          <button onClick={() => setActiveTab('bermasalah')} className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === 'bermasalah' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>
            <ExclamationTriangleIcon className="h-4 w-4 inline mr-2" />Bermasalah ({bermasalah.length})
          </button>
          <button onClick={() => setActiveTab('berprestasi')} className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === 'berprestasi' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>
            <StarIcon className="h-4 w-4 inline mr-2" />Berprestasi ({berprestasi.length})
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input type="text" placeholder="Cari nama atau NIM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={selectedAngkatan} onChange={(e) => setSelectedAngkatan(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Semua Angkatan</option>
              {uniqueAngkatan.map(a => <option key={a} value={a.toString()}>{a}</option>)}
            </select>
          </div>
          <p className="mt-3 text-sm text-gray-500">Menampilkan <span className="font-bold text-blue-900">{filteredList.length}</span> mahasiswa</p>
        </div>

        {/* Bulk Contact Banner */}
        <div className={`rounded-xl border-2 border-dashed p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${activeTab === 'bermasalah' ? 'border-orange-300 bg-linear-to-r from-orange-50 via-amber-50 to-yellow-50' : 'border-teal-300 bg-linear-to-r from-teal-50 via-emerald-50 to-green-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center animate-pulse ${activeTab === 'bermasalah' ? 'bg-orange-200' : 'bg-teal-200'}`}>
              <ChatBubbleLeftRightIcon className={`h-6 w-6 ${activeTab === 'bermasalah' ? 'text-orange-700' : 'text-teal-700'}`} />
            </div>
            <div>
              <p className={`font-bold text-sm ${activeTab === 'bermasalah' ? 'text-orange-800' : 'text-teal-800'}`}>
                Hubungi Banyak Mahasiswa Sekaligus!
              </p>
              <p className={`text-xs ${activeTab === 'bermasalah' ? 'text-orange-600' : 'text-teal-600'}`}>
                Centang mahasiswa di tabel lalu klik tombol &quot;Hubungi Semua via WA&quot; untuk mengirim pesan WhatsApp otomatis ke mahasiswa & orang tua.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {checkedNims.size > 0 ? (
              <button
                onClick={handleBulkContact}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-lg transition-all hover:scale-105 ${activeTab === 'bermasalah' ? 'bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' : 'bg-linear-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600'}`}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Hubungi {checkedNims.size} Mahasiswa
              </button>
            ) : (
              <button
                onClick={selectAllFiltered}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-lg transition-all hover:scale-105 ${activeTab === 'bermasalah' ? 'bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' : 'bg-linear-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600'}`}
              >
                <UsersIcon className="h-5 w-5" />
                Pilih Semua ({filteredList.length}) & Hubungi
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${activeTab === 'bermasalah' ? 'bg-red-50' : 'bg-green-50'}`}>
                  <th className="px-3 py-3 text-center w-14">
                    <div className="flex flex-col items-center gap-0.5">
                      <input type="checkbox" checked={isAllPageChecked} onChange={toggleAllPage} className="h-5 w-5 rounded border-2 border-blue-400 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" />
                      <span className="text-[10px] text-blue-600 font-semibold leading-tight">Pilih</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Nama</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">NIM</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Angkatan</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Jurusan</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">IPK</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">MK Diulang</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">SKS MK Diulang</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">{activeTab === 'bermasalah' ? 'Masalah' : 'Prestasi'}</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-800">Tindak Lanjut</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={12} className="px-4 py-8 text-center text-gray-500">Tidak ada data</td></tr>
                ) : (
                  paginatedData.map((m, idx) => {
                    const issues = activeTab === 'bermasalah' ? getMasalah(m) : getPrestasi(m);
                    const isChecked = checkedNims.has(m.nim);
                    return (
                      <tr key={m.nim} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isChecked ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : ''}`}>
                        <td className="px-3 py-3 text-center">
                          <input type="checkbox" checked={isChecked} onChange={() => toggleCheck(m.nim)} className="h-5 w-5 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" />
                        </td>
                        <td className="px-4 py-3 text-gray-900">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{m.nama}</td>
                        <td className="px-4 py-3 text-gray-700">{m.nim}</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{m.angkatan}</span></td>
                        <td className="px-4 py-3 text-gray-700 text-xs">{m.jurusan}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(m.ipk||0) >= 3.5 ? 'bg-green-100 text-green-800' : (m.ipk||0) >= 2.5 ? 'bg-blue-100 text-blue-800' : (m.ipk||0) >= 2.0 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                            {(m.ipk||0).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.jumlah_mk_diulang > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{m.jumlah_mk_diulang}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.sks_mk_diulang > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{m.sks_mk_diulang}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {issues.map((issue, i) => (
                              <span key={i} className={`px-2 py-0.5 rounded text-xs font-medium ${activeTab === 'bermasalah' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{issue}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleTindakLanjut(m)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${activeTab === 'bermasalah' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                            <PhoneIcon className="h-3.5 w-3.5 inline mr-1" />Hubungi
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating Selection Bar */}
        {checkedNims.size > 0 && (
          <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-bounce-once">
            <div className="bg-linear-to-r from-blue-800 to-blue-950 text-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] px-6 py-4 flex items-center gap-4 ring-2 ring-blue-400/50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <UsersIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-base font-bold block leading-tight">{checkedNims.size} mahasiswa dipilih</span>
                  <span className="text-xs text-blue-300">Siap dihubungi via WhatsApp</span>
                </div>
              </div>
              <div className="h-8 w-px bg-blue-600"></div>
              {!isAllFilteredChecked && (
                <button onClick={selectAllFiltered} className="text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors">
                  Pilih semua ({filteredList.length})
                </button>
              )}
              <button onClick={clearSelection} className="text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors">
                Batal
              </button>
              <button
                onClick={handleBulkContact}
                className="bg-linear-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg hover:scale-105"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Hubungi Semua via WA
              </button>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100">Sebelumnya</button>
            <span className="text-sm text-gray-600">Halaman {currentPage} dari {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-100">Selanjutnya</button>
          </div>
        )}
      </main>

      {/* Modal Tindak Lanjut */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`px-6 py-4 border-b flex items-center justify-between ${activeTab === 'bermasalah' ? 'bg-red-50' : 'bg-green-50'}`}>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Tindak Lanjut - {selectedMhs?.nama}</h2>
                <p className="text-sm text-gray-600">{selectedMhs?.nim} | Angkatan {selectedMhs?.angkatan}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-900">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {modalLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mx-auto"></div>
                <p className="mt-4 text-gray-500">Memuat data...</p>
              </div>
            ) : !selectedDetail ? (
              <div className="p-12 text-center text-red-500">Gagal memuat data detail mahasiswa</div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Kontak Orang Tua */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-blue-600" />Kontak yang Dapat Dihubungi
                  </h3>
                  {kontakList.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Tidak ada nomor kontak tersedia</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {kontakList.map((k, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                          <div>
                            <p className="text-xs text-gray-500">{k.label}</p>
                            <p className="text-sm font-medium text-gray-900">{k.nama || '-'}</p>
                            <p className="text-sm text-blue-600">{k.hp}</p>
                          </div>
                          <button onClick={() => handleWA(k.hp!)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg" title="Kirim WhatsApp">
                            <ChatBubbleLeftRightIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview Pesan */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 text-blue-600" />Preview Pesan Otomatis
                    </h3>
                    <button onClick={handleCopy} className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-50">Salin Pesan</button>
                  </div>
                  <div className={`rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed border ${activeTab === 'bermasalah' ? 'bg-red-50 border-red-200 text-gray-800' : 'bg-green-50 border-green-200 text-gray-800'}`}>
                    {pesan}
                  </div>
                </div>

                {/* Detail Link */}
                <div className="pt-2 border-t flex justify-between items-center">
                  <Link href={`/detail-mahasiswa?nim=${selectedDetail.nim}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Lihat Detail Lengkap &rarr;</Link>
                  <Link href={`/analisis-mahasiswa?nim=${selectedDetail.nim}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Lihat Analisis &rarr;</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Bulk Contact Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${activeTab === 'bermasalah' ? 'bg-red-50' : 'bg-green-50'}`}>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <UsersIcon className="h-5 w-5" />
                  Hubungi {checkedNims.size} Mahasiswa Sekaligus
                </h2>
                <p className="text-sm text-gray-600">Kirim pesan WhatsApp ke orang tua/wali mahasiswa {activeTab === 'bermasalah' ? 'bermasalah' : 'berprestasi'}</p>
              </div>
              <button onClick={() => setBulkModalOpen(false)} className="text-gray-500 hover:text-gray-900">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {bulkLoading && (
              <div className="px-6 py-3 bg-blue-50 border-b flex items-center gap-3 shrink-0">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                <p className="text-sm text-blue-800">Memuat data kontak... ({bulkContacts.length}/{checkedNims.size})</p>
              </div>
            )}

            {!bulkLoading && bulkContacts.length > 0 && (
              <div className="px-6 py-3 bg-green-50 border-b flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800">
                    <span className="font-bold">{bulkContacts.length}</span> data kontak berhasil dimuat
                    {bulkSentNims.size > 0 && <span className="ml-2">• <span className="font-bold text-blue-700">{bulkSentNims.size}</span> sudah dikirim</span>}
                  </p>
                </div>
                <button
                  onClick={handleSendAllWA}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  Kirim Semua WA Sekaligus
                </button>
              </div>
            )}

            <div className="overflow-y-auto flex-1 p-6">
              {bulkContacts.length === 0 && !bulkLoading ? (
                <div className="text-center py-12 text-gray-500">Tidak ada data kontak yang ditemukan</div>
              ) : (
                <div className="space-y-4">
                  {bulkContacts.map((contact, idx) => (
                    <div key={contact.nim} className={`rounded-xl border p-4 ${bulkSentNims.has(contact.nim) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{contact.nama}</p>
                            <p className="text-xs text-gray-500">{contact.nim} • Angkatan {contact.angkatan}</p>
                          </div>
                        </div>
                        {bulkSentNims.has(contact.nim) && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            <CheckIcon className="h-3 w-3" />Terkirim
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {contact.masalah.map((m, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded text-xs font-medium ${activeTab === 'bermasalah' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{m}</span>
                        ))}
                      </div>
                      {contact.kontakList.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">Tidak ada nomor kontak</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {contact.kontakList.map((k, i) => (
                            <div key={i} className="flex items-center justify-between bg-white rounded-lg p-2.5 border border-gray-100">
                              <div className="min-w-0">
                                <p className="text-[10px] text-gray-400 uppercase">{k.label}</p>
                                <p className="text-xs font-medium text-gray-900 truncate">{k.nama || '-'}</p>
                                <p className="text-xs text-blue-600">{k.hp}</p>
                              </div>
                              <button
                                onClick={() => handleBulkWA(k.hp, k.pesan, contact.nim)}
                                className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg shrink-0 ml-2"
                                title={`WhatsApp ${k.label}`}
                              >
                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t bg-gray-50 shrink-0 flex items-center justify-between">
              <p className="text-xs text-gray-500">Pesan otomatis dikirim via WhatsApp ke kontak orang tua/wali</p>
              <button onClick={() => setBulkModalOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
