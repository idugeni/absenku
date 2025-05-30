// src/hooks/useAttendanceStore.ts
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  // updateDoc, deleteDoc, // Jika diperlukan di masa depan
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from '@/components/ui/use-toast';
import { Attendance } from "@/types";
import { convertDatesToTimestamps } from "@/utils/firebaseDateUtils";
import { processSnapshot } from "@/utils/firestoreListenerUtils";

export interface UseAttendanceStoreReturn {
  attendance: Attendance[];
  attendanceLoading: boolean;
  addAttendance: (
    attendanceData: Omit<Attendance, "id" | "createdAt" | "status">
  ) => Promise<string | undefined>;
  updateAttendance: (id: string, attendanceData: Partial<Attendance>) => Promise<void>;
}

import { Event } from "@/types";

export const useAttendanceStore = (): UseAttendanceStoreReturn => {
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const collectionName = "attendance";

  useEffect(() => {
    setAttendanceLoading(true);
    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = processSnapshot<Attendance>(snapshot);
        setAttendance(data);
        setAttendanceLoading(false);
      },
      (error) => {
        toast({
          title: "Error",
          description: `Error fetching ${collectionName}: ${error.message}`,
          variant: "destructive",
        });
        setAttendanceLoading(false);
      }
    );
    return () => unsubscribe();
  }, [toast]);

  const addAttendance = async (
    attendanceInput: Omit<Attendance, "id" | "createdAt" | "status"> & { event: Event }
  ) => {
    try {
      const checkInTime = new Date();
      const eventStartTime = attendanceInput.event.startDate;

      let status: 'present' | 'late' | 'absent' = 'present';
      if (checkInTime > eventStartTime) {
        status = 'late';
      }

      const dataToSave = convertDatesToTimestamps({
        ...attendanceInput,
        checkInTime,
        status,
        createdAt: new Date(),
      });
      const docRef = await addDoc(collection(db, collectionName), dataToSave);
      toast({ title: "Berhasil", description: "Absensi dicatat." });
      return docRef.id;
    } catch (error) {
      toast({
        title: "Error",
        description: `Error adding attendance: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const updateAttendance = async (id: string, attendanceData: Partial<Attendance>) => {
    try {
      const dataToUpdate = convertDatesToTimestamps(attendanceData);
      await updateDoc(doc(db, collectionName, id), dataToUpdate);
      toast({ title: "Berhasil", description: "Absensi diperbarui." });
    } catch (error) {
      toast({
        title: "Error",
        description: `Error updating attendance: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return { attendance, attendanceLoading, addAttendance, updateAttendance };
};