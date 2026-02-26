'use client';

import { useState } from 'react';
import { useAppStore, UserRole } from '@/lib/store';
import { LoginPage } from '@/components/login-page';
import { TeacherDashboard } from '@/components/teacher-dashboard';
import { GuardianDashboard } from '@/components/guardian-dashboard';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const { user, isAuthenticated, currentView } = useAppStore();

  return (
    <main className="min-h-screen bg-background">
      {!isAuthenticated ? (
        <LoginPage />
      ) : user?.role === 'GURU' ? (
        <TeacherDashboard />
      ) : (
        <GuardianDashboard />
      )}
      <Toaster />
    </main>
  );
}
