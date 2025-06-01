import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventStore } from '@/hooks/useEventStore';
import { Event, Pegawai } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import AbsensiForm from '@/components/absensi/AbsensiForm';
import { useAttendanceStore } from '@/hooks/useAttendanceStore';
import { usePegawaiStore } from '@/hooks/usePegawaiStore';
import EventAttendanceList from '@/components/events/EventAttendanceList';
import { EventDialog } from '@/components/events/EventDialog';
import QRCodeGenerator from '@/components/qr/QRCodeGenerator';
import EventDetailsCard from '@/components/events/EventDetailsCard';
import EventLoadingState from '@/components/events/EventLoadingState';
import EventNotFoundState from '@/components/events/EventNotFoundState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const EventDetail = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { events, eventsLoading, deleteEvent, updateEvent } = useEventStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const [nip, setNip] = useState('');
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);

  const { attendance, attendanceLoading, addAttendance } = useAttendanceStore();
  const { pegawai, pegawaiLoading } = usePegawaiStore();

  useEffect(() => {
    if (eventId && events.length > 0) {
      const foundEvent = events.find(e => e.id === eventId);
      setEvent(foundEvent || null);
      setSelectedEvent(foundEvent || null);
    }
  }, [eventId, events]);

  const handleEditEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  }, []);

  const handleShowQrCode = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsQrCodeDialogOpen(true);
  }, []);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast({
        title: "Berhasil!",
        description: "Kegiatan berhasil dihapus.",
        variant: "success",
      });
      navigate('/events');
    } catch (error) {
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
  }, [deleteEvent, toast, navigate]);

  const handleAbsensi = async () => {
    if (!event) return;

    setIsSubmittingAttendance(true);
    try {
      const employee = pegawai.find((emp: Pegawai) => emp.nip === nip);

      if (!employee) {
        toast({
          title: 'Gagal Absen',
          description: 'NIP tidak ditemukan.',
          variant: 'destructive',
        });
        return;
      }

      const existingAttendance = attendance.find(
        (att) => att.eventId === event.id && att.nip === nip
      );

      if (existingAttendance) {
        toast({
          title: 'Gagal Absen',
          description: 'Anda sudah melakukan absensi untuk kegiatan ini.',
          variant: 'destructive',
        });
        return;
      }

      await addAttendance(
        {
          eventId: event.id,
          pegawaiId: employee.id,
          nip: employee.nip,
          employeeName: employee.nama,
          checkInTime: new Date(),
        },
        new Date(event.startDate),
        employee.nama
      );

      toast({
        title: 'Absensi Berhasil',
        description: `Absensi untuk ${employee.nama} berhasil dicatat.`, 
      });
      setNip('');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Terjadi kesalahan saat absensi: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (event && event.id) {
        const currentStatus = getEventStatus(new Date(event.startDate), new Date(event.endDate));
        if (event.status !== currentStatus) {
          updateEvent(event.id, { status: currentStatus });
        }
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [event, updateEvent]);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  }, []);

  if (eventsLoading) {
    return <EventLoadingState />;
  }

  if (!event) {
    return <EventNotFoundState />;
  }

  const filteredAttendance = attendance.filter(att => att.eventId === event.id);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Button onClick={() => navigate('/events')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Kegiatan
      </Button>
      <EventDetailsCard
        event={event}
        onEdit={handleEditEvent}
        onShowQr={handleShowQrCode}
        onDelete={handleDeleteEvent}
      />

      <div className="mt-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Absensi Kegiatan</CardTitle>
          </CardHeader>
          <CardContent>
            <AbsensiForm
              nip={nip}
              setNip={setNip}
              isSubmitting={isSubmittingAttendance}
              handleAbsensi={handleAbsensi}
            />
          </CardContent>
        </Card>
        <EventAttendanceList attendance={filteredAttendance} loading={attendanceLoading} />
      </div>

      {selectedEvent && (
        <EventDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
           onSaveSuccess={() => {
             setIsDialogOpen(false);
             const updated = events.find(e => e.id === eventId);
             setEvent(updated || null);
             setSelectedEvent(updated || null);
           }}
          event={selectedEvent}
        />
      )}

      {selectedEvent && (
        <QRCodeGenerator
          open={isQrCodeDialogOpen}
          onOpenChange={setIsQrCodeDialogOpen}
          eventData={event}
        />
      )}
    </div>
  );
};

export default EventDetail;