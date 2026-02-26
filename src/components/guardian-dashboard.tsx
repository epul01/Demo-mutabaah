'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  LogOut, 
  BookOpen, 
  Target, 
  TrendingUp,
  Bell,
  Menu,
  X,
  Home,
  Calendar,
  FileText,
  BarChart3,
  Moon,
  Star,
  Award,
  Clock,
  User,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#1a5f3c', '#c9a227', '#2d7a50', '#8b6914', '#45a049', '#d4af37'];

export function GuardianDashboard() {
  const { user, logout, santriList, hafalanList, notifikasiList, markNotifikasiAsRead, currentView, setCurrentView } = useAppStore();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get santri data for this wali
  const santri = santriList.find(s => s.waliId === user?.id);
  
  // Get hafalan for this santri
  const santriHafalan = santri ? hafalanList.filter(h => h.santriId === santri.id) : [];
  
  // Get notifications for this user
  const userNotifications = notifikasiList.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.dibaca).length;

  // Calculate statistics
  const totalHafalan = santri?.totalJuz || 0;
  const targetJuz = 30;
  const sisaHafalan = targetJuz - totalHafalan;
  const persentase = Math.round((totalHafalan / targetJuz) * 100);

  // Chart data
  const progressData = [
    { name: 'Selesai', value: totalHafalan, color: '#1a5f3c' },
    { name: 'Sisa', value: sisaHafalan, color: '#e5e7eb' }
  ];

  // Monthly progress
  const monthlyProgress = [
    { bulan: 'Jul', juz: 7.2 },
    { bulan: 'Agu', juz: 7.8 },
    { bulan: 'Sep', juz: 8.3 },
    { bulan: 'Okt', juz: 8.9 },
    { bulan: 'Nov', juz: 9.4 },
    { bulan: 'Des', juz: 9.8 },
    { bulan: 'Jan', juz: 10 }
  ];

  // Estimasi khatam
  const rataRataBulanan = 0.4; // Juz per bulan
  const estimasiBulan = Math.ceil(sisaHafalan / rataRataBulanan);
  const estimasiTanggal = new Date();
  estimasiTanggal.setMonth(estimasiTanggal.getMonth() + estimasiBulan);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'laporan-bulanan', label: 'Laporan Bulanan', icon: Calendar },
    { id: 'laporan-semester', label: 'Laporan Semester', icon: FileText },
    { id: 'grafik', label: 'Grafik Pencapaian', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed lg:relative z-40 w-72 h-screen bg-gradient-to-b from-[#1a5f3c] to-[#154d31] text-white shadow-xl"
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#c9a227] rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#1a5f3c]" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Mutaba'ah Tahfizh</h1>
              <p className="text-xs text-white/70">30 Juz</p>
            </div>
          </div>
          
          {/* Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {currentView === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Notification area */}
        {unreadCount > 0 && (
          <div className="px-6 py-4 border-t border-white/10">
            <button className="w-full flex items-center gap-3 p-3 bg-[#c9a227]/20 rounded-lg">
              <div className="relative">
                <Bell className="w-5 h-5 text-[#c9a227]" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              </div>
              <span className="text-sm">{unreadCount} notifikasi baru</span>
            </button>
          </div>
        )}
        
        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c9a227] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#1a5f3c]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/60">Wali Santri</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-[#1a5f3c]">
                  Assalamu'alaikum, Wali dari Ananda {santri?.name || 'Santri'}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {/* Dashboard View */}
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Notification Alert */}
                {unreadCount > 0 && (
                  <Card className="border-l-4 border-l-[#c9a227] bg-[#c9a227]/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#c9a227] mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#c9a227]">Notifikasi</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {userNotifications.find(n => !n.dibaca)?.pesan}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            userNotifications.forEach(n => !n.dibaca && markNotifikasiAsRead(n.id));
                            toast({ title: 'Notifikasi ditandai sudah dibaca' });
                          }}
                        >
                          Tandai dibaca
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Main Progress Card */}
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a5f3c] to-[#2d7a50] p-6 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <p className="text-white/80 mb-2">Progress Hafalan Ananda {santri?.name}</p>
                        <h2 className="text-5xl font-bold mb-4">{persentase}%</h2>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{totalHafalan.toFixed(1)} Juz selesai</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            <span>{sisaHafalan.toFixed(1)} Juz lagi</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <ChartContainer config={{}} className="h-[160px] w-[160px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={progressData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {progressData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <BookOpen className="w-6 h-6 text-[#c9a227] mx-auto mb-1" />
                            <span className="text-xl font-bold">{totalHafalan.toFixed(1)}</span>
                            <span className="text-xs block">/ 30 Juz</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <Progress value={persentase} className="h-4 mb-4" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-[#1a5f3c]/5 rounded-lg">
                        <p className="text-sm text-gray-500">Total Hafalan</p>
                        <p className="text-xl font-bold text-[#1a5f3c]">{totalHafalan.toFixed(1)} Juz</p>
                      </div>
                      <div className="text-center p-3 bg-[#c9a227]/10 rounded-lg">
                        <p className="text-sm text-gray-500">Target Lulus</p>
                        <p className="text-xl font-bold text-[#c9a227]">{targetJuz} Juz</p>
                      </div>
                      <div className="text-center p-3 bg-[#2d7a50]/5 rounded-lg">
                        <p className="text-sm text-gray-500">Sisa Hafalan</p>
                        <p className="text-xl font-bold text-[#2d7a50]">{sisaHafalan.toFixed(1)} Juz</p>
                      </div>
                      <div className="text-center p-3 bg-[#8b6914]/10 rounded-lg">
                        <p className="text-sm text-gray-500">Estimasi Khatam</p>
                        <p className="text-xl font-bold text-[#8b6914]">
                          {estimasiTanggal.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a5f3c] flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Setoran Terbaru
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] custom-scrollbar">
                        {santriHafalan.length > 0 ? (
                          <div className="space-y-3">
                            {santriHafalan.slice().reverse().slice(0, 5).map((h) => (
                              <div key={h.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-[#1a5f3c] rounded-lg flex items-center justify-center text-white font-bold">
                                  {h.nilai}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{h.surah} ({h.ayatMulai}-{h.ayatSelesai})</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(h.tanggal).toLocaleDateString('id-ID')}
                                  </p>
                                </div>
                                <Badge variant={h.jenisSetoran === 'ZIYADAH' ? 'default' : 'secondary'}>
                                  {h.jenisSetoran}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Belum ada data setoran</p>
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a5f3c] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Perkembangan Hafalan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{}} className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlyProgress}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="bulan" tick={{ fill: '#1a5f3c' }} />
                            <YAxis domain={[0, 30]} tick={{ fill: '#1a5f3c' }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line 
                              type="monotone" 
                              dataKey="juz" 
                              stroke="#1a5f3c" 
                              strokeWidth={3}
                              dot={{ fill: '#c9a227', strokeWidth: 2, r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Laporan Bulanan View */}
            {currentView === 'laporan-bulanan' && (
              <motion.div
                key="laporan-bulanan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#1a5f3c]">Laporan Bulanan - Januari 2026</CardTitle>
                    <CardDescription>Ringkasan hafalan bulanan Ananda {santri?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-[#1a5f3c]/5 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Total Setoran</p>
                        <p className="text-2xl font-bold text-[#1a5f3c]">
                          {santriHafalan.filter(h => 
                            new Date(h.tanggal).getMonth() === 0
                          ).length}
                        </p>
                      </div>
                      <div className="p-4 bg-[#c9a227]/10 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Ziyadah</p>
                        <p className="text-2xl font-bold text-[#c9a227]">
                          {santriHafalan.filter(h => 
                            h.jenisSetoran === 'ZIYADAH' &&
                            new Date(h.tanggal).getMonth() === 0
                          ).length}
                        </p>
                      </div>
                      <div className="p-4 bg-[#2d7a50]/5 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Muraja'ah</p>
                        <p className="text-2xl font-bold text-[#2d7a50]">
                          {santriHafalan.filter(h => 
                            h.jenisSetoran === 'MURAJAAH' &&
                            new Date(h.tanggal).getMonth() === 0
                          ).length}
                        </p>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Surah</TableHead>
                          <TableHead>Ayat</TableHead>
                          <TableHead>Jenis</TableHead>
                          <TableHead>Nilai</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {santriHafalan.filter(h => 
                          new Date(h.tanggal).getMonth() === 0
                        ).map((h) => (
                          <TableRow key={h.id}>
                            <TableCell>
                              {new Date(h.tanggal).toLocaleDateString('id-ID')}
                            </TableCell>
                            <TableCell className="font-medium">{h.surah}</TableCell>
                            <TableCell>{h.ayatMulai} - {h.ayatSelesai}</TableCell>
                            <TableCell>
                              <Badge variant={h.jenisSetoran === 'ZIYADAH' ? 'default' : 'secondary'}>
                                {h.jenisSetoran}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`
                                ${h.nilai === 'A' ? 'bg-green-500' : ''}
                                ${h.nilai === 'A-' ? 'bg-green-400' : ''}
                                ${h.nilai === 'B+' ? 'bg-blue-500' : ''}
                              `}>
                                {h.nilai}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-6 p-4 bg-[#1a5f3c]/5 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Total Hafalan Bulan Ini</p>
                          <p className="text-lg font-semibold text-[#1a5f3c]">2 halaman</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Penilaian Rata-rata</p>
                          <p className="text-lg font-semibold text-[#c9a227]">A-</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Laporan Semester View */}
            {currentView === 'laporan-semester' && (
              <motion.div
                key="laporan-semester"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#1a5f3c]">Laporan Semester 1 - Tahun Ajaran 2025/2026</CardTitle>
                    <CardDescription>Ringkasan pencapaian hafalan semester</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                      <div className="p-4 bg-[#1a5f3c]/5 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Total Setoran</p>
                        <p className="text-3xl font-bold text-[#1a5f3c]">85</p>
                      </div>
                      <div className="p-4 bg-[#c9a227]/10 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Tambahan Hafalan</p>
                        <p className="text-3xl font-bold text-[#c9a227]">3 Juz</p>
                      </div>
                      <div className="p-4 bg-[#2d7a50]/5 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Muraja'ah</p>
                        <p className="text-3xl font-bold text-[#2d7a50]">40x</p>
                      </div>
                      <div className="p-4 bg-[#8b6914]/10 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Kehadiran</p>
                        <p className="text-3xl font-bold text-[#8b6914]">98%</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-[#1a5f3c] to-[#2d7a50] rounded-lg text-center text-white">
                        <p className="text-sm text-white/80">Nilai Rata-rata</p>
                        <p className="text-3xl font-bold">A-</p>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-r from-[#1a5f3c]/10 to-[#c9a227]/10 rounded-lg mb-6">
                      <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Juz Awal</p>
                          <p className="text-4xl font-bold text-[#1a5f3c]">7</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-[#c9a227] rounded" />
                          <TrendingUp className="w-6 h-6 text-[#c9a227]" />
                          <div className="w-16 h-1 bg-[#c9a227] rounded" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Juz Akhir</p>
                          <p className="text-4xl font-bold text-[#c9a227]">10</p>
                        </div>
                      </div>
                      <p className="text-center mt-4 text-gray-600">
                        Perkembangan dari Juz 7 → Juz 10 (+3 Juz dalam 1 semester)
                      </p>
                    </div>
                    
                    <ChartContainer config={{}} className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyProgress}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="bulan" tick={{ fill: '#1a5f3c' }} />
                          <YAxis domain={[0, 30]} tick={{ fill: '#1a5f3c' }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="juz" 
                            stroke="#1a5f3c" 
                            strokeWidth={3}
                            dot={{ fill: '#c9a227', strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Grafik View */}
            {currentView === 'grafik' && (
              <motion.div
                key="grafik"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a5f3c]">Progress Menuju Khatam</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center">
                        <ChartContainer config={{}} className="h-[280px] w-[280px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={progressData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                              >
                                {progressData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-5xl font-bold text-[#1a5f3c]">{persentase}%</p>
                        <p className="text-gray-500 mt-2">dari target 30 Juz</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a5f3c]">Perkembangan Bulanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{}} className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyProgress}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="bulan" tick={{ fill: '#1a5f3c' }} />
                            <YAxis domain={[0, 30]} tick={{ fill: '#1a5f3c' }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="juz" fill="#1a5f3c" radius={[4, 4, 0, 0]}>
                              {monthlyProgress.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={index === monthlyProgress.length - 1 ? '#c9a227' : '#1a5f3c'} 
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Achievement Cards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#1a5f3c] flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#c9a227]" />
                      Pencapaian
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border-2 border-[#c9a227] rounded-lg text-center bg-[#c9a227]/5">
                        <Star className="w-8 h-8 text-[#c9a227] mx-auto mb-2" />
                        <p className="font-semibold text-[#1a5f3c]">Target Semester</p>
                        <p className="text-2xl font-bold text-[#c9a227]">Tercapai</p>
                        <p className="text-sm text-gray-500">+3 Juz dari target</p>
                      </div>
                      <div className="p-4 border-2 border-[#2d7a50] rounded-lg text-center bg-[#2d7a50]/5">
                        <Award className="w-8 h-8 text-[#2d7a50] mx-auto mb-2" />
                        <p className="font-semibold text-[#1a5f3c]">Kehadiran</p>
                        <p className="text-2xl font-bold text-[#2d7a50]">98%</p>
                        <p className="text-sm text-gray-500">Sangat Baik</p>
                      </div>
                      <div className="p-4 border-2 border-[#8b6914] rounded-lg text-center bg-[#8b6914]/5">
                        <TrendingUp className="w-8 h-8 text-[#8b6914] mx-auto mb-2" />
                        <p className="font-semibold text-[#1a5f3c]">Estimasi Khatam</p>
                        <p className="text-2xl font-bold text-[#8b6914]">
                          {estimasiTanggal.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-500">{estimasiBulan} bulan lagi</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Sistem Mutaba'ah Tahfizh 30 Juz
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Moon className="w-4 h-4 text-[#c9a227]" />
              <span>Dibuat untuk generasi penghafal Al-Qur'an</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
