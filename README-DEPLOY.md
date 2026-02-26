# 🕌 Sistem Mutaba'ah Tahfizh 30 Juz

Aplikasi web modern untuk monitoring hafalan Al-Qur'an 30 juz dengan desain islami.

## ✨ Fitur

- 🔐 **Login Role-based** - Guru dan Wali Santri
- 👨‍🏫 **Dashboard Guru** - Statistik, grafik, input setoran
- 👨‍👩‍👧 **Dashboard Wali** - Monitoring progress anak
- 📊 **Grafik & Visualisasi** - Progress hafalan, ranking
- 📋 **Laporan** - Bulanan dan Semester
- 📈 **Sistem Progress Otomatis** - Kalkulasi persentase khatam

## 🚀 Deploy ke Vercel

### Cara Cepat

1. **Upload ke GitHub**
   - Buat repository baru di GitHub
   - Upload semua file project ini

2. **Deploy di Vercel**
   - Buka [vercel.com/new](https://vercel.com/new)
   - Import repository dari GitHub
   - Klik **Deploy**

3. **Set Environment Variables** (di Vercel Dashboard)
   ```
   DATABASE_URL=file:./db/custom.db
   NEXTAUTH_SECRET=your-random-secret-key-32-chars
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

## 📦 Install Lokal

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🔐 Kredensial Login

| Field | Nilai |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

Pilih role: **Guru** atau **Wali Santri**

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: Prisma (SQLite/PostgreSQL)
- **Charts**: Recharts
- **State**: Zustand
- **Animation**: Framer Motion

## 📁 Struktur Project

```
├── prisma/           # Database schema
├── public/           # Static files
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── api/      # API Routes
│   │   └── page.tsx  # Main page
│   ├── components/   # React components
│   │   ├── ui/       # shadcn/ui components
│   │   ├── login-page.tsx
│   │   ├── teacher-dashboard.tsx
│   │   └── guardian-dashboard.tsx
│   ├── hooks/        # React hooks
│   └── lib/          # Utilities & store
├── package.json
├── tailwind.config.ts
└── vercel.json
```

## ⚙️ Environment Variables

Buat file `.env.local`:

```env
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_SECRET="your-secret-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

## 🎨 Tema Desain

- **Warna Utama**: Hijau tua (#1a5f3c)
- **Warna Aksen**: Emas (#c9a227)
- **Background**: Putih
- **Nuansa**: Islamic modern dengan geometric pattern

## 📄 License

MIT License

---

Dibuat dengan ❤️ untuk generasi penghafal Al-Qur'an
