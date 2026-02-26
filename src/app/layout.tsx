import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Mutaba'ah Tahfizh 30 Juz",
  description: "Sistem monitoring hafalan Al-Qur'an yang modern dan transparan untuk mendukung santri dalam menghafal 30 juz Al-Qur'an.",
  keywords: ["Tahfizh", "Al-Qur'an", "Hafalan", "Santri", "Pesantren", "Islamic Education"],
  authors: [{ name: "Tahfizh Academy" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Sistem Mutaba'ah Tahfizh 30 Juz",
    description: "Monitoring hafalan Al-Qur'an yang modern dan transparan",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
