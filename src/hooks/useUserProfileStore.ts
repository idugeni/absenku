// src/hooks/useUserProfileStore.ts
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "./use-toast";
import { UserProfile } from "@/types";
import { convertDatesToTimestamps } from "@/utils/firebaseDateUtils";

export interface UseUserProfileStoreReturn {
  updateUserProfile: (
    userId: string,
    profileData: Partial<UserProfile>
  ) => Promise<void>;
  // getUserProfile dapat ditambahkan di sini jika perlu mengambil data profil
}

export const useUserProfileStore = (): UseUserProfileStoreReturn => {
  const { toast } = useToast();

  const updateUserProfile = async (
    userId: string,
    profileData: Partial<UserProfile>
  ) => {
    try {
      // Asumsi UserProfile disimpan di koleksi 'users' dengan ID dokumen = userId
      const userDocRef = doc(db, "users", userId);
      const dataToUpdate = convertDatesToTimestamps({
        ...profileData,
        updatedAt: new Date(), // Selalu update timestamp updatedAt
      });
      await updateDoc(userDocRef, dataToUpdate);
      toast({ title: "Berhasil", description: "Profil pengguna diperbarui." });
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast({ title: "Error", description: "Gagal memperbarui profil.", variant: "destructive" });
    }
  };

  return { updateUserProfile };
};