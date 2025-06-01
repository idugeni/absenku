import React from 'react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Home, FileText, Settings, Users, BarChart } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToExcel(data: Record<string, any>[], fileName: string, sheetName: string, options?: { columnWidths?: { wch: number }[], wrapText?: boolean }) {
  const ws = XLSX.utils.json_to_sheet(data);

  if (options?.columnWidths) {
    ws['!cols'] = options.columnWidths;
  }

  if (options?.wrapText) {
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell_address]) continue;
        if (!ws[cell_address].s) ws[cell_address].s = {};
        ws[cell_address].s.alignment = { wrapText: true };
      }
    }
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(dataBlob, fileName + '.xlsx');
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
