import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Demo santri data
const DEMO_SANTRI = [
  {
    id: 'santri-1',
    name: 'Abdullah',
    nis: 'TFA-2024-001',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2012-05-15',
    jenisKelamin: 'L',
    alamat: 'Jl. Kebon Jeruk No. 123, Jakarta',
    telepon: '081234567892',
    tanggalMasuk: '2024-01-15',
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
    tanggalLahir: '2013-08-20',
    jenisKelamin: 'P',
    alamat: 'Jl. Merdeka No. 45, Bandung',
    telepon: '081234567893',
    tanggalMasuk: '2024-01-15',
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
    tanggalLahir: '2011-03-10',
    jenisKelamin: 'L',
    alamat: 'Jl. Pahlawan No. 78, Surabaya',
    telepon: '081234567894',
    tanggalMasuk: '2024-01-15',
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
    tanggalLahir: '2012-12-25',
    jenisKelamin: 'P',
    alamat: 'Jl. Malioboro No. 99, Yogyakarta',
    telepon: '081234567895',
    tanggalMasuk: '2024-01-15',
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
    tanggalLahir: '2013-07-12',
    jenisKelamin: 'L',
    alamat: 'Jl. Simpang Lima No. 55, Semarang',
    telepon: '081234567896',
    tanggalMasuk: '2024-01-15',
    status: 'AKTIF',
    totalJuz: 8,
    targetJuz: 30,
    targetTahunan: 5,
    waliId: 'wali-5'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const waliId = searchParams.get('waliId');
    
    // For demo, return demo data
    // In production, this would query the database
    let santriData = DEMO_SANTRI;
    
    if (waliId) {
      santriData = santriData.filter(s => s.waliId === waliId);
    }
    
    return NextResponse.json({
      success: true,
      data: santriData
    });
  } catch (error) {
    console.error('Get santri error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In production, this would create a new santri in the database
    const newSantri = {
      id: `santri-${Date.now()}`,
      ...body,
      tanggalMasuk: new Date().toISOString(),
      status: 'AKTIF',
      totalJuz: 0,
      targetJuz: 30,
      targetTahunan: 5
    };
    
    return NextResponse.json({
      success: true,
      data: newSantri
    });
  } catch (error) {
    console.error('Create santri error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
