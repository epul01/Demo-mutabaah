import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'GURU' | 'WALI' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export interface Santri {
  id: string;
  name: string;
  nis: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  jenisKelamin?: string;
  alamat?: string;
  telepon?: string;
  tanggalMasuk: Date;
  status: string;
  totalJuz: number;
  targetJuz: number;
  targetTahunan: number;
  waliId?: string;
}

export interface Hafalan {
  id: string;
  santriId: string;
  santriName: string;
  tanggal: Date;
  juz: number;
  surah: string;
  ayatMulai: number;
  ayatSelesai: number;
  jenisSetoran: 'ZIYADAH' | 'MURAJAAH';
  nilai: string;
  catatan?: string;
  guruId: string;
  guruName: string;
}

export interface LaporanBulanan {
  id: string;
  santriId: string;
  bulan: number;
  tahun: number;
  totalSetoran: number;
  ziyadahCount: number;
  murajaahCount: number;
  nilaiRataRata: string;
  halamanBaru: number;
}

export interface LaporanSemester {
  id: string;
  santriId: string;
  semester: number;
  tahunAjaran: string;
  totalSetoran: number;
  tambahanJuz: number;
  murajaahCount: number;
  nilaiRataRata: string;
  kehadiran: number;
  juzAwal: number;
  juzAkhir: number;
}

export interface Notifikasi {
  id: string;
  userId: string;
  judul: string;
  pesan: string;
  tipe: 'INFO' | 'WARNING' | 'SUCCESS';
  dibaca: boolean;
  createdAt: Date;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  
  // Santri
  santriList: Santri[];
  addSantri: (santri: Omit<Santri, 'id'>) => void;
  updateSantri: (id: string, santri: Partial<Santri>) => void;
  getSantriByWaliId: (waliId: string) => Santri | undefined;
  
  // Hafalan
  hafalanList: Hafalan[];
  addHafalan: (hafalan: Omit<Hafalan, 'id'>) => void;
  getHafalanBySantri: (santriId: string) => Hafalan[];
  
  // Laporan
  laporanBulananList: LaporanBulanan[];
  laporanSemesterList: LaporanSemester[];
  
  // Notifikasi
  notifikasiList: Notifikasi[];
  addNotifikasi: (notifikasi: Omit<Notifikasi, 'id' | 'createdAt' | 'dibaca'>) => void;
  markNotifikasiAsRead: (id: string) => void;
  
  // UI State
  currentView: 'login' | 'dashboard' | 'data-santri' | 'input-setoran' | 'laporan-bulanan' | 'laporan-semester' | 'grafik' | 'export';
  setCurrentView: (view: AppState['currentView']) => void;
}

// Demo data
const demoGuru: User = {
  id: 'guru-1',
  email: 'admin',
  name: 'Ustadz Ahmad Hafizh',
  role: 'GURU',
  phone: '081234567890'
};

const demoWali: User = {
  id: 'wali-1',
  email: 'admin',
  name: 'Bapak Abdullah',
  role: 'WALI',
  phone: '081234567891'
};

const demoSantriList: Santri[] = [
  {
    id: 'santri-1',
    name: 'Abdullah',
    nis: 'TFA-2024-001',
    tempatLahir: 'Jakarta',
    tanggalLahir: new Date('2012-05-15'),
    jenisKelamin: 'L',
    alamat: 'Jl. Kebon Jeruk No. 123, Jakarta',
    telepon: '081234567892',
    tanggalMasuk: new Date('2024-01-15'),
    status: 'AKTIF',
    totalJuz: 10,
    targetJuz: 30,
    targetTahunan: 5,
    waliId: 'wali-1'
  },
  {
    id: 'santri-2',
    name: 'Fatimah',
    nis: 'TFA-2024-002',
    tempatLahir: 'Bandung',
    tanggalLahir: new Date('2013-08-20'),
    jenisKelamin: 'P',
    alamat: 'Jl. Merdeka No. 45, Bandung',
    telepon: '081234567893',
    tanggalMasuk: new Date('2024-01-15'),
    status: 'AKTIF',
    totalJuz: 15,
    targetJuz: 30,
    targetTahunan: 5,
    waliId: 'wali-2'
  },
  {
    id: 'santri-3',
    name: 'Zaid',
    nis: 'TFA-2024-003',
    tempatLahir: 'Surabaya',
    tanggalLahir: new Date('2011-03-10'),
    jenisKelamin: 'L',
    alamat: 'Jl. Pahlawan No. 78, Surabaya',
    telepon: '081234567894',
    tanggalMasuk: new Date('2024-01-15'),
    status: 'AKTIF',
    totalJuz: 5,
    targetJuz: 30,
    targetTahunan: 5,
    waliId: 'wali-3'
  },
  {
    id: 'santri-4',
    name: 'Maryam',
    nis: 'TFA-2024-004',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: new Date('2012-12-25'),
    jenisKelamin: 'P',
    alamat: 'Jl. Malioboro No. 99, Yogyakarta',
    telepon: '081234567895',
    tanggalMasuk: new Date('2024-01-15'),
    status: 'AKTIF',
    totalJuz: 20,
    targetJuz: 30,
    targetTahunan: 5,
    waliId: 'wali-4'
  },
  {
    id: 'santri-5',
    name: 'Umar',
    nis: 'TFA-2024-005',
    tempatLahir: 'Semarang',
    tanggalLahir: new Date('2013-07-12'),
    jenisKelamin: 'L',
    alamat: 'Jl. Simpang Lima No. 55, Semarang',
    telepon: '081234567896',
    tanggalMasuk: new Date('2024-01-15'),
    status: 'AKTIF',
    totalJuz: 8,
    targetJuz: 30,
    targetTahunan: 5,
    waliId: 'wali-5'
  }
];

