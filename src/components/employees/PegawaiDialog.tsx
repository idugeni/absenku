
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Pegawai } from '@/types';

interface PegawaiFormState {
  nip: string;
  nama: string;
  email: string;
  jabatan: string;
  status: 'aktif' | 'pensiun' | 'cuti';
  tanggalBergabung: string;
  photoUrl: string;
}

interface PegawaiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pegawai?: Pegawai | null;
  onSaveSuccess?: () => void; // Add this line
}

const PegawaiDialog = ({ open, onOpenChange, pegawai, onSaveSuccess }: PegawaiDialogProps) => {
  const { addPegawai, updatePegawai } = useAppFirestore();
  const [formData, setFormData] = useState<PegawaiFormState>({
    nama: '',
    nip: '',
    jabatan: '',
    email: '',
    status: 'aktif' as 'aktif' | 'pensiun' | 'cuti',
    tanggalBergabung: new Date().toISOString().split('T')[0], // Ensure it's a string in YYYY-MM-DD format
    photoUrl: '',
  });

  useEffect(() => {
    if (pegawai) {
      setFormData({
        nip: pegawai.nip,
        nama: pegawai.nama,
        email: pegawai.email,
        jabatan: pegawai.jabatan,
        status: pegawai.status,
        tanggalBergabung: pegawai.tanggalBergabung.toISOString().split('T')[0],
        photoUrl: pegawai.photoUrl || '',
      });
    } else {
      setFormData({
        nip: '',
        nama: '',
        email: '',
        jabatan: '',
        status: 'aktif',
        tanggalBergabung: new Date().toISOString().split('T')[0],
        photoUrl: '',
      });
    }
  }, [pegawai, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pegawaiData = {
      ...formData,
      tanggalBergabung: new Date(formData.tanggalBergabung)
    };

    if (pegawai?.id) {
      await updatePegawai(pegawai.id, pegawaiData);
    } else {
      await addPegawai(pegawaiData);
    }
    
    onOpenChange(false);
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {pegawai ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nip" className="text-sm font-medium">NIP</Label>
              <Input
                id="nip"
                value={formData.nip}
                onChange={(e) => setFormData(prev => ({ ...prev, nip: e.target.value }))}
                placeholder="198501012010011001"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-sm font-medium">Nama Lengkap</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                placeholder="Dr. Ahmad Suryanto, M.Pd"
                className="h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="ahmad.suryanto@instansi.go.id"
              className="h-11"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jabatan" className="text-sm font-medium">Jabatan</Label>
              <Input
                id="jabatan"
                value={formData.jabatan}
                onChange={(e) => setFormData(prev => ({ ...prev, jabatan: e.target.value }))}
                placeholder="Kepala Bidang"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'aktif' | 'pensiun' | 'cuti') => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="pensiun">Pensiun</SelectItem>
                  <SelectItem value="cuti">Cuti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tanggalBergabung" className="text-sm font-medium">Tanggal Bergabung</Label>
            <Input
              id="tanggalBergabung"
              type="date"
              value={formData.tanggalBergabung}
              onChange={(e) => setFormData(prev => ({ ...prev, tanggalBergabung: e.target.value }))}
              className="h-11"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6">
              {pegawai ? 'Perbarui' : 'Tambah'} Pegawai
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PegawaiDialog;
