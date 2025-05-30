import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const PegawaiEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pegawai, updatePegawai } = useAppFirestore();
  const { toast } = useToast();

  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [email, setEmail] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [status, setStatus] = useState<'aktif' | 'pensiun' | 'cuti'>('aktif');
  const [tanggalBergabung, setTanggalBergabung] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pegawai.length > 0 && id) {
      const currentPegawai = pegawai.find(p => p.id === id);
      if (currentPegawai) {
        setNama(currentPegawai.nama);
        setNip(currentPegawai.nip);
        setEmail(currentPegawai.email);
        setJabatan(currentPegawai.jabatan);
        setStatus(currentPegawai.status);
        setTanggalBergabung(currentPegawai.tanggalBergabung.toISOString().split('T')[0]);
      } else {
        toast({
          title: "Error",
          description: "Pegawai tidak ditemukan.",
          variant: "destructive"
        });
        navigate('/pegawai');
      }
      setLoading(false);
    } else if (pegawai.length === 0 && !id) {
      setLoading(false);
    }
  }, [pegawai, id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updatePegawai(id, {
        nama,
        nip,
        email,
        jabatan,
        status: status as 'aktif' | 'pensiun' | 'cuti',
        tanggalBergabung: new Date(tanggalBergabung),
      });
      toast({
        title: "Sukses",
        description: "Data pegawai berhasil diperbarui."
      });
      navigate(`/pegawai/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: `Error updating pegawai: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Button onClick={() => navigate(-1)} variant="outline" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Data Pegawai</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" value={nip} onChange={(e) => setNip(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jabatan">Jabatan</Label>
                <Input id="jabatan" value={jabatan} onChange={(e) => setJabatan(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as 'aktif' | 'pensiun' | 'cuti')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="cuti">Cuti</SelectItem>
                    <SelectItem value="pensiun">Pensiun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggalBergabung">Tanggal Bergabung</Label>
                <Input id="tanggalBergabung" type="date" value={tanggalBergabung} onChange={(e) => setTanggalBergabung(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full">Simpan Perubahan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PegawaiEdit;