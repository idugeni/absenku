import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Event, Pegawai } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, CalendarIcon, ClockIcon, MapPinIcon, TagIcon } from 'lucide-react'; // <-- Tambahkan ikon untuk estetika
import { useToast } from '@/components/ui/use-toast';

// Tipe dan fungsi helper tidak berubah, jadi kita fokus pada komponen utama
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

const formatToDatetimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


const getDefaultFormData = (event?: Event | null): FormDataState => {
    if (event) {
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


export function EventDialog({ open, onOpenChange, event, onSaveSuccess }: EventDialogProps) {
    const { addEvent, updateEvent, pegawai = [] } = useAppFirestore();
    const { appUser } = useAuth();
    const [formData, setFormData] = useState<FormDataState>(() => getDefaultFormData(event));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            setFormData(getDefaultFormData(event));
        }
    }, [event, open]);
    
    // Logika handler tidak perlu diubah, sudah efisien
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

        if (new Date(formData.startDate).getTime() >= new Date(formData.endDate).getTime()) {
            toast({
                title: "Kesalahan Input Waktu",
                description: "Waktu selesai harus setelah waktu mulai.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        const eventPayload = {
            ...formData,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
            createdBy: appUser?.uid || null,
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
        } catch (error: unknown) {
            let errorMessage = "Terjadi kesalahan saat menyimpan kegiatan.";
            if (error instanceof Error) errorMessage = error.message;
            else if (typeof error === 'string') errorMessage = error;
            
            toast({
                title: "Gagal menyimpan kegiatan",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, appUser?.uid, event, addEvent, updateEvent, onOpenChange, toast, onSaveSuccess]);

    // **PERUBAHAN UTAMA ADA DI SINI (JSX)**
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[95vh] flex flex-col p-0">
                {/* Header Dialog yang lebih rapi */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        {event ? 'Edit Kegiatan' : 'Buat Kegiatan Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        Lengkapi detail di bawah ini untuk {event ? 'memperbarui' : 'membuat'} kegiatan.
                    </DialogDescription>
                </DialogHeader>

                {/* Form dengan layout grid yang responsif */}
                <form id="eventDialogForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Kolom Kiri: Info Utama */}
                        <div className="space-y-6">
                            {/* Nama Kegiatan */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-base font-semibold">Nama Kegiatan</Label>
                                <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Contoh: Rapat Koordinasi Proyek X" required disabled={isSubmitting} />
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-base font-semibold">Deskripsi</Label>
                                <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Jelaskan tujuan, agenda, dan hasil yang diharapkan dari kegiatan ini." rows={5} required disabled={isSubmitting} />
                            </div>

                            {/* Kategori & Lokasi dalam satu grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="flex items-center text-sm font-medium"><TagIcon className="w-4 h-4 mr-2" /> Kategori</Label>
                                    <Input id="category" value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} placeholder="Rapat" required disabled={isSubmitting} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center text-sm font-medium"><MapPinIcon className="w-4 h-4 mr-2" /> Lokasi</Label>
                                    <Input id="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="Aula Utama" required disabled={isSubmitting} />
                                </div>
                            </div>
                            
                            {/* Waktu Mulai & Selesai dalam satu grid */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate" className="flex items-center text-sm font-medium"><CalendarIcon className="w-4 h-4 mr-2" /> Waktu Mulai</Label>
                                    <Input id="startDate" type="datetime-local" value={formData.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} required disabled={isSubmitting} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate" className="flex items-center text-sm font-medium"><ClockIcon className="w-4 h-4 mr-2" /> Waktu Selesai</Label>
                                    <Input id="endDate" type="datetime-local" value={formData.endDate} min={formData.startDate} onChange={(e) => handleInputChange('endDate', e.target.value)} required disabled={isSubmitting} />
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Penugasan Pegawai */}
                        {pegawai.length > 0 && (
                            <div className="space-y-4 flex flex-col">
                                <Label className="text-base font-semibold">Tugaskan Pegawai</Label>
                                
                                {/* Aksi "Pilih Semua" */}
                                <div className="flex items-center space-x-2 border-b pb-3 mb-1">
                                    <Checkbox id="all-pegawai" checked={formData.assignedPegawai.length === pegawai.length} onCheckedChange={(checked) => handleInputChange('assignedPegawai', checked ? pegawai.map(p => p.id) : [])} disabled={isSubmitting} />
                                    <Label htmlFor="all-pegawai" className="text-sm font-medium">Pilih Semua Pegawai</Label>
                                </div>

                                {/* Daftar Pegawai dengan Grid Responsif */}
                                <div className="flex-1 border rounded-lg p-3 max-h-96 overflow-y-auto bg-slate-50">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                                        {pegawai.map((p: Pegawai) => (
                                            <div key={p.id} className="flex items-center space-x-3 p-2 hover:bg-slate-200 rounded-md transition-colors duration-150">
                                                <Checkbox id={`pegawai-${p.id}`} checked={formData.assignedPegawai.includes(p.id)} onCheckedChange={(checked) => handlePegawaiToggle(p.id, checked)} disabled={isSubmitting} />
                                                <Label htmlFor={`pegawai-${p.id}`} className="text-sm font-normal cursor-pointer w-full">
                                                    {p.nama}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer Dialog yang konsisten */}
                <DialogFooter className="px-6 py-4 border-t bg-slate-50 flex-shrink-0">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
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