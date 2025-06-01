import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

const PegawaiEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pegawai, updatePegawai } = useAppFirestore();
  const { toast } = useToast();

  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [status, setStatus] = useState<'aktif' | 'pensiun' | 'cuti'>('aktif');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPegawaiData = useCallback(() => {
    if (!id) {
      toast({
        title: "Error",
        description: "ID pegawai tidak ditemukan di URL.",
        variant: "destructive"
      });
      navigate('/pegawai');
      return;
    }

    if (pegawai.length > 0) {
      const currentPegawai = pegawai.find(p => p.id === id);
      if (currentPegawai) {
        setNama(currentPegawai.nama);
        setNip(currentPegawai.nip);
        setEmail(currentPegawai.email);
        setPhoneNumber(currentPegawai.phoneNumber || '');
        setJabatan(currentPegawai.jabatan);
        setStatus(currentPegawai.status);
      } else {
        toast({
          title: "Data Tidak Ditemukan",
          description: "Pegawai dengan ID tersebut tidak ditemukan.",
          variant: "destructive"
        });
        navigate('/pegawai');
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [id, pegawai, navigate, toast]);

  useEffect(() => {
    loadPegawaiData();
  }, [loadPegawaiData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!nama || !nip || !email || !jabatan || !status) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua bidang yang wajib diisi.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "ID pegawai tidak valid untuk pembaruan.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await updatePegawai(id, {
        nama,
        nip,
        email,
        phoneNumber,
        jabatan,
        status,
      });
      toast({
        title: "Sukses",
        description: "Data pegawai berhasil diperbarui.",
      });
      navigate(`/pegawai/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Gagal Memperbarui",
          description: `Terjadi kesalahan saat memperbarui data: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Gagal Memperbarui",
          description: "Terjadi kesalahan yang tidak diketahui saat memperbarui data.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Memuat data pegawai...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <Button onClick={() => navigate(-1)} variant="outline" className="mb-6 flex items-center">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Daftar Pegawai
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Edit Data Pegawai</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Perbarui informasi detail pegawai di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Masukkan NIP"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@domain.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor Telepon/WhatsApp</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Contoh: 08123456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jabatan">Jabatan</Label>
                <Input
                  id="jabatan"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Manajer Pemasaran"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as 'aktif' | 'pensiun' | 'cuti')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Status Pegawai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="cuti">Cuti</SelectItem>
                    <SelectItem value="pensiun">Pensiun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PegawaiEdit;