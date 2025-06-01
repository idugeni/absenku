import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogDescription, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, UserPlus, Eye, QrCode } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pegawai, useAppFirestore } from '@/hooks/useAppFirestore';
import PegawaiDialog from '@/components/employees/PegawaiDialog';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PegawaiListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PegawaiList = ({ open, onOpenChange }: PegawaiListProps) => {
  const navigate = useNavigate();
  const { pegawai, deletePegawai } = useAppFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredPegawai = pegawai.filter(emp =>
    (emp.nama?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.nip?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.jabatan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = useCallback((status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" | null = "outline";
    let colorClasses = "";
    let text = "Tidak Diketahui";

    switch (status) {
      case 'aktif':
        variant = null;
        colorClasses = "bg-green-100 text-green-800 border-green-200";
        text = "Aktif";
        break;
      case 'pensiun':
        variant = "destructive";
        colorClasses = "bg-red-100 text-red-800 border-red-200";
        text = "Pensiun";
        break;
      case 'cuti':
        variant = "outline";
        colorClasses = "bg-yellow-100 text-yellow-800 border-yellow-200";
        text = "Cuti";
        break;
      default:
        break;
    }

    return <Badge variant={variant} className={colorClasses}>{text}</Badge>;
  }, []);

  const handleEdit = useCallback((pegawai: Pegawai) => {
    setSelectedPegawai(pegawai);
    setEditDialogOpen(true);
  }, []);

  const handleViewDetail = useCallback((pegawaiId: string) => {
    navigate(`/pegawai/${pegawaiId}`);
    onOpenChange(false);
  }, [navigate, onOpenChange]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deletePegawai(id);
      toast({
        title: "Berhasil!",
        description: "Data pegawai berhasil dihapus.",
        variant: "success",
      });
    } catch (error: unknown) {
      let errorMessage = "Terjadi kesalahan saat menghapus data pegawai.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast({
        title: "Gagal Menghapus Pegawai",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [deletePegawai, toast]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Mengurangi lebar dialog dan mengatur tinggi maksimum */}
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
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
            <DialogDescription className="sr-only">
              Kelola data pegawai, termasuk menambah, mengedit, dan menghapus informasi pegawai.
            </DialogDescription>
          </DialogHeader>

          {/* Konten utama yang dapat scroll, ambil sisa ruang */}
          <div className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari berdasarkan nama, NIP, email, atau jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
              {/* Memastikan TableHeader tetap di atas saat scroll */}
              <div className="overflow-y-auto flex-1">
                <Table className="relative">
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold w-[15%]">NIP</TableHead>
                      <TableHead className="font-semibold w-[25%]">Nama</TableHead>
                      <TableHead className="font-semibold w-[20%]">Jabatan</TableHead>
                      <TableHead className="font-semibold w-[20%]">Email</TableHead>
                      <TableHead className="font-semibold w-[10%]">Status</TableHead>
                      <TableHead className="font-semibold text-center w-[10%]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPegawai.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {searchTerm ? 'Tidak ada pegawai yang cocok dengan pencarian Anda.' : 'Belum ada data pegawai yang ditambahkan.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPegawai.map((pegawaiItem) => (
                        <TableRow key={pegawaiItem.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{pegawaiItem.nip}</TableCell>
                          <TableCell className="font-medium">{pegawaiItem.nama}</TableCell>
                          <TableCell>{pegawaiItem.jabatan}</TableCell>
                          <TableCell className="text-gray-600">{pegawaiItem.email}</TableCell>
                          <TableCell>{getStatusBadge(pegawaiItem.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1 justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetail(pegawaiItem.id!)}
                                className="h-8 w-8"
                                title="Lihat Detail"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(pegawaiItem)}
                                className="h-8 w-8"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Apakah Anda yakin ingin menghapus pegawai "{pegawaiItem.nama}"? Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(pegawaiItem.id!)} className="bg-red-600 hover:bg-red-700">
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Footer dialog yang menempel di bawah */}
            <div className="mt-auto pt-4 border-t px-6 pb-6 bg-background flex-shrink-0">
              <div className="text-sm text-gray-500">
                Total: {filteredPegawai.length} pegawai
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PegawaiDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        pegawai={selectedPegawai}
        onSaveSuccess={() => {
        }}
      />
    </>
  );
};

export default PegawaiList;