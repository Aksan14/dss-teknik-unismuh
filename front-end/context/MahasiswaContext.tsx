'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface MahasiswaData {
  // Identitas Dasar
  nim: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  no_hp: string;
  email: string;
  
  // Data Akademik
  jurusan: string;
  fakultas: string;
  angkatan: number;
  semester: number;
  status: string;
  dosen_pa: string;
  
  // Data Nilai & Kehadiran
  ipk: number;
  kehadiran: number;
  sks_lulus: number;
  total_sks_wajib: number;
  mk_lulus: number;
  mk_mengulang: number;
  lama_studi: number;
  
  // Data Tambahan
  beasiswa: string | null;
  organisasi: string[];
  prestasi: string[];
  catatan_khusus: string | null;
  
  // Data Per Semester
  semester_data: SemesterDetail[];
}

interface SemesterDetail {
  semester: number;
  ips: number;
  sks_diambil: number;
  sks_lulus: number;
  mk_lulus: number;
  mk_mengulang: number;
}

interface HasilAnalisis {
  nilai_saw: number;
  kategori: 'Berprestasi' | 'Normal' | 'Berisiko';
  rekomendasi: string[];
  rekomendasi_sks: number;
  status_kelulusan: string;
}

interface MahasiswaContextType {
  mahasiswaData: MahasiswaData | null;
  hasilAnalisis: HasilAnalisis | null;
  isLoading: boolean;
  error: string | null;
  cariMahasiswa: (nama: string, nim: string) => Promise<boolean>;
  resetData: () => void;
}

const MahasiswaContext = createContext<MahasiswaContextType | undefined>(undefined);

