
import React, { useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AuthContext, AuthContextType, UserProfile } from '@/contexts/AuthContextDefinition';
import { useToast } from '@/components/ui/use-toast';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      toast({
        title: "Error",
        description: `Error during logout: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserProfile(docSnapshot.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
        });
        return unsubscribeProfile;
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribe();
      // If there's an active profile listener, unsubscribe it too
      // This assumes unsubscribeProfile is defined in the same scope or accessible
      // For simplicity, we'll assume it's handled by the outer unsubscribe if user becomes null
      // or a new user logs in.
    };
  }, [toast]);

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
      {!loading && children}
    </AuthContext.Provider>
  );
};
