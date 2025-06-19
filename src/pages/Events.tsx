// 1. Impor tipe 'Event' dari sumber kebenaran Anda
import { type Event } from '@/types'; // <-- SESUAIKAN PATH INI jika perlu
import { useEventStore } from '@/hooks/useEventStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit, Info, MapPin, MoreVertical, Trash2 } from 'lucide-react';
import { format, isBefore, isAfter } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Tipe untuk status acara agar lebih aman (type-safe)
type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

// 2. HAPUS definisi 'interface Event' lokal dari sini. Kita akan menggunakan yang diimpor.

// Fungsi status yang lebih bersih dan efisien
// Parameter 'event' sekarang secara otomatis menggunakan tipe 'Event' yang diimpor
const getEventStatus = (event: Event): EventStatus => {
  // Asumsi dari error: event.status dari store bisa jadi sudah mengandung status dinamis.
  // Jika event.status sudah ada dan valid, kita bisa prioritaskan itu.
  // Namun, kita tetap kalkulasi ulang untuk konsistensi, kecuali untuk 'cancelled'.
  if (event.status === 'cancelled') return 'cancelled';

  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  if (isBefore(now, startDate)) return 'upcoming';
  if (isAfter(now, endDate)) return 'completed';
  return 'ongoing';
};

// Konfigurasi untuk badge agar kode lebih rapi (Single Source of Truth)
const statusConfig: Record<EventStatus, { text: string; className: string }> = {
  upcoming: { text: 'Akan Datang', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  ongoing: { text: 'Sedang Berlangsung', className: 'bg-green-100 text-green-800 border-green-200' },
  completed: { text: 'Selesai', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  cancelled: { text: 'Dibatalkan', className: 'bg-red-100 text-red-800 border-red-200' },
};

// --- Komponen Skeleton (tidak berubah) ---
const EventCardSkeleton = () => (
  <Card className="flex flex-col animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </CardHeader>
    <CardContent className="flex-grow space-y-3 py-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </CardContent>
    <CardFooter className="flex justify-between items-center pt-4">
      <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
    </CardFooter>
  </Card>
);

const Events = () => {
  const { events, deleteEvent, eventsLoading } = useEventStore();
  const navigate = useNavigate();

  const handleDelete = (eventId: string) => {
    // Rekomendasi: Tampilkan modal konfirmasi sebelum menghapus
    deleteEvent(eventId);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengelolaan Kegiatan</h1>
          <p className="mt-1 text-base text-gray-500">
            Kelola semua kegiatan atau acara yang terdaftar di sini.
          </p>
        </div>
        <Button onClick={() => navigate('/events/new')} className="mt-4 sm:mt-0">
          Tambah Kegiatan Baru
        </Button>
      </div>

      {eventsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => <EventCardSkeleton key={index} />)}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 h-64 border-2 border-dashed rounded-lg">
          <Info className="h-12 w-12 mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold">Tidak Ada Kegiatan</h2>
          <p className="mt-2 text-sm max-w-xs">Mulai dengan menambahkan kegiatan baru untuk melihatnya di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Sekarang, 'event' di bawah ini akan memiliki tipe yang benar dari store Anda, 
            dan tidak akan ada lagi error saat memanggil 'getEventStatus(event)'.
          */}
          {events.map((event) => {
            const status = getEventStatus(event);
            const { text, className } = statusConfig[status];

            return (
              <Card key={event.id} className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 ease-in-out">
                {/* ... sisa dari JSX Card tidak berubah ... */}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold leading-tight">
                        {event.name}
                      </CardTitle>
                      <Badge variant="outline" className={`mt-2 text-xs font-semibold ${className}`}>
                        {text}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/events/edit/${event.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Ubah</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(event.id)} className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow space-y-4 text-sm">
                  <p className="text-gray-600 line-clamp-3">
                    {event.description || "Tidak ada deskripsi."}
                  </p>
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-800">
                        {format(new Date(event.startDate), 'EEEE, dd MMMM yyyy', { locale: id })}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-800">
                        {format(new Date(event.startDate), 'HH:mm', { locale: id })} - {format(new Date(event.endDate), 'HH:mm', { locale: id })} WIB
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-800">{event.location}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="w-full"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;