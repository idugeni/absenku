import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp, // Import Timestamp explicitly
} from 'firebase/firestore';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale'; // Rename 'id' to avoid conflict

// UI Components & Icons
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QrCode, Calendar, MapPin, Users, Loader2 } from 'lucide-react'; // Removed Clock as it's unused

// Custom Hooks & Types
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { useToast } from '@/components/ui/use-toast';
import { Event } from '@/types';

// Constants
const FIRESTORE_COLLECTIONS = {
  EVENTS: 'events',
  PEGAWAI: 'pegawai',
  ATTENDANCE: 'attendance',
};

// Interfaces
interface PegawaiData {
  nama: string;
  nip: string;
}

interface AttendanceData {
  nama: string;
  nip: string;
  timestamp: Timestamp; // Explicitly using Firebase Timestamp
  // Consider if [key: string]: unknown is still truly necessary.
  // If it is, add a comment explaining its purpose.
  // For example: // Allows for potential future dynamic fields
  [key: string]: unknown;
}

const Absensi: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { firestore, addAttendance } = useAppFirestore();

  const eventId = searchParams.get('eventId');
  const token = searchParams.get('token'); // Assuming token is still used for validation elsewhere or future use

  const [nip, setNip] = useState<string>('');
  const [eventData, setEventData] = useState<Event | null>(null);
  const [eventDocId, setEventDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);

  const fetchEventDetails = useCallback(async () => {

    if (!eventId) {
      toast({
        title: 'Error Kredensial',
        description: 'Event ID tidak ditemukan pada parameter URL.',
        variant: 'destructive',
      });
      setIsLoading(false);
      navigate('/'); // Redirect to a safe page if eventId is crucial
      return;
    }

    setIsLoading(true);
    try {
      // Add a check here to ensure eventId is not empty before querying
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

        // Basic validation for essential event data
        if (data.name && data.startDate && data.qrCodeToken) {
          setEventData(data);
        } else {
          toast({
            title: 'Error Data Event',
            description: 'Data event tidak lengkap. Mohon periksa kembali informasi event.',
            variant: 'destructive',
          });
          setEventData(null); // Ensure inconsistent data is not used
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

  const getUserLocation = useCallback(() => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Gagal Mendapatkan Lokasi",
            description: "Mohon izinkan akses lokasi untuk melanjutkan absensi.",
            variant: "destructive",
          });
          setIsGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast({
        title: "Lokasi Tidak Didukung",
        description: "Browser Anda tidak mendukung Geolocation API.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
    }
  }, [toast]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const handleAbsensi = async () => {
    if (!nip.trim()) {
      toast({
        title: 'Input Tidak Valid',
        description: 'Mohon masukkan NIP Anda dengan benar.',
        variant: 'destructive',
      });
      return;
    }

    if (!eventId || !eventDocId || !eventData || !userLocation) {
      toast({
        title: 'Error Event',
        description: 'Informasi event atau lokasi tidak tersedia atau tidak valid untuk melakukan absensi.',
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
        // If attendance already exists, navigate to thank you page
        setIsSubmitting(false);
        navigate(`/thank-you?eventName=${eventData.name.replace(/ /g, '-')}&pegawaiName=${currentPegawaiData.nama.replace(/ /g, '-')}`);
        return;
      }

      // Add new attendance using addAttendance from useAppFirestore
      const newAttendanceData = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        eventId: eventId,
        pegawaiId: pegawaiId,
        nama: currentPegawaiData.nama,
        nip: currentPegawaiData.nip,
        event: eventData, // Pass event data to useAttendanceStore for status calculation
      };

      await addAttendance(newAttendanceData);

      setNip('');
      // Navigation already handled above for both existing and new attendance

    } catch (error) {

      toast({
        title: 'Kesalahan Sistem',
        description: 'Gagal melakukan absensi. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateValue: Date | Timestamp | string): string => {
    try {
      const dateToFormat = dateValue instanceof Timestamp ? dateValue.toDate() : new Date(dateValue);
      return format(dateToFormat, 'dd MMMM yyyy HH:mm', { locale: localeID });
    } catch (error) {

      return 'Tanggal tidak valid';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Memuat detail event, mohon tunggu...</p>
        {/* Optionally, add a spinner component here */}
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="container mx-auto p-4 flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold text-destructive mb-4">Gagal Memuat Event</h2>
        <p className="text-gray-600 mb-6">
          Detail event tidak dapat ditampilkan. Pastikan ID event sudah benar atau coba lagi nanti.
        </p>
        <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex justify-center items-start min-h-screen pt-10">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {eventData.name}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 pt-1">
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                {formatDate(eventData.startDate)} - {formatDate(eventData.endDate)}
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <MapPin className="h-5 w-5 flex-shrink-0 text-blue-500" />
            <span>{eventData.location || 'Lokasi tidak ditentukan'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Users className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span>
              {eventData.assignedPegawai?.length || 0} Pegawai Ditugaskan
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <QrCode className="h-5 w-5 flex-shrink-0 text-purple-500" />
            {/* Consider if displaying the token is necessary for the user */}
            <span>Token QR: {eventData.qrCodeToken || 'N/A'}</span>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <label htmlFor="nip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Induk Pegawai (NIP)
            </label>
            <Input
              id="nip"
              type="text" // Consider type="number" if NIP is always numeric, but text is safer for leading zeros.
              placeholder="Masukkan NIP Anda di sini"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              className="mt-1 w-full dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              disabled={isSubmitting}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Pastikan NIP sesuai dengan yang terdaftar.
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800 p-6 rounded-b-lg">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isGettingLocation || !userLocation}
            >
              {isSubmitting || isGettingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isGettingLocation ? 'Mendapatkan Lokasi...' : (isSubmitting ? 'Memproses Absensi...' : 'Absen Sekarang')}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Absensi;