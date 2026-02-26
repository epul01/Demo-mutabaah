'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, UserRole } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  Moon,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('GURU');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAppStore();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = await login(email, password, selectedRole);
    
    if (!success) {
      toast({
        title: 'Login Gagal',
        description: 'Username atau password salah',
        variant: 'destructive'
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Decorative */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#1a5f3c] via-[#2d7a50] to-[#1a5f3c] p-8 lg:p-16 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Islamic geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 islamic-pattern-gold" />
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#c9a227] rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#c9a227] rounded-full opacity-15 blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center text-white max-w-lg"
        >
          {/* Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-[#c9a227] rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
              <BookOpen className="w-12 h-12 text-[#1a5f3c]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Sistem Mutaba'ah Tahfizh
            </h1>
            <p className="text-[#c9a227] text-xl font-semibold">30 Juz</p>
          </div>
          
          {/* Description */}
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Sistem monitoring hafalan Al-Qur'an yang modern dan transparan untuk mendukung santri dalam menghafal 30 juz Al-Qur'an.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 gap-4 text-left">
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-[#c9a227] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#1a5f3c]" />
              </div>
              <div>
                <p className="font-semibold">Monitoring Hafalan</p>
                <p className="text-sm text-white/70">Pantau progress hafalan santri secara real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-[#c9a227] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#1a5f3c]" />
              </div>
              <div>
                <p className="font-semibold">Transparansi Wali</p>
                <p className="text-sm text-white/70">Wali santri dapat melihat perkembangan anak</p>
              </div>
            </div>
          </div>
          
          {/* Islamic decoration */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-[#c9a227]/50" />
            <Moon className="w-4 h-4 text-[#c9a227]" />
            <div className="h-px w-12 bg-[#c9a227]/50" />
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1a5f3c] mb-2">Assalamu'alaikum</h2>
            <p className="text-gray-600">Silakan login untuk melanjutkan</p>
          </div>
          
          {/* Role Selection */}
          <Tabs defaultValue="GURU" className="mb-6" onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <TabsList className="grid w-full grid-cols-2 bg-[#1a5f3c]/10">
              <TabsTrigger 
                value="GURU" 
                className="data-[state=active]:bg-[#1a5f3c] data-[state=active]:text-white"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Guru
              </TabsTrigger>
              <TabsTrigger 
                value="WALI"
                className="data-[state=active]:bg-[#1a5f3c] data-[state=active]:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Wali Santri
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Login Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center text-[#1a5f3c]">
                {selectedRole === 'WALI' ? 'Login Wali Santri' : 'Login Guru'}
              </CardTitle>
              <CardDescription className="text-center">
                {selectedRole === 'WALI' 
                  ? 'Masukkan email dan password akun wali santri Anda'
                  : 'Masukkan email dan password akun guru Anda'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email / Username</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="text"
                      placeholder="admin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300 text-[#1a5f3c] focus:ring-[#1a5f3c]" />
                    <span className="text-gray-600">Ingat saya</span>
                  </label>
                  <a href="#" className="text-sm text-[#1a5f3c] hover:text-[#c9a227] transition-colors">
                    Lupa password?
                  </a>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-[#1a5f3c] hover:bg-[#154d31] text-white py-6 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memproses...
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </form>
              
              {/* Demo hint */}
              <div className="mt-6 p-4 bg-[#c9a227]/10 rounded-lg border border-[#c9a227]/20">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#c9a227] mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-[#1a5f3c] mb-1">Kredensial Login</p>
                    <p className="text-gray-600">
                      Username: <span className="font-mono bg-gray-100 px-1 rounded">admin</span><br/>
                      Password: <span className="font-mono bg-gray-100 px-1 rounded">admin123</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2026 Sistem Mutaba'ah Tahfizh 30 Juz
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Dibuat dengan ❤️ untuk generasi penghafal Al-Qur'an
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
