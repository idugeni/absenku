import { createContext } from 'react';
import { User } from 'firebase/auth';

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  name?: string; // Add name as an alias for displayName
  photoURL?: string;
  phoneNumber?: string;
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
  role?: 'super_admin' | 'admin' | 'manager' | 'employee';
  department?: string;
  position?: string;
  employeeId?: string;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);