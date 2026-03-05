'use client';

import { createContext, ReactNode, useContext, useState, useCallback } from 'react';

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Types matching the new simplified API structure
export interface MahasiswaAPI {
  nim: string;
  nama: string;
  ipk: number;
  angkatan: number;
  sks_total: number;
  sks_diambil: number;
  sks_lulus: number;
  matakuliah_lulus: number;
  jumlah_mk_diulang: number;
  sks_mk_diulang: number;
  status: string;
  kategori: string;
  jurusan: string;
  jurusan: string;
  jurusan: string;
}

interface MahasiswaListResponse {
  data: MahasiswaAPI[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

interface ListResponse {
  data: MahasiswaAPI[];
  total: number;
}

export interface StatsAPI {
  total_mahasiswa: number;
  mahasiswa_aktif: number;
  mahasiswa_tidak_aktif: number;
  alumni: number;
  berprestasi: number;
  per_angkatan: Record<string, number>;
  rata_rata_ipk: number;
}

export interface HasilSAWAPI {
  nim: string;
  nama: string;
  ipk: number;
  sks_total: number;
  sks_diambil: number;
  sks_lulus: number;
  matakuliah_lulus: number;
  jumlah_mk_diulang: number;
  sks_mk_diulang: number;
  angkatan: number;
  nilai_saw: number;
  kategori: string;
  jurusan: string;
  jurusan: string;
  jurusan: string;
  ranking: number;
  jurusan: string;
  jurusan: string;
  jurusan: string;
}

interface SAWResponse {
  data: HasilSAWAPI[];
  total: number;
}

// Legacy interface for backward compatibility with existing pages
export interface MahasiswaData {
  nim: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  no_hp: string;
  email: string;
  jurusan: string;
  fakultas: string;
  angkatan: number;
  semester: number;
  status: string;
  dosen_pa: string;
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

export interface HasilAnalisis {
  nilai_saw: number;
  kategori: 'Berprestasi' | 'Normal' | 'Berisiko';
  rekomendasi: string[];
  rekomendasi_sks: number;
  status_kelulusan: string;
}

interface FetchParams {
  limit?: number;
  offset?: number;
}

interface MahasiswaContextType {
  // Legacy support
  mahasiswaData: MahasiswaData | null;
  hasilAnalisis: HasilAnalisis | null;
  isLoading: boolean;
  error: string | null;
  cariMahasiswa: (nama: string, nim: string) => Promise<boolean>;
  resetData: () => void;
  
  // New API functions
  mahasiswaList: MahasiswaAPI[];
  stats: StatsAPI | null;
  hasilSAW: HasilSAWAPI[];
  pagination: { total: number; limit: number; offset: number } | null;
  fetchMahasiswaAll: (params?: FetchParams) => Promise<void>;
  fetchMahasiswaAktif: () => Promise<void>;
  fetchMahasiswaTidakAktif: () => Promise<void>;
  fetchMahasiswaAlumni: () => Promise<void>;
  fetchMahasiswaBerprestasi: () => Promise<void>;
  fetchMahasiswaBeasiswa: () => Promise<void>;
  fetchMahasiswaByAngkatan: (angkatan: number) => Promise<void>;
  fetchMahasiswaByNIM: (nim: string) => Promise<MahasiswaAPI | null>;
  searchMahasiswa: (query: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  prosesSAW: () => Promise<void>;
}

const MahasiswaContext = createContext<MahasiswaContextType | undefined>(undefined);

// Helper function to build query string
function buildQueryString(params?: FetchParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.offset) searchParams.append('offset', params.offset.toString());
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// Convert API data to legacy MahasiswaData format
function convertToLegacyFormat(api: MahasiswaAPI): MahasiswaData {
  const currentYear = new Date().getFullYear();
  const yearsDiff = currentYear - api.angkatan;
  const estimatedSemester = Math.min(yearsDiff * 2 + 1, 14);
  
  return {
    nim: api.nim,
    nama: api.nama,
    tempat_lahir: '-',
    tanggal_lahir: '-',
    alamat: '-',
    no_hp: '-',
    email: '-',
    jurusan: 'Teknik Informatika',
    fakultas: 'Fakultas Teknik',
    angkatan: api.angkatan,
    semester: estimatedSemester,
    status: api.status,
    dosen_pa: '-',
    ipk: api.ipk,
    kehadiran: 0,
    sks_lulus: api.sks_lulus,
    total_sks_wajib: api.sks_total || 144,
    mk_lulus: api.matakuliah_lulus,
    mk_mengulang: api.jumlah_mk_diulang,
    lama_studi: estimatedSemester,
    beasiswa: null,
    organisasi: [],
    prestasi: api.ipk >= 3.5 ? ['Berprestasi Akademik'] : [],
    catatan_khusus: null,
    semester_data: []
  };
}

// Calculate analysis from API data (5 criteria matching backend SAW)
function hitungAnalisisFromAPI(data: MahasiswaAPI): HasilAnalisis {
  // 5 criteria: IPK(30% benefit), SKS Lulus(20% benefit), MK Lulus(15% benefit),
  //             MK Diulang(20% cost), SKS MK Diulang(15% cost)
  const totalSksWajib = data.sks_total || 144;
  const maxMK = 60; // reference max for normalization

  // Normalized values (0-1)
  const normIpk = data.ipk / 4.0;
  const normSksLulus = Math.min(data.sks_lulus / totalSksWajib, 1);
  const normMkLulus = Math.min(data.matakuliah_lulus / maxMK, 1);
  // Cost criteria: lower is better -> invert
  const normMkDiulang = data.jumlah_mk_diulang > 0 ? 1 - Math.min(data.jumlah_mk_diulang / 10, 1) : 1;
  const normSksMkDiulang = data.sks_mk_diulang > 0 ? 1 - Math.min(data.sks_mk_diulang / 30, 1) : 1;

  const nilaiSaw = normIpk * 0.30 + normSksLulus * 0.20 + normMkLulus * 0.15 +
                   normMkDiulang * 0.20 + normSksMkDiulang * 0.15;

  let kategori: 'Berprestasi' | 'Normal' | 'Berisiko';
  if (nilaiSaw >= 0.75) kategori = 'Berprestasi';
  else if (nilaiSaw >= 0.50) kategori = 'Normal';
  else kategori = 'Berisiko';

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

  const sksSisa = totalSksWajib - data.sks_lulus;
  if (sksSisa > 0) {
    rekomendasi.push(`Masih tersisa ${sksSisa} SKS untuk menyelesaikan studi.`);
  }

  if (data.jumlah_mk_diulang > 0) {
    rekomendasi.push(`Terdapat ${data.jumlah_mk_diulang} matakuliah diulang (${data.sks_mk_diulang} SKS). Prioritaskan matakuliah yang perlu diperbaiki.`);
  }

  let statusKelulusan = '';
  const persenSks = (data.sks_lulus / totalSksWajib) * 100;
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
  // Legacy state
  const [mahasiswaData, setMahasiswaData] = useState<MahasiswaData | null>(null);
  const [hasilAnalisis, setHasilAnalisis] = useState<HasilAnalisis | null>(null);
  
  // New API state
  const [mahasiswaList, setMahasiswaList] = useState<MahasiswaAPI[]>([]);
  const [stats, setStats] = useState<StatsAPI | null>(null);
  const [hasilSAW, setHasilSAW] = useState<HasilSAWAPI[]>([]);
  const [pagination, setPagination] = useState<{ total: number; limit: number; offset: number } | null>(null);
  
  // Common state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic fetch helper
  const fetchAPI = useCallback(async <T,>(endpoint: string, options?: RequestInit): Promise<T | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }, []);

  // Fetch all mahasiswa
  const fetchMahasiswaAll = useCallback(async (params?: FetchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<MahasiswaListResponse>(`/mahasiswa${buildQueryString(params)}`);
      if (response) {
        setMahasiswaList(response.data || []);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError('Gagal mengambil data mahasiswa');
      setMahasiswaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Fetch active mahasiswa
  const fetchMahasiswaAktif = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<ListResponse>(`/mahasiswa/aktif`);
      if (response) {
        setMahasiswaList(response.data || []);
      }
    } catch (err) {
      setError('Gagal mengambil data mahasiswa aktif');
      setMahasiswaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Fetch inactive mahasiswa
  const fetchMahasiswaTidakAktif = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<ListResponse>(`/mahasiswa/tidak-aktif`);
      if (response) {
        setMahasiswaList(response.data || []);
      }
    } catch (err) {
      setError('Gagal mengambil data mahasiswa tidak aktif');
      setMahasiswaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Fetch alumni
  const fetchMahasiswaAlumni = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<ListResponse>(`/mahasiswa/alumni`);
      if (response) {
        setMahasiswaList(response.data || []);
      }
    } catch (err) {
      setError('Gagal mengambil data alumni');
      setMahasiswaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Fetch mahasiswa berprestasi
  const fetchMahasiswaBerprestasi = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<ListResponse>(`/mahasiswa/berprestasi`);
      if (response) {
        setMahasiswaList(response.data || []);
      }
    } catch (err) {
      setError('Gagal mengambil data mahasiswa berprestasi');
      setMahasiswaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Fetch mahasiswa beasiswa
  const fetchMahasiswaBeasiswa = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<ListResponse>(`/mahasiswa/beasiswa`);
      if (response) {
        setMahasiswaList(response.data || []);
      }
    } catch (err) {
      setError('Gagal mengambil data mahasiswa beasiswa');
      setMahasiswaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Fetch mahasiswa by angkatan
  const fetchMahasiswaByAngkatan = useCallback(async (angkatan: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<ListResponse>(`/mahasiswa/angkatan/${angkatan}`);
      if (response) {
        setMahasiswaList(response.data || []);
      }
    } catch (err) {
      setError('Gagal mengambil data mahasiswa berdasarkan angkatan');
      setMahasiswaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Fetch mahasiswa by NIM
  const fetchMahasiswaByNIM = useCallback(async (nim: string): Promise<MahasiswaAPI | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<MahasiswaAPI>(`/mahasiswa/${nim}`);
      return response;
    } catch (err) {
      setError('Gagal mengambil data mahasiswa');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Search mahasiswa
  const searchMahasiswa = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<ListResponse>(`/mahasiswa/search?q=${encodeURIComponent(query)}`);
      if (response) {
        setMahasiswaList(response.data || []);
      }
    } catch (err) {
      setError('Gagal mencari mahasiswa');
      setMahasiswaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<StatsAPI>(`/stats`);
      if (response) {
        setStats(response);
      }
    } catch (err) {
      setError('Gagal mengambil statistik');
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Proses SAW
  const prosesSAW = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<SAWResponse>(`/analisis/saw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response) {
        setHasilSAW(response.data || []);
      }
    } catch (err) {
      setError('Gagal memproses analisis SAW');
      setHasilSAW([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  // Legacy: cariMahasiswa function
  const cariMahasiswa = useCallback(async (nama: string, nim: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchMahasiswaByNIM(nim);
      
      if (response && response.nama.toLowerCase().includes(nama.toLowerCase())) {
        const legacyData = convertToLegacyFormat(response);
        setMahasiswaData(legacyData);
        setHasilAnalisis(hitungAnalisisFromAPI(response));
        return true;
      }

      setError('Mahasiswa tidak ditemukan. Pastikan nama dan NIM sudah benar.');
      return false;
    } catch (err) {
      setError('Terjadi kesalahan saat mencari data mahasiswa.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchMahasiswaByNIM]);

  // Reset data
  const resetData = useCallback(() => {
    setMahasiswaData(null);
    setHasilAnalisis(null);
    setMahasiswaList([]);
    setStats(null);
    setHasilSAW([]);
    setPagination(null);
    setError(null);
  }, []);

  return (
    <MahasiswaContext.Provider value={{ 
      // Legacy
      mahasiswaData, 
      hasilAnalisis, 
      isLoading, 
      error, 
      cariMahasiswa, 
      resetData,
      
      // New API
      mahasiswaList,
      stats,
      hasilSAW,
      pagination,
      fetchMahasiswaAll,
      fetchMahasiswaAktif,
      fetchMahasiswaTidakAktif,
      fetchMahasiswaAlumni,
      fetchMahasiswaBerprestasi,
      fetchMahasiswaBeasiswa,
      fetchMahasiswaByAngkatan,
      fetchMahasiswaByNIM,
      searchMahasiswa,
      fetchStats,
      prosesSAW
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
