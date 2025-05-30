import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAppFirestore } from '@/hooks/useAppFirestore';

const DataManagement = () => {
  const { toast } = useToast();
  const { exportCollectionToJson, importCollectionFromJson } = useAppFirestore();

  const handleBackupData = async () => {
    try {
      const pegawaiData = await exportCollectionToJson('pegawai');
      const eventsData = await exportCollectionToJson('events');
      const attendanceData = await exportCollectionToJson('attendance');

      const backupData = {
        pegawai: pegawaiData,
        events: eventsData,
        attendance: attendanceData,
        timestamp: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `absenku_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Berhasil",
        description: "Data Anda telah berhasil di-backup dan diunduh.",
      });
    } catch (error) {
      console.error('Error during backup:', error);
      toast({
        title: "Backup Gagal",
        description: "Terjadi kesalahan saat melakukan backup data.",
        variant: "destructive",
      });
    }
  };

  const handleRestoreData = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const content = e.target?.result as string;
              const restoredData = JSON.parse(content);

              if (restoredData.pegawai) {
                await importCollectionFromJson('pegawai', restoredData.pegawai);
              }
              if (restoredData.events) {
                await importCollectionFromJson('events', restoredData.events);
              }
              if (restoredData.attendance) {
                await importCollectionFromJson('attendance', restoredData.attendance);
              }

              toast({
                title: "Restore Berhasil",
                description: "Data Anda telah berhasil dipulihkan.",
              });
            } catch (parseError) {
              console.error('Error parsing JSON:', parseError);
              toast({
                title: "Restore Gagal",
                description: "File yang dipilih bukan file backup yang valid.",
                variant: "destructive",
              });
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    } catch (error) {
      console.error('Error during restore initiation:', error);
      toast({
        title: "Restore Gagal",
        description: "Terjadi kesalahan saat memulai proses restore data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-medium">Backup Data</h4>
            <p className="text-sm text-gray-600">
              Buat salinan cadangan dari semua data sistem
            </p>
            <Button onClick={handleBackupData} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Backup Sekarang
            </Button>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Pulihkan Data</h4>
            <p className="text-sm text-gray-600">
              Pulihkan data dari file cadangan yang ada
            </p>
            <Button onClick={handleRestoreData} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Pulihkan Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManagement;