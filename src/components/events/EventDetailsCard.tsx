import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ArrowLeft, Edit, Trash2, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface EventDetailsCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onShowQr: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const getEventStatus = (startDate: Date, endDate: Date): 'upcoming' | 'ongoing' | 'completed' => {
  const now = new Date();
  if (now < startDate) {
    return 'upcoming';
  } else if (now > endDate) {
    return 'completed';
  } else {
    return 'ongoing';
  }
};

const EventDetailsCard: React.FC<EventDetailsCardProps> = ({
  event,
  onEdit,
  onShowQr,
  onDelete,
}) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const status = getEventStatus(startDate, endDate);

  return (
    <Card>
      <CardHeader>

        <CardTitle className="text-3xl font-bold mb-2">{event.name}</CardTitle>
        <CardDescription className="text-gray-600">{event.description || "Tidak ada deskripsi."}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span>
            {startDate.toDateString() === endDate.toDateString()
              ? format(startDate, 'dd MMMM yyyy', { locale: id })
              : `${format(startDate, 'dd MMMM yyyy', { locale: id })} - ${format(endDate, 'dd MMMM yyyy', { locale: id })}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="h-5 w-5 text-gray-500" />
          <span>
            {format(startDate, 'HH:mm', { locale: id })} - {format(endDate, 'HH:mm', { locale: id })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="h-5 w-5 text-gray-500" />
          <span>{event.location}</span>
        </div>
        <div>
          <Badge
            className={`
              ${status === 'upcoming' && 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
              ${status === 'ongoing' && 'bg-green-100 text-green-800 hover:bg-green-200'}
              ${status === 'completed' && 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
              ${event.status === 'cancelled' && 'bg-red-100 text-red-800 hover:bg-red-200'}
              px-3 py-1 text-sm font-medium
            `}
          >
            {status === 'upcoming' && 'Akan Datang'}
            {status === 'ongoing' && 'Sedang Berlangsung'}
            {status === 'completed' && 'Selesai'}
            {event.status === 'cancelled' && 'Dibatalkan'}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row w-full gap-4 pt-4 sm:justify-center">
        <Button
          variant="outline"
          onClick={() => onEdit(event)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Edit className="h-4 w-4" />
          Edit Kegiatan
        </Button>
        <Button
          variant="outline"
          onClick={() => onShowQr(event)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <QrCode className="h-4 w-4" />
          Tampilkan QR
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              Hapus Kegiatan
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
              <AlertDialogAction onClick={() => onDelete(event.id)}>
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default EventDetailsCard;