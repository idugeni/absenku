export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  assignedPegawai: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  qrCode: string;
  qrCodeToken?: string;
  qrCodeValidUntil?: Date;
}

export interface Pegawai {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  email: string;
  position?: string;
  phoneNumber?: string;
  status: 'aktif' | 'pensiun' | 'cuti';
  tanggalBergabung: Date;
  photoUrl?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  position?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  systemSettings?: {
    timezone: string;
    dateFormat: string;
    language: string;
    autoBackup: boolean;
    maxAttendanceTime: string;
  };
}

export interface Attendance {
  id?: string;
  eventId: string;
  pegawaiId: string;
  employeeName: string;
  nip: string;
  status: 'present' | 'late' | 'absent';
  checkInTime?: Date;
  checkOutTime?: Date;
  createdAt: Date;
  location?: string;
  notes?: string;
  event: Event;
}
