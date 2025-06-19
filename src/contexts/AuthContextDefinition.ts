import { createContext } from 'react';
import { FieldValue, Timestamp } from 'firebase/firestore';

/**
 * Mendefinisikan struktur data untuk profil pengguna yang disimpan di Firestore.
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;

  /** Tipe data untuk menangani objek Timestamp dari Firestore atau Date dari client. */
  createdAt: Date | Timestamp | FieldValue;
  /** Tipe data untuk menangani objek Timestamp dari Firestore atau Date dari client. */
  updatedAt: Date | Timestamp | FieldValue;

  /** Pengaturan notifikasi untuk pengguna. */
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  /** Pengaturan sistem yang spesifik untuk pengguna. */
  systemSettings?: {
    timezone: string;
    dateFormat: string;
    language: string;
    autoBackup: boolean;
    maxAttendanceTime: string; // Contoh: "17:00"
  };

  /** Peran pengguna di dalam sistem untuk kontrol akses. */
  role: 'super_admin' | 'admin' | 'manager' | 'employee';
  
  /** Informasi terkait pekerjaan pengguna. */
  department?: string;
  position?: string;
  employeeId?: string;
}

/**
 * Representasi lengkap dari pengguna di dalam aplikasi.
 * Menggabungkan data profil dari Firestore (`UserProfile`) dengan status otentikasi dari Firebase Auth.
 */
export interface AppUser extends UserProfile {
  emailVerified: boolean;
}

/**
 * Mendefinisikan bentuk (shape) dari nilai yang disediakan oleh AuthContext.
 */
export interface AuthContextType {
  /** Objek pengguna yang sedang login, atau null jika tidak ada. */
  appUser: AppUser | null;
  
  /** Fungsi untuk proses login pengguna. */
  login: (email: string, password: string) => Promise<void>;
  
  /** Fungsi untuk mendaftarkan pengguna baru beserta profilnya. */
  register: (email: string, password: string, profile: Partial<UserProfile>) => Promise<void>;
  
  /** Fungsi untuk proses logout pengguna. */
  logout: () => Promise<void>;
  
  /** Status loading untuk menandakan proses otentikasi sedang berlangsung. */
  loading: boolean;
}

/**
 * React Context untuk menyediakan data dan fungsi otentikasi ke seluruh aplikasi.
 * Dimulai dengan `undefined` untuk memungkinkan pengecekan apakah komponen berada di dalam Provider.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);