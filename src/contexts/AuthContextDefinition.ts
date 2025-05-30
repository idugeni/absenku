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
  name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'employee';
  department?: string;
  position?: string;
  employeeId?: string;
  phone?: string;
  createdAt: Date;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);