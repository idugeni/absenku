import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from '@/components/ui/use-toast';
import { UserProfile } from "@/types";
import { convertDatesToTimestamps } from "@/utils/firebaseDateUtils";

export interface UseUserProfileStoreReturn {
  updateUserProfile: (
    userId: string,
    profileData: Partial<UserProfile>
  ) => Promise<void>;
}

export const useUserProfileStore = (): UseUserProfileStoreReturn => {
  const { toast } = useToast();

  const updateUserProfile = async (
    userId: string,
    profileData: Partial<UserProfile>
  ) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const dataToUpdate = convertDatesToTimestamps({
        ...profileData,
        updatedAt: new Date(),
      });
      await updateDoc(userDocRef, dataToUpdate);
      toast({ title: "Berhasil", description: "Profil pengguna diperbarui." });
    } catch (error) {
      toast({
        title: "Error",
        description: `Error updating user profile: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return { updateUserProfile };
};