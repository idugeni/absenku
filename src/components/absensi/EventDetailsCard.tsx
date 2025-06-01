import React from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { QrCode, Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { Event } from '@/types';

interface EventDetailsCardProps {
  eventData: Event;
}

const EventDetailsCard: React.FC<EventDetailsCardProps> = ({ eventData }) => {
  const formatDate = (dateValue: Date | Timestamp | string): string => {
    try {
      const dateToFormat = dateValue instanceof Timestamp ? dateValue.toDate() : new Date(dateValue);
      return format(dateToFormat, 'dd MMMM yyyy HH:mm', { locale: localeID });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Tanggal tidak valid';
    }
  };

  return (
    <>
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
          <span>Token QR: {eventData.qrCodeToken || 'N/A'}</span>
        </div>
      </CardContent>
    </>
  );
};

export default EventDetailsCard;