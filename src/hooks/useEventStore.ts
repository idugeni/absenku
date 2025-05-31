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
import { useToast } from "@/components/ui/use-toast";
import { Event } from "@/types";
import { convertDatesToTimestamps } from "@/utils/firebaseDateUtils";
import { processSnapshot } from "@/utils/firestoreListenerUtils";
import { generateEventQRCode } from "@/utils/qrcodeUtils";
import { v4 as uuidv4 } from 'uuid';

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
      toast({
        title: "Error",
        description: `Error updating ${collectionName}: ${error.message}`,
        variant: "destructive",
      });
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
        toast({
          title: "Error",
          description: `Error fetching ${collectionName}: ${error.message}`,
          variant: "destructive",
        });
        setEventsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [toast, updateEvent, collectionName]);

  const addEvent = async (
    eventInput: Omit<Event, "id" | "createdAt" | "updatedAt" | "qrCode" | "qrCodeValidUntil">
  ) => {
    try {
      const now = new Date();
      const eventId = uuidv4(); // Generate a unique ID for the event
      const token = uuidv4(); // Generate a unique token for the QR code

      // Calculate QR code validity (e.g., 1 hour from now)
      const qrCodeValidityDuration = 60 * 60 * 1000; // 1 hour in milliseconds
      const qrCodeValidUntil = new Date(now.getTime() + qrCodeValidityDuration);

      const qrCodeBase64 = await generateEventQRCode({ eventId, token });

      const dataToSave = convertDatesToTimestamps({
        ...eventInput,
        id: eventId, // Assign the generated eventId
        qrCode: qrCodeBase64,
        qrCodeValidUntil: qrCodeValidUntil,
        qrCodeToken: token,
        createdAt: now,
        updatedAt: now,
      });
      const docRef = await addDoc(collection(db, collectionName), dataToSave);
      toast({ title: "Berhasil", description: "Event ditambahkan." });
      return docRef.id;
    } catch (error) {
      toast({
        title: "Error",
        description: `Error adding ${collectionName}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({ title: "Berhasil", description: "Event dihapus." });
    } catch (error) {
      toast({
        title: "Error",
        description: `Error deleting ${collectionName}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return { events, eventsLoading, addEvent, updateEvent, deleteEvent };
};