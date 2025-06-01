import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogDescription, Dialog, DialogContent, DialogHeader, DialogTitle as UIDialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, QrCode, Edit, Trash2, CalendarPlus, Eye } from 'lucide-react';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import EventDialog from '@/components/events/EventDialog';
import EventDetail from '@/components/events/EventDetail';
import QRCodeGenerator from '@/components/qr/QRCodeGenerator';
import { Event } from '@/types';

interface EventListProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ongoing':
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Berlangsung</Badge>;
    case 'upcoming':
      return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Akan Datang</Badge>;
    case 'completed':
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Selesai</Badge>;
    case 'cancelled':
      return <Badge variant="destructive" className="hover:bg-red-700">Dibatalkan</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const formatDateTime = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

interface EventItemCardProps {
  event: Event;
  viewMode: 'dashboard' | 'dialog';
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
  onShowQR: (event: Event) => void;
  onShowDetail: (event: Event) => void;
}

const EventItemCard = ({
  event,
  viewMode,
  onEdit,
  onDelete,
  onShowQR,
  onShowDetail,
}: EventItemCardProps) => {
  const cardBaseClasses = "p-5 rounded-lg border transition-all duration-300 ease-in-out";
  const dashboardCardClasses = `${cardBaseClasses} border-gray-200 hover:border-primary/70 hover:shadow-xl bg-card transform hover:-translate-y-1`;
  const dialogCardClasses = `${cardBaseClasses} border-border hover:border-primary/50 hover:shadow-md rounded-xl bg-card`;

  const primaryColor = viewMode === 'dashboard' ? 'indigo' : 'blue';
  const textPrimaryColor = viewMode === 'dashboard' ? 'text-gray-800' : 'text-foreground';
  const textSecondaryColor = viewMode === 'dashboard' ? 'text-gray-600' : 'text-muted-foreground';
  const iconPrimaryColor = viewMode === 'dashboard' ? `text-${primaryColor}-500` : 'text-primary';

  return (
    <div className={viewMode === 'dashboard' ? dashboardCardClasses : dialogCardClasses}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className={`font-semibold truncate ${viewMode === 'dashboard' ? 'text-xl' : 'text-lg'} ${textPrimaryColor} mb-1`}>
            {event.name}
          </h3>
          <p className={`text-sm leading-relaxed mb-2 ${textSecondaryColor} line-clamp-2`}>{event.description}</p>
          
          {viewMode === 'dashboard' && (
            <div className={`flex items-center space-x-2 text-sm ${textPrimaryColor} mb-2.5`}>
              <MapPin className={`h-5 w-5 ${iconPrimaryColor} flex-shrink-0`} />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          <Badge variant={viewMode === 'dashboard' ? 'default' : 'secondary'} className={viewMode === 'dashboard' ? `bg-${primaryColor}-100 text-${primaryColor}-700` : undefined}>
            {event.category}
          </Badge>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end space-y-2">
          {getStatusBadge(event.status)}
          {viewMode === 'dialog' && onDelete && onEdit && (
            <div className="flex space-x-1.5">
              <Button variant="outline" size="icon" onClick={() => onEdit(event)} aria-label="Edit">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => onDelete(event.id!)} aria-label="Hapus">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'dashboard' ? (
        <div className={`text-sm mb-4 border-t border-border pt-3 mt-3`}>
          <div className="flex items-center space-x-2">
            <Calendar className={`h-5 w-5 ${iconPrimaryColor} flex-shrink-0`} />
            <span className={textPrimaryColor}>{formatDateTime(event.startDate)}</span>
          </div>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm ${textSecondaryColor} mb-4 pt-3 mt-3 border-t border-border`}>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Mulai</p><p className={textPrimaryColor}>{formatDateTime(event.startDate)}</p></div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Selesai</p><p className={textPrimaryColor}>{formatDateTime(event.endDate)}</p></div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Lokasi</p><p className={`${textPrimaryColor} truncate`}>{event.location}</p></div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center space-x-2 text-sm">
          <Users className={`h-5 w-5 ${iconPrimaryColor} flex-shrink-0`} />
          <span className={`${textPrimaryColor} font-medium`}>
            {event.assignedPegawai?.length || 0} partisipan
          </span>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={viewMode === 'dashboard' ? 'default' : 'outline'}
            className={viewMode === 'dashboard' ? `bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-white` : undefined}
            onClick={() => onShowQR(event)}
          >
            <QrCode className="h-4 w-4 mr-1.5" /> QR Code
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onShowDetail(event)}
          >
            <Eye className="h-4 w-4 mr-1.5" /> Detail
          </Button>
        </div>
      </div>
    </div>
  );
};

const EventList = ({ open, onOpenChange }: EventListProps) => {
  const { events, deleteEvent } = useAppFirestore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setEditDialogOpen(true);
  };

  const handleShowQR = (event: Event) => {
    setSelectedEvent(event);
    setQrDialogOpen(true);
  };

  const handleShowDetail = (event: Event) => {
    setSelectedEvent(event);
    setDetailDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini? Proses ini tidak dapat diurungkan.')) {
      await deleteEvent(id);
    }
  };
  
  const renderNoEventsMessage = (title: string, subtitle: string) => (
    <div className="text-center text-muted-foreground py-12 sm:py-16 bg-muted/30 rounded-lg">
      <Calendar className="h-16 w-16 text-foreground/20 mx-auto mb-5" />
      <p className="text-xl font-semibold text-foreground/70 mb-1.5">{title}</p>
      <p className="text-md text-foreground/50">{subtitle}</p>
    </div>
  );

  return (
    <>
      {open === undefined ? (
        <Card className="border-border shadow-lg rounded-xl bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
              Kegiatan Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const todayEvents = events.filter(event => {
                  const today = new Date();
                  const eventDate = new Date(event.startDate);
                  return eventDate.toDateString() === today.toDateString() && event.status !== 'cancelled';
                });

                if (todayEvents.length === 0) {
                  return renderNoEventsMessage("Tidak ada kegiatan hari ini", "Semua agenda telah selesai atau belum terjadwal.");
                }
                return todayEvents.map((event) => (
                  <EventItemCard
                    key={event.id}
                    event={event}
                    viewMode="dashboard"
                    onShowQR={handleShowQR}
                    onShowDetail={handleShowDetail}
                  />
                ));
              })()}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 bg-background">
            <DialogHeader className="px-6 pt-5 pb-4 border-b border-border sticky top-0 bg-background z-10">
              <UIDialogTitle className="flex items-center justify-between text-xl font-semibold text-foreground">
                Manajemen Kegiatan
                <Button
                  onClick={() => {
                    setSelectedEvent(null);
                    setEditDialogOpen(true);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Buat Kegiatan
                </Button>
              </UIDialogTitle>
              {/* Perbaikan: Menambahkan DialogDescription untuk dialog Manajemen Kegiatan */}
              <DialogDescription className="sr-only">
                Halaman ini memungkinkan Anda untuk mengelola semua kegiatan yang terdaftar, termasuk membuat, mengedit, melihat detail, dan menghapus kegiatan.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {events.length === 0 ? (
                renderNoEventsMessage("Belum ada kegiatan", "Mulai dengan membuat kegiatan pertama Anda.")
              ) : (
                events.map((event) => (
                  <EventItemCard
                    key={event.id}
                    event={event}
                    viewMode="dialog"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onShowQR={handleShowQR}
                    onShowDetail={handleShowDetail}
                  />
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <EventDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        event={selectedEvent}
        onSaveSuccess={() => setSelectedEvent(null)}
      />

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <UIDialogTitle className="text-xl font-semibold">QR Code Kegiatan</UIDialogTitle>
            <DialogDescription className="sr-only">
              Tampilkan QR Code untuk kegiatan yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && <QRCodeGenerator eventData={selectedEvent} open={qrDialogOpen} onOpenChange={setQrDialogOpen} />}
        </DialogContent>
      </Dialog>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
            <UIDialogTitle className="text-xl font-semibold">Detail Kegiatan</UIDialogTitle>
            <DialogDescription className="sr-only">
              Tampilkan detail lengkap dari kegiatan yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && <EventDetail event={selectedEvent} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventList;