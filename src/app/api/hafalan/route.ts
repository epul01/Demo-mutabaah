import { NextRequest, NextResponse } from 'next/server';

// Demo hafalan data
const DEMO_HAFALAN = [
  {
    id: 'hafalan-1',
    santriId: 'santri-1',
    santriName: 'Abdullah',
    tanggal: '2026-01-03',
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 1,
    ayatSelesai: 10,
    jenisSetoran: 'ZIYADAH',
    nilai: 'A',
    catatan: '',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-2',
    santriId: 'santri-1',
    santriName: 'Abdullah',
    tanggal: '2026-01-05',
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 11,
    ayatSelesai: 20,
    jenisSetoran: 'ZIYADAH',
    nilai: 'A',
    catatan: '',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-3',
    santriId: 'santri-1',
    santriName: 'Abdullah',
    tanggal: '2026-01-10',
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 1,
    ayatSelesai: 20,
    jenisSetoran: 'MURAJAAH',
    nilai: 'A-',
    catatan: 'Perlu lebih fokus pada tajwid',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-4',
    santriId: 'santri-1',
    santriName: 'Abdullah',
    tanggal: '2026-01-15',
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 21,
    ayatSelesai: 30,
    jenisSetoran: 'ZIYADAH',
    nilai: 'B+',
    catatan: 'Hafalan cukup baik, perlu murajaah',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-5',
    santriId: 'santri-2',
    santriName: 'Fatimah',
    tanggal: '2026-01-04',
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 1,
    ayatSelesai: 15,
    jenisSetoran: 'ZIYADAH',
    nilai: 'A',
    catatan: '',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-6',
    santriId: 'santri-3',
    santriName: 'Zaid',
    tanggal: '2026-01-06',
    juz: 30,
    surah: 'An-Naba',
    ayatMulai: 1,
    ayatSelesai: 40,
    jenisSetoran: 'ZIYADAH',
    nilai: 'B',
    catatan: 'Perlu latihan lebih',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  },
  {
    id: 'hafalan-7',
    santriId: 'santri-4',
    santriName: 'Maryam',
    tanggal: '2026-01-08',
    juz: 1,
    surah: 'Al-Baqarah',
    ayatMulai: 1,
    ayatSelesai: 25,
    jenisSetoran: 'MURAJAAH',
    nilai: 'A',
    catatan: 'Sangat lancar',
    guruId: 'guru-1',
    guruName: 'Ustadz Ahmad Hafizh'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const santriId = searchParams.get('santriId');
    
    let hafalanData = DEMO_HAFALAN;
    
    if (santriId) {
      hafalanData = hafalanData.filter(h => h.santriId === santriId);
    }
    
    return NextResponse.json({
      success: true,
      data: hafalanData
    });
  } catch (error) {
    console.error('Get hafalan error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newHafalan = {
      id: `hafalan-${Date.now()}`,
      ...body,
      tanggal: body.tanggal || new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: newHafalan
    });
  } catch (error) {
    console.error('Create hafalan error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
