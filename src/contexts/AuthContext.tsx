// src/contexts/AuthContext.tsx

import React, { useEffect, useState, useMemo, useCallback, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, onSnapshot, serverTimestamp, FieldValue } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AppUser, AuthContext, AuthContextType, UserProfile } from '@/contexts/AuthContextDefinition';
import { useToast } from '@/components/ui/use-toast';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(async (email: string, password: string, profile: Partial<UserProfile>) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: profile.displayName || '',
      photoURL: profile.photoURL || user.photoURL || undefined,
      phoneNumber: profile.phoneNumber || user.phoneNumber || undefined,
      role: profile.role || 'employee',
      department: profile.department,
      position: profile.position,
      employeeId: profile.employeeId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notifications: profile.notifications,
      systemSettings: profile.systemSettings,
    };

    await setDoc(doc(db, 'users', user.uid), newProfile);
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      toast({
        title: "Success",
        description: "Logout successful.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Error",
        description: `Error during logout: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    // ... (kode useEffect tetap sama seperti sebelumnya) ...
    let unsubscribeUserProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        if (unsubscribeUserProfile) unsubscribeUserProfile();

        unsubscribeUserProfile = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const profileData = docSnapshot.data() as UserProfile;
            setAppUser({
              ...profileData,
              uid: user.uid,
              email: user.email!,
              emailVerified: user.emailVerified,
            });
          } else {
            console.warn(`User profile not found for UID: ${user.uid}.`);
            setAppUser({
                uid: user.uid,
                email: user.email!,
                displayName: user.displayName || '',
                photoURL: user.photoURL || undefined,
                phoneNumber: user.phoneNumber || undefined,
                emailVerified: user.emailVerified,
                role: 'employee',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user profile:", error);
          setAppUser(null);
          setLoading(false);
          toast({
            title: "Error",
            description: `Failed to fetch user profile: ${error.message}`,
            variant: "destructive",
          });
        });
      } else {
        if (unsubscribeUserProfile) unsubscribeUserProfile();
        setAppUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserProfile) unsubscribeUserProfile();
    };
  }, [toast]);

  // Sekarang, `useMemo` tidak perlu menyertakan fungsi-fungsi karena mereka sudah stabil
  const value = useMemo(() => ({
    appUser,
    login,
    register,
    logout,
    loading
  }), [appUser, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};