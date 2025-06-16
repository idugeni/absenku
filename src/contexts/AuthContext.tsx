// src/contexts/AuthContext.tsx

import React, { useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'; // getDoc tidak digunakan, bisa dihapus jika tidak diperlukan
import { auth, db } from '@/lib/firebase';
import { AuthContext, AuthContextType, UserProfile } from '@/contexts/AuthContextDefinition';
import { useToast } from '@/components/ui/use-toast';


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Initial state is true
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, profile: Partial<UserProfile>) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: profile.displayName || profile.name || '',
      role: profile.role || 'employee',
      department: profile.department,
      position: profile.position,
      employeeId: profile.employeeId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Success",
        description: "Logout successful.",
      });
    } catch (error: any) { // Tambahkan any untuk tipe error
      toast({
        title: "Error",
        description: `Error during logout: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let unsubscribeUserProfile: (() => void) | undefined; // Deklarasi untuk menyimpan fungsi unsubscribe onSnapshot

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        // Pastikan unsubscribe dari langganan profil sebelumnya jika ada
        if (unsubscribeUserProfile) {
          unsubscribeUserProfile();
        }
        // Subscribe ke user profile dan simpan fungsi unsubscribe
        unsubscribeUserProfile = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserProfile(docSnapshot.data() as UserProfile);
          } else {
            setUserProfile(null);
            // Optional: Log jika profil tidak ditemukan, mungkin ada inkonsistensi data
            console.warn(`User profile not found for UID: ${user.uid}`);
          }
          // Di sini Anda bisa mempertimbangkan untuk mematikan loading juga
          // jika profil adalah bagian esensial dari proses loading.
          // Namun, biarkan setLoading(false) di luar if/else if ini
          // agar selalu dipanggil setelah onAuthStateChanged selesai.
        }, (error) => { // Tambahkan error handling untuk onSnapshot
            console.error("Error fetching user profile:", error);
            setUserProfile(null);
            toast({
                title: "Error",
                description: `Error fetching user profile: ${error.message}`,
                variant: "destructive",
            });
        });
      } else {
        // Jika tidak ada user, pastikan juga unsubscribe dari profile sebelumnya
        if (unsubscribeUserProfile) {
          unsubscribeUserProfile();
          unsubscribeUserProfile = undefined; // Reset
        }
        setUserProfile(null);
      }
      
      // Penting: Pastikan setLoading(false) dipanggil setelah onAuthStateChanged selesai memproses.
      // Ini harus di luar blok if (user) untuk memastikan selalu dipanggil.
      setLoading(false); 
    });

    // Cleanup function untuk useEffect
    return () => {
      unsubscribeAuth(); // Unsubscribe dari onAuthStateChanged
      if (unsubscribeUserProfile) { // Pastikan unsubscribe dari onSnapshot jika masih ada
        unsubscribeUserProfile();
      }
    };
  }, [toast]); // Dependency array: Pastikan ini benar.

  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {/*
        PERBAIKAN UTAMA DI SINI:
        Hapus kondisi {!loading && children}.
        Biarkan children selalu dirender. ProtectedRoute akan menangani
        tampilan loading dan redireksi berdasarkan 'loading' dan 'currentUser'.
      */}
      {children}
    </AuthContext.Provider>
  );
};