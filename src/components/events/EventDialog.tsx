import { useState, useEffect, useCallback } from 'react';
import { DialogDescription, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Event, Pegawai } from '@/types'; // Asumsi Pegawai type ada di '@/types'
import { useAuth } from '@/contexts/useAuth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// --- (Definisi tipe FormDataState, EventDialogProps, getDefaultFormData) ---
type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

interface FormDataState {
  name: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  assignedPegawai: string[];
  status: EventStatus;
}

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSaveSuccess?: () => void;
}

const getDefaultFormData = (event?: Event | null): FormDataState => {
  if (event) {
    // Pastikan event.startDate dan event.endDate adalah instance Date atau string yang valid
    const startDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
    const endDate = event.endDate instanceof Date ? event.endDate : new Date(event.endDate);

    return {
      name: event.name,
      description: event.description,
      category: event.category,
      startDate: formatToDatetimeLocal(startDate),
      endDate: formatToDatetimeLocal(endDate),
      location: event.location,
  
      assignedPegawai: event.assignedPegawai || [],
      status: event.status,
    };
  }

  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0);
  const defaultStartDate = formatToDatetimeLocal(now);
  const defaultEndDate = formatToDatetimeLocal(new Date(now.getTime() + 2 * 60 * 60 * 1000));

  return {
    name: '',
    description: '',
    category: '',
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    location: '',

    assignedPegawai: [],
    status: 'upcoming',
  };
};

// Helper function to format Date object to 'YYYY-MM-DDTHH:mm' in local time
const formatToDatetimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
// --- (Akhir dari definisi) ---

export function EventDialog({ open, onOpenChange, event, onSaveSuccess }: EventDialogProps) {
  const { addEvent, updateEvent, pegawai = [] } = useAppFirestore();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FormDataState>(() => getDefaultFormData(event));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setFormData(getDefaultFormData(event));
    }
  }, [event, open]);

  const handleInputChange = useCallback((field: keyof FormDataState, value: string | Date | EventStatus | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);



  const handlePegawaiToggle = useCallback((pegawaiId: string, checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setFormData(prev => ({
        ...prev,
        assignedPegawai: checked
          ? [...prev.assignedPegawai, pegawaiId]
          : prev.assignedPegawai.filter(id => id !== pegawaiId),
      }));
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (new Date(formData.startDate).getTime() > new Date(formData.endDate).getTime()) {
      toast({
        title: "Kesalahan Input Waktu",
        description: "Waktu selesai tidak boleh lebih awal dari waktu mulai.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const eventPayload = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      createdBy: currentUser?.uid || null,
      status: event?.status || 'upcoming' as EventStatus,
    };

    try {
      if (event?.id) {
        await updateEvent(event.id, eventPayload);
        toast({
          title: "Berhasil!",
          description: "Kegiatan berhasil diperbarui.",
          variant: "success",
        });
      } else {
        await addEvent(eventPayload);
        toast({
          title: "Berhasil!",
          description: "Kegiatan baru berhasil ditambahkan.",
          variant: "success",
        });
      }
      onOpenChange(false);
      onSaveSuccess?.();
    } catch (error: unknown) { // Menggunakan 'unknown' untuk error dan melakukan type assertion atau type narrowing
      let errorMessage = "Terjadi kesalahan saat menyimpan kegiatan. Silakan coba lagi.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Gagal menyimpan kegiatan",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, currentUser?.uid, event?.id, event?.status, addEvent, updateEvent, onOpenChange, toast, onSaveSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* Header Dialog */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-xl font-semibold">
            {event ? 'Edit Kegiatan' : 'Buat Kegiatan Baru'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {event ? 'Formulir untuk mengedit detail kegiatan.' : 'Formulir untuk membuat kegiatan baru.'}
          </DialogDescription>
        </DialogHeader>

        {/* Form menjadi area konten utama yang bisa di-scroll */}
        <form id="eventDialogForm" onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
          {/* Nama Kegiatan */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">Nama Kegiatan</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Rapat Koordinasi Bulanan"
              className="h-10"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi detail kegiatan..."
              rows={3}
              className="resize-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Kategori & Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-sm font-medium">Kategori</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Rapat, Pelatihan, Workshop"
                className="h-10"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-sm font-medium">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Aula Utama, Ruang Rapat A"
                className="h-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Waktu Mulai & Selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-sm font-medium">Waktu Mulai</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="h-10"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-sm font-medium">Waktu Selesai</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                min={formData.startDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="h-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>



          {/* Tugaskan Pegawai */}
          {pegawai.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pegawai yang Mengikuti</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-pegawai"
                  checked={formData.assignedPegawai.length === pegawai.length && pegawai.length > 0}
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                      handleInputChange('assignedPegawai', checked ? pegawai.map((p: Pegawai) => p.id) : []);
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Label htmlFor="all-pegawai" className="text-sm font-normal">Semua Pegawai</Label>
              </div>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50/50">
                <div className="space-y-2.5">
                  {pegawai.map((p: Pegawai) => (
                    <div key={p.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors">
                      <Checkbox
                        id={`pegawai-${p.id}`}
                        checked={formData.assignedPegawai.includes(p.id)}
                        onCheckedChange={(checked) => handlePegawaiToggle(p.id!, checked)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`pegawai-${p.id}`} className="text-sm font-normal">
                        {p.nama}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer Dialog untuk tombol aksi */}
        <DialogFooter className="px-6 py-4 border-t bg-background flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" form="eventDialogForm" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
            ) : (
              event ? 'Simpan Perubahan' : 'Buat Kegiatan'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EventDialog;