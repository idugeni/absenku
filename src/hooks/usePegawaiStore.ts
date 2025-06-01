import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from '@/components/ui/use-toast';
import { Pegawai } from "@/types";
import { convertDatesToTimestamps } from "@/utils/firebaseDateUtils";
import { generatePegawaiQRCode } from "@/utils/qrcodeUtils";
import { processSnapshot } from "@/utils/firestoreListenerUtils";

export interface UsePegawaiStoreReturn {
  pegawai: Pegawai[];
  pegawaiLoading: boolean;
  addPegawai: (
    pegawaiData: Omit<Pegawai, "id" | "createdAt" | "updatedAt" | "qrCode">
  ) => Promise<string | undefined>;
  updatePegawai: (
    id: string,
    pegawaiData: Partial<Omit<Pegawai, "id">>
  ) => Promise<void>;
  deletePegawai: (id: string) => Promise<void>;
}

export const usePegawaiStore = (): UsePegawaiStoreReturn => {
  const { toast } = useToast();
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
  const [pegawaiLoading, setPegawaiLoading] = useState(true);

  const collectionName = "pegawai";

  useEffect(() => {
    setPegawaiLoading(true);
    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = processSnapshot<Pegawai>(snapshot);
        setPegawai(data);
        setPegawaiLoading(false);
      },
      (error) => {

        toast({
          title: "Error",
          description: `Error fetching ${collectionName}: ${error.message}`,
          variant: "destructive",
        });
        setPegawaiLoading(false);
      }
    );
    return () => unsubscribe();
  }, [toast]);

  const addPegawai = async (
    pegawaiInput: Omit<Pegawai, "id" | "createdAt" | "updatedAt" | "qrCode">
  ) => {
    try {
      const now = new Date();
      const docId = pegawaiInput.nama.toLowerCase().replace(/\s+/g, '-');

      const dataToSave = convertDatesToTimestamps({
        ...pegawaiInput,
        createdAt: now,
        updatedAt: now,
      });

      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, dataToSave);

      const qrCode = await generatePegawaiQRCode({
        id: docRef.id,
        nip: pegawaiInput.nip,
        nama: pegawaiInput.nama,
      });
      if (qrCode) {
        await updateDoc(doc(db, collectionName, docRef.id), {
          qrCode: qrCode,
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }
      toast({ title: "Berhasil", description: "Pegawai ditambahkan." });
      return docRef.id;
    } catch (error) {
  
      toast({
        title: "Error",
        description: `Error adding ${collectionName}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const updatePegawai = async (
    id: string,
    pegawaiData: Partial<Omit<Pegawai, "id">>
  ) => {
    try {
      const dataToUpdate = convertDatesToTimestamps({
        ...pegawaiData,
        updatedAt: new Date(),
      });
      await updateDoc(doc(db, collectionName, id), dataToUpdate);
      toast({ title: "Berhasil", description: "Pegawai diperbarui." });
    } catch (error) {
  
      toast({
        title: "Error",
        description: `Error updating ${collectionName}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const deletePegawai = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({ title: "Berhasil", description: "Pegawai dihapus." });
    } catch (error) {
  
      toast({
        title: "Error",
        description: `Error deleting ${collectionName}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return { pegawai, pegawaiLoading, addPegawai, updatePegawai, deletePegawai };
};

export type { Pegawai };
