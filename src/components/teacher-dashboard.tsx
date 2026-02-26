'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { 
  LogOut, 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp,
  Plus,
  FileText,
  BarChart3,
  Download,
  Bell,
  Menu,
  X,
  Home,
  UserCog,
  Calendar,
  Award,
  ChevronRight,
  Search,
  Filter,
  Moon,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#1a5f3c', '#c9a227', '#2d7a50', '#8b6914', '#45a049', '#d4af37'];

export function TeacherDashboard() {
  const { user, logout, santriList, hafalanList, addHafalan, currentView, setCurrentView } = useAppStore();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state for new hafalan
  const [newHafalan, setNewHafalan] = useState({
    santriId: '',
    tanggal: new Date().toISOString().split('T')[0],
    juz: 1,
    surah: '',
    ayatMulai: 1,
    ayatSelesai: 10,
    jenisSetoran: 'ZIYADAH' as 'ZIYADAH' | 'MURAJAAH',
    nilai: 'A',
    catatan: ''
  });

  // Calculate statistics
  const totalSantri = santriList.length;
  const santriAktif = santriList.filter(s => s.status === 'AKTIF').length;
  const avgHafalan = santriList.reduce((acc, s) => acc + s.totalJuz, 0) / santriList.length;
  const targetTahunan = 5;

  // Chart data for santri progress
  const progressData = santriList.map(s => ({
    name: s.name,
    juz: Math.round(s.totalJuz),
    percentage: Math.round((s.totalJuz / 30) * 100)
  }));

  // Pie chart data
  const pieData = [
    { name: 'Selesai', value: Math.round(avgHafalan), color: '#1a5f3c' },
    { name: 'Sisa', value: Math.round(30 - avgHafalan), color: '#e5e7eb' }
  ];

  // Monthly trend data
  const monthlyData = [
    { bulan: 'Jul', hafalan: 45 },
    { bulan: 'Agu', hafalan: 52 },
    { bulan: 'Sep', hafalan: 48 },
    { bulan: 'Okt', hafalan: 61 },
    { bulan: 'Nov', hafalan: 55 },
    { bulan: 'Des', hafalan: 67 },
    { bulan: 'Jan', hafalan: 72 }
  ];

  // Ranking santri
  const ranking = [...santriList].sort((a, b) => b.totalJuz - a.totalJuz);

  const handleAddHafalan = () => {
    if (!newHafalan.santriId) {
      toast({
        title: 'Error',
        description: 'Pilih santri terlebih dahulu',
        variant: 'destructive'
      });
      return;
    }

    const santri = santriList.find(s => s.id === newHafalan.santriId);
    
    addHafalan({
      santriId: newHafalan.santriId,
      santriName: santri?.name || '',
      tanggal: new Date(newHafalan.tanggal),
      juz: newHafalan.juz,
      surah: newHafalan.surah,
      ayatMulai: newHafalan.ayatMulai,
      ayatSelesai: newHafalan.ayatSelesai,
      jenisSetoran: newHafalan.jenisSetoran,
      nilai: newHafalan.nilai,
      catatan: newHafalan.catatan,
      guruId: user?.id || '',
      guruName: user?.name || ''
    });

    toast({
      title: 'Berhasil',
      description: 'Setoran hafalan berhasil ditambahkan',
    });

    setShowAddDialog(false);
    setNewHafalan({
      santriId: '',
      tanggal: new Date().toISOString().split('T')[0],
      juz: 1,
      surah: '',
      ayatMulai: 1,
      ayatSelesai: 10,
      jenisSetoran: 'ZIYADAH',
      nilai: 'A',
      catatan: ''
    });
  };

  const filteredSantri = santriList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'data-santri', label: 'Data Santri', icon: Users },
    { id: 'input-setoran', label: 'Input Setoran', icon: Plus },
    { id: 'laporan-bulanan', label: 'Laporan Bulanan', icon: Calendar },
    { id: 'laporan-semester', label: 'Laporan Semester', icon: FileText },
    { id: 'grafik', label: 'Grafik Pencapaian', icon: BarChart3 },
    { id: 'export', label: 'Export PDF', icon: Download }
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
        
        {/* Decorative bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c9a227] rounded-full flex items-center justify-center">
              <UserCog className="w-5 h-5 text-[#1a5f3c]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/60">Guru Tahfizh</p>
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
                  Assalamu'alaikum, {user?.name}
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
            
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
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
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="card-hover border-l-4 border-l-[#1a5f3c]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total Santri</p>
                          <p className="text-3xl font-bold text-[#1a5f3c]">{totalSantri}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#1a5f3c]/10 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-[#1a5f3c]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-hover border-l-4 border-l-[#c9a227]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Santri Aktif</p>
                          <p className="text-3xl font-bold text-[#c9a227]">{santriAktif}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-[#c9a227]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-hover border-l-4 border-l-[#2d7a50]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Rata-rata Hafalan</p>
                          <p className="text-3xl font-bold text-[#2d7a50]">{avgHafalan.toFixed(1)} Juz</p>
                        </div>
                        <div className="w-12 h-12 bg-[#2d7a50]/10 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-[#2d7a50]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-hover border-l-4 border-l-[#8b6914]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Target Tahun Ini</p>
                          <p className="text-3xl font-bold text-[#8b6914]">{targetTahunan} Juz</p>
                        </div>
                        <div className="w-12 h-12 bg-[#8b6914]/10 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-[#8b6914]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a5f3c]">Progress Hafalan Santri</CardTitle>
                      <CardDescription>Total hafalan per santri dalam Juz</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{}} className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fill: '#1a5f3c' }} />
                            <YAxis tick={{ fill: '#1a5f3c' }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="juz" fill="#1a5f3c" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a5f3c]">Rata-rata Pencapaian</CardTitle>
                      <CardDescription>Persentase hafalan rata-rata seluruh santri</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center">
                        <ChartContainer config={{}} className="h-[250px] w-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="ml-6">
                          <div className="text-5xl font-bold text-[#1a5f3c]">
                            {Math.round((avgHafalan / 30) * 100)}%
                          </div>
                          <p className="text-gray-500 mt-2">dari 30 Juz</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Monthly Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#1a5f3c]">Tren Hafalan Bulanan</CardTitle>
                    <CardDescription>Jumlah setoran hafalan per bulan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{}} className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="bulan" tick={{ fill: '#1a5f3c' }} />
                          <YAxis tick={{ fill: '#1a5f3c' }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="hafalan" 
                            stroke="#1a5f3c" 
                            strokeWidth={3}
                            dot={{ fill: '#c9a227', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Ranking Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#1a5f3c] flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#c9a227]" />
                      Ranking Santri
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Rank</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>NIS</TableHead>
                          <TableHead>Total Hafalan</TableHead>
                          <TableHead>Persentase</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ranking.map((santri, index) => (
                          <TableRow key={santri.id}>
                            <TableCell>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0 ? 'bg-[#c9a227] text-white' :
                                index === 1 ? 'bg-gray-300 text-gray-700' :
                                index === 2 ? 'bg-amber-600 text-white' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {index + 1}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{santri.name}</TableCell>
                            <TableCell>{santri.nis}</TableCell>
                            <TableCell>{santri.totalJuz.toFixed(1)} Juz</TableCell>
                            <TableCell>{Math.round((santri.totalJuz / 30) * 100)}%</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={(santri.totalJuz / 30) * 100} 
                                  className="h-2 w-24"
                                />
                                <span className="text-sm text-gray-500">
                                  {Math.round((santri.totalJuz / 30) * 100)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Data Santri View */}
            {currentView === 'data-santri' && (
              <motion.div
                key="data-santri"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-[#1a5f3c]">Data Santri</CardTitle>
                        <CardDescription>Daftar lengkap santri tahfizh</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Cari santri..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] custom-scrollbar">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>NIS</TableHead>
                            <TableHead>Jenis Kelamin</TableHead>
                            <TableHead>Total Hafalan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSantri.map((santri) => (
                            <TableRow key={santri.id}>
                              <TableCell className="font-medium">{santri.name}</TableCell>
                              <TableCell>{santri.nis}</TableCell>
                              <TableCell>{santri.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                              <TableCell>{santri.totalJuz.toFixed(1)} Juz</TableCell>
                              <TableCell>
                                <Badge variant={santri.status === 'AKTIF' ? 'default' : 'secondary'}>
                                  {santri.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress 
                                    value={(santri.totalJuz / 30) * 100} 
                                    className="h-2 w-24"
                                  />
                                  <span className="text-sm text-gray-500">
                                    {Math.round((santri.totalJuz / 30) * 100)}%
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Input Setoran View */}
            {currentView === 'input-setoran' && (
              <motion.div
                key="input-setoran"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#1a5f3c]">Input Setoran Hafalan</CardTitle>
                    <CardDescription>Catat setoran hafalan santri</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Nama Santri</Label>
                          <Select 
                            value={newHafalan.santriId} 
                            onValueChange={(value) => setNewHafalan({...newHafalan, santriId: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih santri" />
                            </SelectTrigger>
                            <SelectContent>
                              {santriList.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.name} - {s.nis}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Tanggal</Label>
                          <Input
                            type="date"
                            value={newHafalan.tanggal}
                            onChange={(e) => setNewHafalan({...newHafalan, tanggal: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Juz</Label>
                          <Select 
                            value={newHafalan.juz.toString()} 
                            onValueChange={(value) => setNewHafalan({...newHafalan, juz: parseInt(value)})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Juz" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 30}, (_, i) => i + 1).map((juz) => (
                                <SelectItem key={juz} value={juz.toString()}>
                                  Juz {juz}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Surah</Label>
                          <Input
                            placeholder="Nama Surah"
                            value={newHafalan.surah}
                            onChange={(e) => setNewHafalan({...newHafalan, surah: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Ayat Mulai</Label>
                            <Input
                              type="number"
                              value={newHafalan.ayatMulai}
                              onChange={(e) => setNewHafalan({...newHafalan, ayatMulai: parseInt(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Ayat Selesai</Label>
                            <Input
                              type="number"
                              value={newHafalan.ayatSelesai}
                              onChange={(e) => setNewHafalan({...newHafalan, ayatSelesai: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Jenis Setoran</Label>
                          <Select 
                            value={newHafalan.jenisSetoran} 
                            onValueChange={(value: 'ZIYADAH' | 'MURAJAAH') => setNewHafalan({...newHafalan, jenisSetoran: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ZIYADAH">Ziyadah (Hafalan Baru)</SelectItem>
                              <SelectItem value="MURAJAAH">Muraja'ah (Mengulang)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Nilai</Label>
                          <Select 
                            value={newHafalan.nilai} 
                            onValueChange={(value) => setNewHafalan({...newHafalan, nilai: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih nilai" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A - Sangat Baik</SelectItem>
                              <SelectItem value="A-">A- - Baik Sekali</SelectItem>
                              <SelectItem value="B+">B+ - Baik</SelectItem>
                              <SelectItem value="B">B - Cukup Baik</SelectItem>
                              <SelectItem value="C">C - Perlu Perbaikan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Catatan Guru</Label>
                          <Textarea
                            placeholder="Catatan tambahan..."
                            value={newHafalan.catatan}
                            onChange={(e) => setNewHafalan({...newHafalan, catatan: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                        Batal
                      </Button>
                      <Button 
                        className="bg-[#1a5f3c] hover:bg-[#154d31]"
                        onClick={handleAddHafalan}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Simpan Setoran
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Hafalan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#1a5f3c]">Setoran Terbaru</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] custom-scrollbar">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Santri</TableHead>
                            <TableHead>Surah</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Nilai</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {hafalanList.slice().reverse().map((h) => (
                            <TableRow key={h.id}>
                              <TableCell>
                                {new Date(h.tanggal).toLocaleDateString('id-ID')}
                              </TableCell>
                              <TableCell className="font-medium">{h.santriName}</TableCell>
                              <TableCell>{h.surah} ({h.ayatMulai}-{h.ayatSelesai})</TableCell>
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
                                  ${h.nilai === 'B' ? 'bg-blue-400' : ''}
                                  ${h.nilai === 'C' ? 'bg-orange-500' : ''}
                                `}>
                                  {h.nilai}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
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
                    <CardDescription>Ringkasan hafalan bulanan santri</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-[#1a5f3c]/5 rounded-lg">
                        <p className="text-sm text-gray-500">Total Setoran</p>
                        <p className="text-2xl font-bold text-[#1a5f3c]">{hafalanList.length}</p>
                      </div>
                      <div className="p-4 bg-[#c9a227]/10 rounded-lg">
                        <p className="text-sm text-gray-500">Ziyadah</p>
                        <p className="text-2xl font-bold text-[#c9a227]">
                          {hafalanList.filter(h => h.jenisSetoran === 'ZIYADAH').length}
                        </p>
                      </div>
                      <div className="p-4 bg-[#2d7a50]/5 rounded-lg">
                        <p className="text-sm text-gray-500">Muraja'ah</p>
                        <p className="text-2xl font-bold text-[#2d7a50]">
                          {hafalanList.filter(h => h.jenisSetoran === 'MURAJAAH').length}
                        </p>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Santri</TableHead>
                          <TableHead>Surah</TableHead>
                          <TableHead>Ayat</TableHead>
                          <TableHead>Jenis</TableHead>
                          <TableHead>Nilai</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hafalanList.filter(h => 
                          new Date(h.tanggal).getMonth() === 0 && 
                          new Date(h.tanggal).getFullYear() === 2026
                        ).map((h) => (
                          <TableRow key={h.id}>
                            <TableCell>
                              {new Date(h.tanggal).toLocaleDateString('id-ID')}
                            </TableCell>
                            <TableCell className="font-medium">{h.santriName}</TableCell>
                            <TableCell>{h.surah}</TableCell>
                            <TableCell>{h.ayatMulai} - {h.ayatSelesai}</TableCell>
                            <TableCell>
                              <Badge variant={h.jenisSetoran === 'ZIYADAH' ? 'default' : 'secondary'}>
                                {h.jenisSetoran}
                              </Badge>
                            </TableCell>
                            <TableCell>{h.nilai}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-r from-[#1a5f3c]/10 to-[#c9a227]/10 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Nilai Rata-rata</p>
                      <p className="text-5xl font-bold text-[#c9a227]">A-</p>
                      <p className="text-sm text-gray-500 mt-2">Sangat Baik</p>
                    </div>
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
                      <CardTitle className="text-[#1a5f3c]">Progress Per Santri</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{}} className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={progressData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 30]} />
                            <YAxis dataKey="name" type="category" width={80} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="juz" fill="#1a5f3c" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1a5f3c]">Distribusi Nilai</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{}} className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'A', value: 3, color: '#22c55e' },
                                { name: 'A-', value: 2, color: '#4ade80' },
                                { name: 'B+', value: 1, color: '#3b82f6' },
                                { name: 'B', value: 1, color: '#60a5fa' }
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {COLORS.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={
                                  ['#22c55e', '#4ade80', '#3b82f6', '#60a5fa'][index]
                                } />
                              ))}
                            </Pie>
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Export View */}
            {currentView === 'export' && (
              <motion.div
                key="export"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#1a5f3c]">Export Laporan</CardTitle>
                    <CardDescription>Download laporan dalam format PDF</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <button className="p-6 border-2 border-dashed border-[#1a5f3c]/30 rounded-lg hover:border-[#1a5f3c] hover:bg-[#1a5f3c]/5 transition-all text-left group">
                        <FileText className="w-10 h-10 text-[#1a5f3c] mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-[#1a5f3c] mb-2">Laporan Bulanan</h3>
                        <p className="text-sm text-gray-500">Download laporan hafalan bulanan</p>
                      </button>
                      
                      <button className="p-6 border-2 border-dashed border-[#c9a227]/30 rounded-lg hover:border-[#c9a227] hover:bg-[#c9a227]/5 transition-all text-left group">
                        <FileText className="w-10 h-10 text-[#c9a227] mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-[#c9a227] mb-2">Laporan Semester</h3>
                        <p className="text-sm text-gray-500">Download laporan semester</p>
                      </button>
                      
                      <button className="p-6 border-2 border-dashed border-[#2d7a50]/30 rounded-lg hover:border-[#2d7a50] hover:bg-[#2d7a50]/5 transition-all text-left group">
                        <Award className="w-10 h-10 text-[#2d7a50] mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-[#2d7a50] mb-2">Rapor Tahfizh</h3>
                        <p className="text-sm text-gray-500">Cetak rapor tahfizh santri</p>
                      </button>
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
