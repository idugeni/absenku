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
  qrCodeValue?: string;
}

export interface Pegawai {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  email: string;
  status: 'aktif' | 'pensiun' | 'cuti';
  tanggalBergabung: Date;
  photoUrl?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id?: string;
  eventId: string;
  pegawaiId: string;
  status: 'present' | 'late' | 'absent';
  checkInTime?: Date;
  checkOutTime?: Date;
  createdAt: Date;
  location?: string;
  notes?: string;
}