import { NextRequest, NextResponse } from 'next/server';

// Demo users for testing
const DEMO_USERS = [
  {
    id: 'guru-1',
    email: 'admin',
    password: 'admin123',
    name: 'Ustadz Ahmad Hafizh',
    role: 'GURU',
    phone: '081234567890'
  },
  {
    id: 'wali-1',
    email: 'admin',
    password: 'admin123',
    name: 'Bapak Abdullah',
    role: 'WALI',
    phone: '081234567891'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, dan role harus diisi' },
        { status: 400 }
      );
    }

    // Check credentials
    if (email === 'admin' && password === 'admin123') {
      const user = DEMO_USERS.find(u => u.role === role);
      if (user) {
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone
          }
        });
      }
    }

    return NextResponse.json(
      { error: 'Username atau password salah' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
