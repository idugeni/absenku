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
  Timestamp,
  getDocs,
  where
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
    eventId: string,
    eventData: Partial<Omit<Event, "id">>
  ) => {
     try {
      const q = query(collection(db, collectionName), where('id', '==', eventId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: 'Error',
          description: 'Event not found.',
          variant: 'destructive',
        });
        return;
      }

      const firestoreDocId = querySnapshot.docs[0].id;

      const dataToUpdate = convertDatesToTimestamps({
        ...eventData,
        updatedAt: new Date(),
      });
      await updateDoc(doc(db, collectionName, firestoreDocId), dataToUpdate);
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

          
          if (event.endDate instanceof Date && event.endDate < now && event.status !== 'completed' && event.status !== 'cancelled') {
            
            if (event.id) {
              updateEvent(event.id, { status: 'completed' });
            }
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
      const token = uuidv4();

      
      const initialDataToSave = convertDatesToTimestamps({
        ...eventInput,
        qrCodeToken: token,
        createdAt: now,
        updatedAt: now,
      });

      
      const docRef = await addDoc(collection(db, collectionName), initialDataToSave);
      const firestoreDocId = docRef.id;

      
      const qrCodeValidityDuration = 60 * 60 * 1000;
      const qrCodeValidUntil = new Date(now.getTime() + qrCodeValidityDuration);

      
      const qrCodeBase64 = await generateEventQRCode({ eventId: firestoreDocId, token });

      
      await updateDoc(doc(db, collectionName, firestoreDocId), {
        id: firestoreDocId,
        qrCode: qrCodeBase64,
        qrCodeValidUntil: qrCodeValidUntil,
      });

      toast({ title: "Berhasil", description: "Event ditambahkan." });
      return firestoreDocId;
    } catch (error) {
      toast({
        title: "Error",
        description: `Error adding ${collectionName}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {

      const q = query(collection(db, collectionName), where('id', '==', eventId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: 'Error',
          description: 'Event not found.',
          variant: 'destructive',
        });

        return;
      }

      
      const docToDelete = querySnapshot.docs[0];
      const firestoreDocId = docToDelete.id;

      
      const attendanceCollectionRef = collection(db, 'attendance');
      const attendanceQuery = query(attendanceCollectionRef, where('eventId', '==', eventId));
      const attendanceSnapshot = await getDocs(attendanceQuery);

      const deleteAttendancePromises = attendanceSnapshot.docs.map(async (attendanceDoc) => {
        await deleteDoc(doc(db, 'attendance', attendanceDoc.id));
      });

      await Promise.all(deleteAttendancePromises);

      await deleteDoc(doc(db, collectionName, firestoreDocId));
      toast({ title: "Berhasil", description: "Event dan absensi terkait dihapus." });
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