import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { format, addHours, subHours } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Event } from '@/types';

const FIRESTORE_COLLECTIONS = {
  EVENTS: 'events',
  PEGAWAI: 'pegawai',
  ATTENDANCE: 'attendance',
};

interface PegawaiData {
  nama: string;
  nip: string;
}

interface UseAbsensiResult {
  nip: string;
  setNip: (nip: string) => void;
  eventData: Event | null;
  isLoading: boolean;
  isSubmitting: boolean;
  handleAbsensi: () => Promise<void>;
}

export const useAbsensi = (): UseAbsensiResult => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { firestore, addAttendance } = useAppFirestore();

  const eventId = searchParams.get('eventId');
  const token = searchParams.get('token');

  const [nip, setNip] = useState<string>('');
  const [eventData, setEventData] = useState<Event | null>(null);
  const [eventDocId, setEventDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchEventDetails = useCallback(async () => {
    if (!eventId) {
      toast({
        title: 'Error Kredensial',
        description: 'Event ID tidak ditemukan pada parameter URL.',
        variant: 'destructive',
      });
      setIsLoading(false);
      navigate('/');
      return;
    }

    setIsLoading(true);
    try {
      if (!eventId || !token) {
        toast({
          title: 'Error Kredensial',
          description: 'Event ID atau Token tidak ditemukan pada parameter URL.',
          variant: 'destructive',
        });
        setIsLoading(false);
        navigate('/');
        return;
      }

      const docRef = doc(firestore, FIRESTORE_COLLECTIONS.EVENTS, eventId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Event;
        setEventDocId(docSnap.id);

        if (data.name && data.startDate && data.qrCodeToken) {
          setEventData(data);
        } else {
          toast({
            title: 'Error Data Event',
            description: 'Data event tidak lengkap. Mohon periksa kembali informasi event.',
            variant: 'destructive',
          });
          setEventData(null);
        }
      } else {
        toast({
          title: 'Event Tidak Ditemukan',
          description: `Event dengan ID "${eventId}" tidak ditemukan.`,
          variant: 'destructive',
        });
        setEventData(null);
      }
    } catch (error) {
      toast({
        title: 'Kesalahan Sistem',
        description: 'Gagal memuat detail event. Silakan coba beberapa saat lagi.',
        variant: 'destructive',
      });
      setEventData(null);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, token, firestore, toast, navigate]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleAbsensi = useCallback(async () => {
    if (!nip.trim()) {
      toast({
        title: 'Input Tidak Valid',
        description: 'Mohon masukkan NIP Anda dengan benar.',
        variant: 'destructive',
      });
      return;
    }

    if (!eventId || !eventDocId || !eventData) {
      toast({
        title: 'Error Event',
        description: 'Informasi event tidak tersedia atau tidak valid untuk melakukan absensi.',
        variant: 'destructive',
      });
      return;
    }

    if (token !== eventData.qrCodeToken) {
      toast({
        title: 'Token Tidak Sesuai',
        description: 'Token QR Code tidak valid untuk event ini.',
        variant: 'destructive',
      });
      return;
    }

    const now = new Date();
    const eventStartDate = eventData.startDate instanceof Timestamp ? eventData.startDate.toDate() : new Date(eventData.startDate);
    const eventEndDate = eventData.endDate instanceof Timestamp ? eventData.endDate.toDate() : new Date(eventData.endDate);

    const scanStartTime = subHours(eventStartDate, 1);
    const scanEndTime = addHours(eventEndDate, 1);

    if (now < scanStartTime || now > scanEndTime) {
      toast({
        title: 'Waktu Absensi Tidak Valid',
        description: `Absensi hanya dapat dilakukan antara ${format(scanStartTime, 'dd MMMM yyyy HH:mm', { locale: localeID })} dan ${format(scanEndTime, 'dd MMMM yyyy HH:mm', { locale: localeID })}.`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const pegawaiQuery = query(
        collection(firestore, FIRESTORE_COLLECTIONS.PEGAWAI),
        where('nip', '==', nip.trim())
      );
      const pegawaiSnapshot = await getDocs(pegawaiQuery);

      if (pegawaiSnapshot.empty) {
        toast({
          title: 'Pegawai Tidak Ditemukan',
          description: `NIP "${nip.trim()}" yang Anda masukkan tidak terdaftar.`,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const pegawaiDoc = pegawaiSnapshot.docs[0];
      const pegawaiId = pegawaiDoc.id;
      const currentPegawaiData = pegawaiDoc.data() as PegawaiData;

      const attendanceQuery = query(
        collection(firestore, FIRESTORE_COLLECTIONS.ATTENDANCE),
        where('eventId', '==', eventId),
        where('pegawaiId', '==', pegawaiId)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);

      if (!attendanceSnapshot.empty) {
        setIsSubmitting(false);
        navigate(`/thank-you?eventName=${eventData.name.replace(/ /g, '-')}&pegawaiName=${currentPegawaiData.nama.replace(/ /g, '-')}`);
        return;
      }

      const newAttendanceData = {
        eventId: eventId,
        pegawaiId: pegawaiId,
        nama: currentPegawaiData.nama,
        nip: currentPegawaiData.nip,
        event: eventData,
      };

      await addAttendance(newAttendanceData);

      setNip('');
    } catch (error) {
      toast({
        title: 'Kesalahan Sistem',
        description: 'Gagal melakukan absensi. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [nip, eventId, eventDocId, eventData, token, firestore, addAttendance, navigate, toast]);

  return {
    nip,
    setNip,
    eventData,
    isLoading,
    isSubmitting,
    handleAbsensi,
  };
};