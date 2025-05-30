import React from 'react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Home, Scan, FileText, Settings, Users, BarChart } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  title: string;
  children?: NavItem[];
}

export const navigationItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Dashboard', title: 'Dashboard' },
  { to: '/reports', icon: BarChart, label: 'Laporan', title: 'Laporan Absensi' },
  { to: '/pegawai', icon: Users, label: 'Pegawai', title: 'Daftar Pegawai' },
  { to: '/events', icon: FileText, label: 'Kegiatan', title: 'Daftar Kegiatan' },
  { to: '/settings', icon: Settings, label: 'Pengaturan', title: 'Pengaturan Aplikasi' },
];

export const getPageTitle = (pathname: string, navItems: NavItem[]): string => {
  for (const item of navItems) {
    if (item.to === pathname) {
      return item.title;
    }
    if (pathname.startsWith(item.to + '/') && item.to !== '/') {
      if (item.label === 'Pegawai' && pathname !== item.to) return `Detail Pegawai`;
      return item.title;
    }}
  if (pathname.startsWith('/pegawai/')) return 'Detail Pegawai';
  return 'Absenku';
};
