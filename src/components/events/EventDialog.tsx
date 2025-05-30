import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Event } from '@/types';
import { useAuth } from '@/contexts/useAuth';
import { Loader2 } from 'lucide-react';

// --- (Definisi tipe FormDataState, EventDialogProps, getDefaultFormData tetap sama seperti sebelumnya) ---
type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

interface FormDataState {
  name: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  status: EventStatus;
  assignedPegawai: string[];
}

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
}

const getDefaultFormData = (): FormDataState => {
  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0);
  const defaultStartDate = now.toISOString().slice(0, 16);
  const defaultEndDate = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16);
  return {
    name: '', description: '', category: '',
    startDate: defaultStartDate, endDate: defaultEndDate,
    location: '', status: 'upcoming', assignedPegawai: [],
  };
};
// --- (Akhir dari bagian yang sama) ---

const EventDialog = ({ open, onOpenChange, event }: EventDialogProps) => {
  const { addEvent, updateEvent, pegawai = [] } = useAppFirestore();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FormDataState>(getDefaultFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (event) {
        setFormData({
          name: event.name,
          description: event.description,
          category: event.category,
          startDate: event.startDate instanceof Date ? event.startDate.toISOString().slice(0, 16) : new Date(event.startDate).toISOString().slice(0, 16),
          endDate: event.endDate instanceof Date ? event.endDate.toISOString().slice(0, 16) : new Date(event.endDate).toISOString().slice(0, 16),
          location: event.location,
          status: event.status as EventStatus,
          assignedPegawai: event.assignedPegawai || [],
        });
      } else {
        setFormData(getDefaultFormData());
      }
    }
  }, [event, open]);

  const handleInputChange = (field: keyof FormDataState, value: string | Date | EventStatus | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleStatusChange = (value: string) => {
    handleInputChange('status', value as EventStatus);
  };

  const handlePegawaiToggle = (pegawaiId: string, checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setFormData(prev => ({
        ...prev,
        assignedPegawai: checked
          ? [...prev.assignedPegawai, pegawaiId]
          : prev.assignedPegawai.filter(id => id !== pegawaiId),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const eventPayload = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      createdBy: currentUser?.uid || null,
    };
    try {
      if (event?.id) {
        await updateEvent(event.id, eventPayload);
      } else {
        await addEvent(eventPayload);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Gagal menyimpan kegiatan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* PERBAIKAN UTAMA PADA LAYOUT DI BAWAH INI */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* Header Dialog */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-xl font-semibold">
            {event ? 'Edit Kegiatan' : 'Buat Kegiatan Baru'}
          </DialogTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
            <Select 
              value={formData.status}
              onValueChange={handleStatusChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Akan Datang</SelectItem>
                <SelectItem value="ongoing">Sedang Berlangsung</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
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
                      handleInputChange('assignedPegawai', checked ? pegawai.map(p => p.id) : []);
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Label htmlFor="all-pegawai" className="text-sm font-normal">Semua Pegawai</Label>
              </div>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50/50">
                <div className="space-y-2.5">
                  {pegawai.map((p) => (
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
};

export default EventDialog;