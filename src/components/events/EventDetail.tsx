
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, QrCode, Edit, Trash } from 'lucide-react';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Event } from '@/types';

import EventDialog from '@/components/events/EventDialog';
import QRCodeGenerator from '@/components/qr/QRCodeGenerator'; // Import QRCodeGenerator

interface EventDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
}

const EventDetail = ({ open, onOpenChange, event }: EventDetailProps) => {
  const { pegawai, attendance, deleteEvent } = useAppFirestore();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (!event) return null;

  const handleDelete = async () => {
    if (event && event.id) {
      await deleteEvent(event.id);
      onOpenChange(false); // Close the dialog after deletion
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Badge className="bg-green-500 text-white">Berlangsung</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500 text-white">Akan Datang</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 text-white">Selesai</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const eventAttendance = attendance?.filter(att => att.eventId === event.id) || [];
  const assignedPegawai = pegawai?.filter(p => event.assignedPegawai?.includes(p.id!)) || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center text-xl font-semibold">
              <span className="flex-grow">Detail Kegiatan</span>
              <div className="flex space-x-2 mr-4">
                <Button
                  onClick={() => setEditDialogOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  size="sm"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
                <Button
                  onClick={() => setQrDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
              </div>
              <DialogClose />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.name}</h2>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
                {getStatusBadge(event.status)}
              </div>
              
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {event.category}
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informasi Kegiatan</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Mulai</p>
                      <p className="font-medium">{formatDateTime(event.startDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Selesai</p>
                      <p className="font-medium">{formatDateTime(event.endDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Lokasi</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Pegawai Mengikuti</p>
                      <p className="font-medium">{assignedPegawai.length} orang</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Statistik Kehadiran</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-2xl font-bold text-green-600">{eventAttendance.filter(a => a.status === 'present').length}</p>
                    <p className="text-sm text-green-600">Hadir</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600">{eventAttendance.filter(a => a.status === 'late').length}</p>
                    <p className="text-sm text-yellow-600">Terlambat</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-2xl font-bold text-red-600">{eventAttendance.filter(a => a.status === 'absent').length}</p>
                    <p className="text-sm text-red-600">Tidak Hadir</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-2xl font-bold text-gray-600">{assignedPegawai.filter(p => !eventAttendance.some(att => att.pegawaiId === p.id)).length}</p>
                    <p className="text-sm text-gray-600">Belum Absen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Pegawai */}
            {assignedPegawai.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Pegawai yang Mengikuti</h3>
                <div className="grid gap-3">
                  {assignedPegawai.map((pegawaiItem) => {
                    const pegawaiAttendance = eventAttendance.find(a => a.pegawaiId === pegawaiItem.id);
                    return (
                      <div key={pegawaiItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{pegawaiItem.nama}</p>
                          <p className="text-sm text-gray-600">{pegawaiItem.jabatan}</p>
                        </div>
                        {pegawaiAttendance ? (
                          <Badge
                            className={
                              pegawaiAttendance.status === 'present' ? 'bg-green-100 text-green-800' :
                              pegawaiAttendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {pegawaiAttendance.status === 'present' ? 'Hadir' :
                             pegawaiAttendance.status === 'late' ? 'Terlambat' : 'Tidak Hadir'}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Belum Absen</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <EventDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        event={event}
      />

      {/* Add QRCodeGenerator component here */}
      <QRCodeGenerator
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        eventData={event}
      />
    </>
  );
};

export default EventDetail;
