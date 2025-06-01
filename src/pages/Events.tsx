import { useEventStore } from '@/hooks/useEventStore';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Info, MapPin } from 'lucide-react';
import { format, isBefore, isAfter, isEqual } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const getEventStatus = (startDate: Date, endDate: Date): 'upcoming' | 'ongoing' | 'completed' => {
  const now = new Date();
  if (isBefore(now, startDate)) {
    return 'upcoming';
  } else if (isAfter(now, endDate)) {
    return 'completed';
  } else if (isAfter(now, startDate) || isEqual(now, startDate) && isBefore(now, endDate) || isEqual(now, endDate)) {
    return 'ongoing';
  }
  return 'upcoming';
};

const Events = () => {
  const { events, deleteEvent, eventsLoading, updateEvent } = useEventStore();
  const navigate = useNavigate();

  const EventCardSkeleton = () => (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="flex flex-col animate-pulse">
          <CardHeader className="pb-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </CardHeader>
          <div className="border-t border-gray-200 mx-6"></div>
          <CardContent className="flex-grow space-y-3 py-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mt-2"></div>
          </CardContent>
          <div className="border-t border-gray-200 mx-6"></div>
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
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">Pengelolaan Kegiatan</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-500">
              Kelola semua kegiatan atau acara yang terdaftar di sini.
            </CardDescription>
          </div>

        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <EventCardSkeleton />
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-48">
              <Info className="h-10 w-10 mb-4 text-gray-400" />
              <p className="text-lg font-semibold">Tidak ada kegiatan yang ditemukan.</p>
              <p className="text-sm mt-2">Mulai dengan menambahkan kegiatan baru untuk melihatnya di sini.</p>

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

                  <div className="border-t border-gray-200 mx-6"></div>

                  <CardContent className="flex-grow py-4 text-sm text-gray-700">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
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
                    </div>
                    <div className="flex justify-center mt-4">
                      <Badge
                        className={`
                          ${getEventStatus(new Date(event.startDate), new Date(event.endDate)) === 'upcoming' && 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
                          ${getEventStatus(new Date(event.startDate), new Date(event.endDate)) === 'ongoing' && 'bg-green-100 text-green-800 hover:bg-green-200'}
                          ${getEventStatus(new Date(event.startDate), new Date(event.endDate)) === 'completed' && 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                          ${event.status === 'cancelled' && 'bg-red-100 text-red-800 hover:bg-red-200'}
                          px-2 py-1 text-xs font-medium
                        `}
                      >
                        {getEventStatus(new Date(event.startDate), new Date(event.endDate)) === 'upcoming' && 'Akan Datang'}
                        {getEventStatus(new Date(event.startDate), new Date(event.endDate)) === 'ongoing' && 'Sedang Berlangsung'}
                        {getEventStatus(new Date(event.startDate), new Date(event.endDate)) === 'completed' && 'Selesai'}
                        {event.status === 'cancelled' && 'Dibatalkan'}
                      </Badge>
                    </div>
                  </CardContent>

                  <div className="border-t border-gray-200 mx-6"></div>

                  <CardFooter className="flex flex-col sm:flex-row w-full gap-4 pt-4 sm:justify-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Info className="h-4 w-4" />
                      Lihat Detail
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
};

export default Events;