// Data dummy untuk simulasi (akan diganti dengan API call)
const DUMMY_MAHASISWA: MahasiswaData[] = [
  {
    nim: '105841100420',
    nama: 'Ahmad Fauzi Rahman',
    tempat_lahir: 'Makassar',
    tanggal_lahir: '2002-05-15',
    alamat: 'Jl. Sultan Alauddin No. 259, Makassar',
    no_hp: '081234567890',
    email: 'ahmadfauzi@unismuh.ac.id',
    jurusan: 'Teknik Informatika',
    fakultas: 'Fakultas Teknik',
    angkatan: 2020,
    semester: 8,
    status: 'Aktif',
    dosen_pa: 'Dr. Ir. Muhammad Yusuf, M.T.',
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
    semester_data: [
      { semester: 1, ips: 3.65, sks_diambil: 20, sks_lulus: 20, mk_lulus: 8, mk_mengulang: 0 },
      { semester: 2, ips: 3.70, sks_diambil: 22, sks_lulus: 22, mk_lulus: 9, mk_mengulang: 0 },
      { semester: 3, ips: 3.80, sks_diambil: 22, sks_lulus: 22, mk_lulus: 9, mk_mengulang: 0 },
      { semester: 4, ips: 3.75, sks_diambil: 22, sks_lulus: 22, mk_lulus: 9, mk_mengulang: 0 },
      { semester: 5, ips: 3.85, sks_diambil: 20, sks_lulus: 20, mk_lulus: 8, mk_mengulang: 0 },
      { semester: 6, ips: 3.70, sks_diambil: 18, sks_lulus: 18, mk_lulus: 7, mk_mengulang: 0 },
      { semester: 7, ips: 3.80, sks_diambil: 8, sks_lulus: 8, mk_lulus: 2, mk_mengulang: 0 },
      { semester: 8, ips: 0, sks_diambil: 0, sks_lulus: 0, mk_lulus: 0, mk_mengulang: 0 },
    ]
  },
  {
    nim: '105841100421',
    nama: 'Siti Nurhaliza',
    tempat_lahir: 'Gowa',
    tanggal_lahir: '2001-08-20',
    alamat: 'Jl. Poros Malino No. 123, Gowa',
    no_hp: '082345678901',
    email: 'sitinurhaliza@unismuh.ac.id',
    jurusan: 'Teknik Informatika',
    fakultas: 'Fakultas Teknik',
    angkatan: 2020,
    semester: 8,
    status: 'Aktif',
    dosen_pa: 'Dr. Hj. Fatimah, M.Kom',
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
    catatan_khusus: 'Perlu bimbingan tambahan untuk mata kuliah pemrograman',
    semester_data: [
      { semester: 1, ips: 3.20, sks_diambil: 20, sks_lulus: 18, mk_lulus: 7, mk_mengulang: 1 },
      { semester: 2, ips: 3.30, sks_diambil: 22, sks_lulus: 20, mk_lulus: 8, mk_mengulang: 1 },
      { semester: 3, ips: 3.25, sks_diambil: 22, sks_lulus: 20, mk_lulus: 8, mk_mengulang: 1 },
      { semester: 4, ips: 3.35, sks_diambil: 22, sks_lulus: 22, mk_lulus: 9, mk_mengulang: 0 },
      { semester: 5, ips: 3.20, sks_diambil: 20, sks_lulus: 20, mk_lulus: 8, mk_mengulang: 0 },
      { semester: 6, ips: 3.30, sks_diambil: 18, sks_lulus: 18, mk_lulus: 7, mk_mengulang: 0 },
      { semester: 7, ips: 3.00, sks_diambil: 6, sks_lulus: 2, mk_lulus: 1, mk_mengulang: 0 },
      { semester: 8, ips: 0, sks_diambil: 0, sks_lulus: 0, mk_lulus: 0, mk_mengulang: 0 },
    ]
  },
  {
    nim: '105841100422',
    nama: 'Muhammad Rizky Pratama',
    tempat_lahir: 'Makassar',
    tanggal_lahir: '2002-01-10',
    alamat: 'Jl. Urip Sumoharjo No. 45, Makassar',
    no_hp: '083456789012',
    email: 'rizkypratama@unismuh.ac.id',
    jurusan: 'Teknik Informatika',
    fakultas: 'Fakultas Teknik',
    angkatan: 2020,
    semester: 9,
    status: 'Aktif',
    dosen_pa: 'Dr. Ir. Muhammad Yusuf, M.T.',
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
    catatan_khusus: 'Mahasiswa dengan status peringatan akademik. Perlu perhatian khusus dari dosen PA.',
    semester_data: [
      { semester: 1, ips: 2.60, sks_diambil: 20, sks_lulus: 14, mk_lulus: 5, mk_mengulang: 3 },
      { semester: 2, ips: 2.50, sks_diambil: 18, sks_lulus: 14, mk_lulus: 5, mk_mengulang: 2 },
      { semester: 3, ips: 2.40, sks_diambil: 18, sks_lulus: 14, mk_lulus: 6, mk_mengulang: 1 },
      { semester: 4, ips: 2.55, sks_diambil: 18, sks_lulus: 16, mk_lulus: 6, mk_mengulang: 1 },
      { semester: 5, ips: 2.30, sks_diambil: 16, sks_lulus: 12, mk_lulus: 5, mk_mengulang: 1 },
      { semester: 6, ips: 2.45, sks_diambil: 16, sks_lulus: 14, mk_lulus: 6, mk_mengulang: 0 },
      { semester: 7, ips: 2.50, sks_diambil: 16, sks_lulus: 14, mk_lulus: 7, mk_mengulang: 0 },
      { semester: 8, ips: 0, sks_diambil: 0, sks_lulus: 0, mk_lulus: 0, mk_mengulang: 0 },
      { semester: 9, ips: 0, sks_diambil: 0, sks_lulus: 0, mk_lulus: 0, mk_mengulang: 0 },
    ]
  }
];

