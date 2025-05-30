// src/hooks/useEventStore.ts
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "./use-toast";
import { Event } from "@/types";
import { convertDatesToTimestamps } from "@/utils/firebaseDateUtils";
import { processSnapshot } from "@/utils/firestoreListenerUtils";

export interface UseEventStoreReturn {
  events: Event[];
  eventsLoading: boolean;
  addEvent: (
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt" | "qrCode">
  ) => Promise<string | undefined>;
  updateEvent: (
    id: string,
    eventData: Partial<Omit<Event, "id">>
  ) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = (): UseEventStoreReturn => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const collectionName = "events";

  const updateEvent = useCallback(async (
    id: string,
    eventData: Partial<Omit<Event, "id">>
  ) => {
     try {
      const dataToUpdate = convertDatesToTimestamps({
        ...eventData,
        updatedAt: new Date(),
      });
      await updateDoc(doc(db, collectionName, id), dataToUpdate);
      toast({ title: "Berhasil", description: "Event diperbarui." });
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      toast({ title: "Error", description: "Gagal memperbarui event.", variant: "destructive" });
    }
  }, [toast, collectionName]);

  useEffect(() => {
    setEventsLoading(true);
    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = processSnapshot<Event>(snapshot);
        const now = new Date();
        data.forEach(event => {
          // Check if event end date is in the past and status is not already completed or cancelled
          if (event.endDate instanceof Date && event.endDate < now && event.status !== 'completed' && event.status !== 'cancelled') {
            // Automatically update status to completed
            updateEvent(event.id!, { status: 'completed' });
          }
        });
        setEvents(data);
        setEventsLoading(false);
      },
      (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        toast({ title: "Error", description: `Gagal mengambil data ${collectionName}.`});
        setEventsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [toast, updateEvent, collectionName]);

  const addEvent = async (
    eventInput: Omit<Event, "id" | "createdAt" | "updatedAt" | "qrCode">
  ) => {
    try {
      const now = new Date();
      const qrCode = `EV_QR_${eventInput.name
        .replace(/\s+/g, "_")
        .toUpperCase()}_${Date.now()}`;
      const dataToSave = convertDatesToTimestamps({
        ...eventInput,
        qrCode,
        createdAt: now,
        updatedAt: now,
      });
      const docRef = await addDoc(collection(db, collectionName), dataToSave);
      toast({ title: "Berhasil", description: "Event ditambahkan." });
      return docRef.id;
    } catch (error) {
      console.error(`Error adding ${collectionName}:`, error);
      toast({ title: "Error", description: "Gagal menambahkan event.", variant: "destructive" });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({ title: "Berhasil", description: "Event dihapus." });
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      toast({ title: "Error", description: "Gagal menghapus event.", variant: "destructive" });
    }
  };

  return { events, eventsLoading, addEvent, updateEvent, deleteEvent };
};