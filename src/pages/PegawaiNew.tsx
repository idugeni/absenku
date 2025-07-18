import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Pegawai } from '@/types';

const PegawaiNew = () => {
  const [formData, setFormData] = useState<Partial<Pegawai>>({
    nama: '',
    nip: '',
    jabatan: '',
    email: '',
    status: 'aktif',
    tanggalBergabung: new Date(),
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addPegawai } = useAppFirestore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate('/pegawai');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as 'aktif' | 'pensiun' | 'cuti',
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.nip || !formData.jabatan || !formData.email) {
        toast({
            title: 'Data Tidak Lengkap',
            description: 'Harap isi semua field yang wajib diisi.',
            variant: 'destructive',
        });
        return;
    }
    setIsLoading(true);
    try {
      
      
      
      
      const dataToSubmit: Omit<Pegawai, 'id' | 'createdAt' | 'updatedAt' | 'qrCode'> = {
        nama: formData.nama!,
        nip: formData.nip!,
        jabatan: formData.jabatan!,
        email: formData.email!,
        phoneNumber: formData.phoneNumber || '',
        status: formData.status!,
        tanggalBergabung: new Date(),
      };

      await addPegawai({
        ...dataToSubmit,
        tanggalBergabung: new Date()
      });
      toast({
        title: 'Berhasil!',
        description: 'Data pegawai berhasil ditambahkan.',
        className: 'bg-green-100 border-green-400 text-green-700',
      });
      navigate('/pegawai');
    } catch (error) {
      toast({
        title: "Error",
        description: `Error adding pegawai: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="mb-4">
        <Button variant="outline" onClick={handleGoBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Pegawai
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto shadow-lg py-0"> {/* Tambahkan shadow untuk efek kedalaman */}
        <CardHeader className="bg-gray-50 dark:bg-gray-800 p-6 rounded-t-lg"> {/* Warna latar header */}
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Tambah Pegawai Baru
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 pt-1">
            Isi formulir di bawah ini untuk mendaftarkan pegawai baru ke dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6"> {/* Tambahkan padding dan space lebih besar */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Lengkap */}
            <div>
              <Label htmlFor="nama" className="font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</Label>
              <Input
                id="nama"
                type="text"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap pegawai"
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>

            {/* NIP */}
            <div>
              <Label htmlFor="nip" className="font-medium text-gray-700 dark:text-gray-300">NIP</Label>
              <Input
                id="nip"
                type="text"
                value={formData.nip}
                onChange={handleChange}
                placeholder="Nomor Induk Pegawai"
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>

            {/* Jabatan */}
            <div>
              <Label htmlFor="jabatan" className="font-medium text-gray-700 dark:text-gray-300">Jabatan</Label>
              <Input
                id="jabatan"
                type="text"
                value={formData.jabatan}
                onChange={handleChange}
                placeholder="Posisi atau jabatan pegawai"
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Alamat email aktif"
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>

            {/* Nomor Telepon/WhatsApp */}
            <div>
              <Label htmlFor="phoneNumber" className="font-medium text-gray-700 dark:text-gray-300">Nomor Telepon/WhatsApp</Label>
              <Input
                id="phoneNumber"
                type="text"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                placeholder="Contoh: +6281234567890"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            


            {/* Status */}
            <div>
              <Label htmlFor="status" className="font-medium text-gray-700 dark:text-gray-300">Status</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, status: value as 'aktif' | 'pensiun' | 'cuti' })} value={formData.status}>
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

            {/* Tombol Submit di dalam CardFooter untuk estetika */}
          </form>
        </CardContent>
        <CardFooter className="p-6 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
          <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Tambah Pegawai'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PegawaiNew;