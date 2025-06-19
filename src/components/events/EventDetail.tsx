// Nama File: EventDetail.tsx

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, QrCode, Edit, Trash, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Event, Pegawai as PegawaiType } from '@/types';
import EventDialog from '@/components/events/EventDialog';
import QRCodeGenerator from '@/components/qr/QRCodeGenerator';

// =========================================================
// [KOMPONEN HELPER]
// =========================================================

/**
 * Card: Komponen pembungkus dasar yang fleksibel, mendukung tinggi yang sama (h-full).
 */
const Card = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    <div className="flex justify-between items-center p-4 border-b border-slate-200">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
    <div className="p-4 flex-grow">
      {children}
    </div>
  </div>
);

/**
 * ProgressBar: Komponen visual untuk menampilkan data persentase.
 */
const ProgressBar = ({ value }: { value: number }) => {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div
        className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

/**
 * InfoItem: Menampilkan satu baris informasi dengan ikon.
 */
const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-4 transition-colors hover:bg-slate-50 p-2 rounded-md">
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
      <Icon className="w-5 h-5 text-slate-600" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

/**
 * StatCard: Menampilkan satu statistik kunci dalam bentuk angka.
 */
const StatCard = ({ icon: Icon, label, value, className }: { icon: React.ElementType; label: string; value: number; className?: string }) => (
  <div className={`p-4 rounded-xl border ${className}`}>
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">{label}</p>
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

/**
 * PegawaiCard: Menampilkan informasi pegawai dengan layout vertikal.
 */
const PegawaiCard = ({ pegawai, attendanceStatus }: { pegawai: PegawaiType; attendanceStatus?: 'present' | 'absent' | 'pending' }) => {
  const statusMap = {
    present: { text: 'Hadir', icon: CheckCircle2, className: 'bg-green-100 text-green-800 border-green-300' },
    absent: { text: 'Tidak Hadir', icon: XCircle, className: 'bg-red-100 text-red-800 border-red-300' },
    pending: { text: 'Belum Absen', icon: AlertCircle, className: 'bg-slate-100 text-slate-600 border-slate-300' },
  };
  const status = statusMap[attendanceStatus || 'pending'];
  return (
    <div className="flex flex-col items-center text-center gap-2 rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-400 h-full">
      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
        <User className="w-6 h-6 text-slate-500" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-slate-900 leading-tight">{pegawai.nama}</p>
        <p className="text-sm text-slate-500">{pegawai.jabatan}</p>
      </div>
      <Badge className={status.className} variant="outline">
        <status.icon className="w-3.5 h-3.5 mr-1.5" />
        {status.text}
      </Badge>
    </div>
  );
};


// =========================================================
// [KOMPONEN UTAMA]
// =========================================================
const EventDetail = ({ open, onOpenChange, event }: { open: boolean; onOpenChange: (open: boolean) => void; event: Event | null }) => {
  const { pegawai, attendance, deleteEvent } = useAppFirestore();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (!event) return null;

  // --- Logika & Helper Data ---
  const eventAttendance = attendance?.filter(att => att.eventId === event.id) || [];
  const assignedPegawai = pegawai?.filter(p => event.assignedPegawai?.includes(p.id!)) || [];
  
  const stats = {
      present: eventAttendance.filter(a => a.status === 'present').length,
      absent: eventAttendance.filter(a => a.status === 'absent').length,
      pending: assignedPegawai.length - eventAttendance.length,
  };

  const attendancePercentage = assignedPegawai.length > 0
    ? (stats.present / assignedPegawai.length) * 100
    : 0;
  
  const handleDelete = async () => {
    if (event?.id && window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini? Aksi ini tidak dapat dibatalkan.')) {
      await deleteEvent(event.id);
      onOpenChange(false);
    }
  };
  
  const formatDateTime = (date: Date) => date.toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string } } = {
      ongoing: { text: 'Berlangsung', className: 'bg-green-100 text-green-800 border-green-200' },
      upcoming: { text: 'Akan Datang', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      completed: { text: 'Selesai', className: 'bg-slate-100 text-slate-800 border-slate-200' },
      cancelled: { text: 'Dibatalkan', className: 'bg-red-100 text-red-800 border-red-200' },
    };
    const currentStatus = statusMap[status] || { text: 'Unknown', className: '' };
    return <Badge className={`text-sm ${currentStatus.className}`}>{currentStatus.text}</Badge>;
  };
  
  const getAttendanceStatus = (pegawaiId: string) => {
      const att = eventAttendance.find(a => a.pegawaiId === pegawaiId);
      if (!att) return 'pending';
      return att.status as 'present' | 'absent';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
          
          <DialogHeader className="p-4 sm:p-5 border-b sticky top-0 bg-white z-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Detail Kegiatan</DialogTitle>
                <DialogDescription className="mt-1">Tinjau detail, kehadiran, dan kelola kegiatan.</DialogDescription>
              </div>
              <div className="flex w-full flex-row items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-2">
                <Button onClick={() => setEditDialogOpen(true)} variant="outline" size="sm" className="flex-1 sm:flex-none"><Edit className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Edit</span></Button>
                <Button onClick={() => setQrDialogOpen(true)} className="bg-slate-800 hover:bg-slate-900 flex-1 sm:flex-none" size="sm"><QrCode className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">QR Absensi</span></Button>
                <Button onClick={handleDelete} variant="destructive" size="sm" className="flex-1 sm:flex-none"><Trash className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Hapus</span></Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6">
            <div className="space-y-6">

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">{event.category}</span>
                  {getStatusBadge(event.status)}
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">{event.name}</h2>
                <p className="text-slate-600 leading-relaxed max-w-prose">{event.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Informasi & Waktu">
                  <div className="flex flex-col justify-around h-full -m-2">
                    <InfoItem icon={Calendar} label="Mulai" value={formatDateTime(event.startDate)} />
                    <InfoItem icon={Clock} label="Selesai" value={formatDateTime(event.endDate)} />
                    <InfoItem icon={MapPin} label="Lokasi" value={event.location} />
                    <InfoItem icon={Users} label="Total Ditugaskan" value={`${assignedPegawai.length} orang`} />
                  </div>
                </Card>
                
                <Card title="Statistik Kehadiran">
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl border bg-green-50 text-green-700 border-green-200">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-center">Hadir</p>
                        <p className="text-2xl font-bold">{stats.present}</p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl border bg-red-50 text-red-700 border-red-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                          <XCircle className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-center">Tidak Hadir</p>
                        <p className="text-2xl font-bold">{stats.absent}</p>
                      </div>

                      <div className="flex flex-col items-center justify-center p-4 rounded-xl border bg-yellow-50 text-yellow-700 border-yellow-200">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-center">Belum Absen</p>
                        <p className="text-2xl font-bold">{stats.pending}</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-600">Tingkat Kehadiran</span>
                        <span className="font-bold text-slate-800">{attendancePercentage.toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={attendancePercentage} />
                    </div>
                  </div>
                </Card>
              </div>

              {assignedPegawai.length > 0 && (
                 <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-slate-200 shadow-sm px-4">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-bold text-slate-900 hover:no-underline">
                      {`Lihat Pegawai yang Ditugaskan (${assignedPegawai.length})`}
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {assignedPegawai.map((pegawaiItem) => (
                          <PegawaiCard key={pegawaiItem.id} pegawai={pegawaiItem} attendanceStatus={getAttendanceStatus(pegawaiItem.id!)} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <EventDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} event={event} />
      <QRCodeGenerator open={qrDialogOpen} onOpenChange={setQrDialogOpen} eventData={event} />
    </>
  );
};

export default EventDetail;