const demoHafalan: Hafalan[] = [
  {
    id: 'hafalan-1',
    santriId: 'santri-1',
    santriName: 'Abdullah',
    tanggal: new Date('2026-01-03'),
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 1,
    ayatSelesai: 10,
    jenisSetoran: 'ZIYADAH',
    nilai: 'A',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-2',
    santriId: 'santri-1',
    santriName: 'Abdullah',
    tanggal: new Date('2026-01-05'),
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 11,
    ayatSelesai: 20,
    jenisSetoran: 'ZIYADAH',
    nilai: 'A',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-3',
    santriId: 'santri-1',
    santriName: 'Abdullah',
    tanggal: new Date('2026-01-10'),
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 1,
    ayatSelesai: 20,
    jenisSetoran: 'MURAJAAH',
    nilai: 'A-',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-4',
    santriId: 'santri-1',
    santriName: 'Abdullah',
    tanggal: new Date('2026-01-15'),
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 21,
    ayatSelesai: 30,
    jenisSetoran: 'ZIYADAH',
    nilai: 'B+',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-5',
    santriId: 'santri-2',
    santriName: 'Fatimah',
    tanggal: new Date('2026-01-04'),
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 1,
    ayatSelesai: 15,
    jenisSetoran: 'ZIYADAH',
    nilai: 'A',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-6',
    santriId: 'santri-3',
    santriName: 'Zaid',
    tanggal: new Date('2026-01-06'),
    juz: 30,
    surah: 'An-Naba',
    ayatMulai: 1,
    ayatSelesai: 40,
    jenisSetoran: 'ZIYADAH',
    nilai: 'B',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-7',
    santriId: 'santri-4',
    santriName: 'Maryam',
    tanggal: new Date('2026-01-08'),
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 1,
    ayatSelesai: 25,
    jenisSetoran: 'MURAJAAH',
    nilai: 'A',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string, role: UserRole) => {
        // Demo login - username: admin, password: admin123
        if (email === 'admin' && password === 'admin123') {
          if (role === 'GURU') {
            set({ user: demoGuru, isAuthenticated: true, currentView: 'dashboard' });
            return true;
          }
          if (role === 'WALI') {
            set({ user: demoWali, isAuthenticated: true, currentView: 'dashboard' });
            return true;
          }
        }
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, currentView: 'login' });
      },
      
      // Santri
      santriList: demoSantriList,
      
      addSantri: (santri) => {
        const newSantri: Santri = {
          ...santri,
          id: `santri-${Date.now()}`
        };
        set((state) => ({ santriList: [...state.santriList, newSantri] }));
      },
      
      updateSantri: (id, santri) => {
        set((state) => ({
          santriList: state.santriList.map((s) => (s.id === id ? { ...s, ...santri } : s))
        }));
      },
      
      getSantriByWaliId: (waliId) => {
        return get().santriList.find((s) => s.waliId === waliId);
      },
      
      // Hafalan
      hafalanList: demoHafalan,
      
      addHafalan: (hafalan) => {
        const newHafalan: Hafalan = {
          ...hafalan,
          id: `hafalan-${Date.now()}`
        };
        set((state) => ({ hafalanList: [...state.hafalanList, newHafalan] }));
        
        // Update santri total juz if ziyadah
        if (hafalan.jenisSetoran === 'ZIYADAH') {
          const santri = get().santriList.find((s) => s.id === hafalan.santriId);
          if (santri) {
            // Simple calculation: add 0.1 juz for each ziyadah
            get().updateSantri(hafalan.santriId, {
              totalJuz: santri.totalJuz + 0.1
            });
          }
        }
      },
      
      getHafalanBySantri: (santriId) => {
        return get().hafalanList.filter((h) => h.santriId === santriId);
      },
      
      // Laporan
      laporanBulananList: [
        {
          id: 'lb-1',
          santriId: 'santri-1',
          bulan: 1,
          tahun: 2026,
          totalSetoran: 4,
          ziyadahCount: 3,
          murajaahCount: 1,
          nilaiRataRata: 'A-',
          halamanBaru: 2
        }
      ],
      
      laporanSemesterList: [
        {
          id: 'ls-1',
          santriId: 'santri-1',
          semester: 1,
          tahunAjaran: '2025/2026',
          totalSetoran: 85,
          tambahanJuz: 3,
          murajaahCount: 40,
          nilaiRataRata: 'A-',
          kehadiran: 98,
          juzAwal: 7,
          juzAkhir: 10
        }
      ],
      
      // Notifikasi
      notifikasiList: [
        {
          id: 'notif-1',
          userId: 'wali-1',
          judul: 'Target Tidak Tercapai',
          pesan: 'Ananda Abdullah belum mencapai target hafalan bulan ini.',
          tipe: 'WARNING',
          dibaca: false,
          createdAt: new Date()
        }
      ],
      
      addNotifikasi: (notifikasi) => {
        const newNotifikasi: Notifikasi = {
          ...notifikasi,
          id: `notif-${Date.now()}`,
          dibaca: false,
          createdAt: new Date()
        };
        set((state) => ({ notifikasiList: [...state.notifikasiList, newNotifikasi] }));
      },
      
      markNotifikasiAsRead: (id) => {
        set((state) => ({
          notifikasiList: state.notifikasiList.map((n) =>
            n.id === id ? { ...n, dibaca: true } : n
          )
        }));
      },
      
      // UI State
      currentView: 'login',
      setCurrentView: (view) => set({ currentView: view })
    }),
    {
      name: 'tahfizh-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentView: state.currentView
      })
    }
  )
);
