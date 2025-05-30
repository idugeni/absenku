import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Link } from 'react-router-dom';
import { Search, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Pegawai {
  id?: string;
  nama: string;
  nip: string;
  jabatan: string;
  email: string;
  status: 'aktif' | 'pensiun' | 'cuti';
  tanggalBergabung?: Date;
  photoUrl?: string;
  qrCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PegawaiPage = () => {
  const { pegawai } = useAppFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  const filteredPegawai = useMemo(() => {
    console.log('Pegawai data:', pegawai);
    console.log('Search term:', searchTerm);
    console.log('Filter status:', filterStatus);

    if (!Array.isArray(pegawai)) {
      console.log('Pegawai is not an array, returning empty.');
      return []; // Return an empty array if pegawai is not an array
    }
    return pegawai.filter(p => {
      const matchesSearch = (p.nama && p.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (p.nip && p.nip.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [pegawai, searchTerm, filterStatus]);

  const getStatusVariant = (status: 'aktif' | 'pensiun' | 'cuti') => {
    switch (status) {
      case 'aktif':
        return 'default';
      case 'pensiun':
        return 'destructive';
      case 'cuti':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Daftar Pegawai</h1>
        <Button asChild>
          <Link to="/pegawai/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pegawai Baru
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari pegawai berdasarkan nama atau NIP..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={handleFilterChange} value={filterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="pensiun">Pensiun</SelectItem>
            <SelectItem value="cuti">Cuti</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {filteredPegawai.length > 0 ? (
          filteredPegawai.map((p: Pegawai) => (
            <Card key={p.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden rounded-lg py-0">
              <CardHeader className="flex flex-col items-center justify-center p-6 flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Avatar className="w-28 h-28 mb-3">
                  <AvatarFallback className="bg-blue-600 text-white text-4xl font-semibold">
                    {p.nama.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <div className="flex flex-col flex-grow">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 text-center">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 break-words md:whitespace-normal">{p.nama}</CardTitle>
                  <Badge variant="secondary" className="px-3 py-1 text-xs font-medium rounded-full">{p.jabatan}</Badge>
                </div>
                <CardContent className="flex-grow text-sm text-foreground space-y-2 p-5 border-b border-gray-200 dark:border-gray-700">
                  <p><span className="font-semibold text-gray-700 dark:text-gray-300">NIP:</span> <span className="break-all text-gray-800 dark:text-gray-200 md:whitespace-normal">{p.nip}</span></p>
                  <p><span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span> <span className="break-all text-gray-800 dark:text-gray-200 md:whitespace-normal">{p.email}</span></p>
                  <p className="flex items-center"><span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Status:</span> <Badge variant={getStatusVariant(p.status)} className="px-3 py-1 text-xs font-medium rounded-full">{p.status.charAt(0).toUpperCase() + p.status.slice(1).replace('_', ' ')}</Badge></p>
                  <p><span className="font-semibold text-gray-700 dark:text-gray-300">Bergabung:</span> <span className="break-words text-gray-800 dark:text-gray-200">{p.tanggalBergabung ? new Date(p.tanggalBergabung).toLocaleDateString('id-ID') : 'N/A'}</span></p>
                </CardContent>
                <div className="p-5">
                  <Button asChild className="w-full text-base font-semibold py-2 rounded-md">
                    <Link to={`/pegawai/${p.id}`}>Lihat Detail</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>Tidak ada pegawai yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PegawaiPage;