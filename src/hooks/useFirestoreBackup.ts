// src/hooks/useFirestoreBackup.ts
import {
    collection,
    getDocs,
    doc,
    writeBatch,
    query,
    DocumentData,
  } from "firebase/firestore";
  import { db } from "@/lib/firebase"; // Sesuaikan path jika perlu
  import { useToast } from '@/components/ui/use-toast';
  import {
    convertDatesToTimestamps,
    convertTimestampsToDates,
  } from "@/utils/firebaseDateUtils"; // Sesuaikan path jika perlu
  
  export interface UseFirestoreBackupReturn {
    exportCollectionToJson: (collectionName: string) => Promise<DocumentData[]>;
    importCollectionFromJson: (
      collectionName: string,
      jsonData: DocumentData[],
      merge?: boolean
    ) => Promise<void>;
  }
  
  export const useFirestoreBackup = (): UseFirestoreBackupReturn => {
    const { toast } = useToast();
  
    const exportCollectionToJson = async (collectionName: string) => {
      try {
        const colRef = collection(db, collectionName);
        const q = query(colRef);
        const querySnapshot = await getDocs(q);
        const data: DocumentData[] = [];
        querySnapshot.forEach((docSnap) => {
          data.push({
            id: docSnap.id,
            ...convertTimestampsToDates(docSnap.data()),
          });
        });
        return data;
      } catch (error: unknown) {
        toast({
          title: "Error",
          description: `Error exporting ${collectionName}: ${(error as Error).message}`,
          variant: "destructive",
        });
        return [];
      }
    };
  
    const importCollectionFromJson = async (
      collectionName: string,
      jsonData: DocumentData[],
      merge: boolean = true
    ) => {
      try {
        const colRef = collection(db, collectionName);
        const batch = writeBatch(db);
        for (const item of jsonData) {
          const { id, ...data } = item;
          const dataToSave = convertDatesToTimestamps(data);
          const docRef = id ? doc(db, collectionName, id) : doc(colRef);
          batch.set(docRef, dataToSave, { merge });
        }
        await batch.commit();
        toast({
          title: "Import Berhasil",
          description: `Impor ${jsonData.length} dokumen ke ${collectionName} berhasil.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Error importing ${collectionName}: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    };
  
    return {
      exportCollectionToJson,
      importCollectionFromJson,
    };
  };