function hitungAnalisis(data: MahasiswaData): HasilAnalisis {
  // Bobot SAW (tanpa kehadiran)
  const bobot = {
    ipk: 0.35,
    sks: 0.30,
    mk_mengulang: 0.20,
    lama_studi: 0.15
  };

  // Normalisasi
  const normIpk = data.ipk / 4.0;
  const normSks = data.sks_lulus / data.total_sks_wajib;
  const normMk = data.mk_mengulang === 0 ? 1.0 : 1.0 / (1 + data.mk_mengulang);
  const normLama = Math.min(8 / data.lama_studi, 1.0);

  // Nilai SAW
  const nilaiSaw = (
    normIpk * bobot.ipk +
    normSks * bobot.sks +
    normMk * bobot.mk_mengulang +
    normLama * bobot.lama_studi
  );

  // Kategori
  let kategori: 'Berprestasi' | 'Normal' | 'Berisiko';
  if (nilaiSaw >= 0.75) kategori = 'Berprestasi';
  else if (nilaiSaw >= 0.50) kategori = 'Normal';
  else kategori = 'Berisiko';

  // Rekomendasi
  const rekomendasi: string[] = [];
  let rekomendasiSks = 20;

  if (data.ipk >= 3.5) {
    rekomendasi.push('IPK sangat baik! Dapat mengambil beban SKS maksimal (24 SKS).');
    rekomendasiSks = 24;
  } else if (data.ipk >= 3.0) {
    rekomendasi.push('IPK baik. Dapat mengambil 22 SKS.');
    rekomendasiSks = 22;
  } else if (data.ipk >= 2.5) {
    rekomendasi.push('IPK cukup. Disarankan mengambil 18-20 SKS.');
    rekomendasiSks = 20;
  } else {
    rekomendasi.push('IPK perlu ditingkatkan. Batasi beban SKS (15-18 SKS) dan fokus pada perbaikan nilai.');
    rekomendasiSks = 16;
  }

  if (data.mk_mengulang > 0) {
    rekomendasi.push(`Terdapat ${data.mk_mengulang} mata kuliah yang perlu mengulang. Prioritaskan untuk mengulang mata kuliah tersebut.`);
  }

  const sksSisa = data.total_sks_wajib - data.sks_lulus;
  if (sksSisa > 0) {
    rekomendasi.push(`Masih tersisa ${sksSisa} SKS untuk menyelesaikan studi.`);
  }

  if (data.lama_studi > 8) {
    rekomendasi.push('Lama studi melebihi batas normal. Perlu percepatan penyelesaian studi.');
  }

  // Status Kelulusan
  let statusKelulusan = '';
  const persenSks = (data.sks_lulus / data.total_sks_wajib) * 100;
  if (persenSks >= 90) {
    statusKelulusan = 'Hampir Lulus - Tinggal menyelesaikan tugas akhir';
  } else if (persenSks >= 75) {
    statusKelulusan = 'Tahap Akhir - Fokus pada penyelesaian SKS wajib';
  } else if (persenSks >= 50) {
    statusKelulusan = 'Pertengahan - Masih dalam progres normal';
  } else {
    statusKelulusan = 'Tahap Awal - Perlu konsistensi dalam perkuliahan';
  }

  return {
    nilai_saw: nilaiSaw,
    kategori,
    rekomendasi,
    rekomendasi_sks: rekomendasiSks,
    status_kelulusan: statusKelulusan
  };
}

export function MahasiswaProvider({ children }: { children: ReactNode }) {
  const [mahasiswaData, setMahasiswaData] = useState<MahasiswaData | null>(null);
  const [hasilAnalisis, setHasilAnalisis] = useState<HasilAnalisis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cariMahasiswa = async (nama: string, nim: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulasi API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Cari di data dummy
      const found = DUMMY_MAHASISWA.find(
        m => m.nim === nim && m.nama.toLowerCase().includes(nama.toLowerCase())
      );

      if (found) {
        setMahasiswaData(found);
        setHasilAnalisis(hitungAnalisis(found));
        setIsLoading(false);
        return true;
      }

      // Jika tidak ditemukan di dummy, coba fetch dari backend
      try {
        const response = await fetch(`http://localhost:8080/mahasiswa/${nim}`);
        if (response.ok) {
          const data = await response.json();
          setMahasiswaData(data);
          setHasilAnalisis(hitungAnalisis(data));
          setIsLoading(false);
          return true;
        }
      } catch {
        // Backend tidak tersedia, lanjut dengan error
      }

      setError('Mahasiswa tidak ditemukan. Pastikan nama dan NIM sudah benar.');
      setIsLoading(false);
      return false;
    } catch (err) {
      setError('Terjadi kesalahan saat mencari data mahasiswa.');
      setIsLoading(false);
      return false;
    }
  };

  const resetData = () => {
    setMahasiswaData(null);
    setHasilAnalisis(null);
    setError(null);
  };

  return (
    <MahasiswaContext.Provider value={{ 
      mahasiswaData, 
      hasilAnalisis, 
      isLoading, 
      error, 
      cariMahasiswa, 
      resetData 
    }}>
      {children}
    </MahasiswaContext.Provider>
  );
}

export function useMahasiswa() {
  const context = useContext(MahasiswaContext);
  if (context === undefined) {
    throw new Error('useMahasiswa must be used within a MahasiswaProvider');
  }
  return context;
}
