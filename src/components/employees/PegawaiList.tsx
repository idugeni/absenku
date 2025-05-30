
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, UserPlus, Eye, QrCode } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pegawai, useAppFirestore } from '@/hooks/useAppFirestore';
import PegawaiDialog from '@/components/employees/PegawaiDialog';

interface PegawaiListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PegawaiList = ({ open, onOpenChange }: PegawaiListProps) => {
  const navigate = useNavigate();
  const { pegawai, deletePegawai } = useAppFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const filteredPegawai = pegawai.filter(emp =>
    (emp.nama?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.nip?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.jabatan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>;
      case 'pensiun':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Non-aktif</Badge>;
      case 'cuti':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Cuti</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadgeVariant = (status: 'aktif' | 'pensiun' | 'cuti') => {
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

  const handleEdit = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai);
    setEditDialogOpen(true);
  };

  const handleViewDetail = (pegawaiId: string) => {
    navigate(`/pegawai/${pegawaiId}`);
    onOpenChange(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pegawai ini?')) {
      await deletePegawai(id);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center justify-between text-xl font-semibold">
              <span>Manajemen Data Pegawai</span>
              <Button
                onClick={() => {
                  setSelectedPegawai(null);
                  setEditDialogOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Tambah Pegawai
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari berdasarkan nama, NIP, email, atau jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <div className="border rounded-lg overflow-hidden flex-1">
              <div className="overflow-auto max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">NIP</TableHead>
                      <TableHead className="font-semibold">Nama</TableHead>
                      <TableHead className="font-semibold">Jabatan</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPegawai.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {searchTerm ? 'Tidak ada pegawai yang ditemukan' : 'Belum ada data pegawai'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPegawai.map((pegawai) => (
                        <TableRow key={pegawai.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{pegawai.nip}</TableCell>
                          <TableCell className="font-medium">{pegawai.nama}</TableCell>
                          <TableCell>{pegawai.jabatan}</TableCell>
                          <TableCell className="text-gray-600">{pegawai.email}</TableCell>
                          <TableCell>{getStatusBadge(pegawai.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetail(pegawai.id!)}
                                className="h-8 w-8 p-0"
                                title="Lihat Detail"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(pegawai)}
                                className="h-8 w-8 p-0"
                                title="Edit"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(pegawai.id!)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Hapus"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="text-sm text-gray-500 py-2 border-t">
              Total: {filteredPegawai.length} pegawai
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PegawaiDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        pegawai={selectedPegawai}
      />
    </>
  );
};

export default PegawaiList;
