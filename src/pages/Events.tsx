import React, { useState, useCallback } from 'react';
import { useEventStore } from '@/hooks/useEventStore';
import { EventDialog } from '@/components/events/EventDialog';
import { Event } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Calendar, MapPin, Edit, Trash2, Clock, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Events = () => {
  const { events, deleteEvent, eventsLoading } = useEventStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const handleAddEvent = useCallback(() => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast({
        title: "Berhasil!",
        description: "Kegiatan berhasil dihapus.",
        variant: "success",
      });
    } catch (error: unknown) {
      let errorMessage = "Terjadi kesalahan saat menghapus kegiatan.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast({
        title: "Gagal menghapus kegiatan",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [deleteEvent, toast]);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  }, []);

  // Skeleton Loader untuk tampilan card full width dengan separator
  const EventCardSkeleton = () => (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="flex flex-col animate-pulse">
          <CardHeader className="pb-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </CardHeader>
          <div className="border-t border-gray-200 mx-6"></div> {/* Separator */}
          <CardContent className="flex-grow space-y-3 py-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mt-2"></div>
          </CardContent>
          <div className="border-t border-gray-200 mx-6"></div> {/* Separator */}
          <CardFooter className="flex justify-end gap-2 pt-4">
            <div className="h-9 w-9 bg-gray-200 rounded-md"></div>
            <div className="h-9 w-9 bg-gray-200 rounded-md"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-3xl font-bold">Pengelolaan Kegiatan</CardTitle>
            <CardDescription className="text-base text-gray-500">
              Kelola semua kegiatan atau acara yang terdaftar di sini.
            </CardDescription>
          </div>
          <Button onClick={handleAddEvent} className="h-10 px-4 py-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kegiatan Baru
          </Button>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <EventCardSkeleton />
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-48">
              <Info className="h-10 w-10 mb-4 text-gray-400" />
              <p className="text-lg font-semibold">Tidak ada kegiatan yang ditemukan.</p>
              <p className="text-sm mt-2">Mulai dengan menambahkan kegiatan baru untuk melihatnya di sini.</p>
              <Button onClick={handleAddEvent} className="mt-6">
                <PlusCircle className="mr-2 h-4 w-4" /> Buat Kegiatan Pertama
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-6">
              {events.map((event) => (
                <Card key={event.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold leading-tight">
                      {event.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm text-gray-600 mt-1">
                      {event.description || "Tidak ada deskripsi."}
                    </CardDescription>
                  </CardHeader>

                  {/* Separator antara CardHeader dan CardContent */}
                  <div className="border-t border-gray-200 mx-6"></div>

                  <CardContent className="flex-grow space-y-2 py-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span>
                        {format(new Date(event.startDate), 'dd MMM yyyy', { locale: id })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span>
                        {format(new Date(event.startDate), 'HH:mm', { locale: id })} - {format(new Date(event.endDate), 'HH:mm', { locale: id })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <div className="pt-2">
                      <Badge
                        className={`
                          ${event.status === 'upcoming' && 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
                          ${event.status === 'ongoing' && 'bg-green-100 text-green-800 hover:bg-green-200'}
                          ${event.status === 'completed' && 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                          ${event.status === 'cancelled' && 'bg-red-100 text-red-800 hover:bg-red-200'}
                          px-2 py-1 text-xs font-medium
                        `}
                      >
                        {event.status === 'upcoming' && 'Akan Datang'}
                        {event.status === 'ongoing' && 'Sedang Berlangsung'}
                        {event.status === 'completed' && 'Selesai'}
                        {event.status === 'cancelled' && 'Dibatalkan'}
                      </Badge>
                    </div>
                  </CardContent>

                  {/* Separator antara CardContent dan CardFooter */}
                  <div className="border-t border-gray-200 mx-6"></div>

                  <CardFooter className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditEvent(event)}
                      title="Edit Kegiatan"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" title="Hapus Kegiatan">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Ini akan menghapus kegiatan "
                            <span className="font-semibold text-gray-900">{event.name}</span>" secara permanen dari daftar Anda.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EventDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        event={selectedEvent}
        onSaveSuccess={handleDialogClose}
      />
    </div>
  );
};

export default Events;