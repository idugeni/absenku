import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Database } from 'lucide-react'; // Removed CheckCircle, AlertCircle as they are not used directly in toast properties
import { useToast } from '@/components/ui/use-toast';
import { useAppFirestore } from '@/hooks/useAppFirestore';

const DataManagement = () => {
  const { toast } = useToast();
  const { exportCollectionToJson, importCollectionFromJson } = useAppFirestore();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackupData = async () => {
    setIsBackingUp(true);
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
        variant: "default",
      });
    } catch (error: unknown) { // Changed to unknown
      console.error('Error during backup:', error);
      let errorMessage = "Terjadi kesalahan saat melakukan backup data. Silakan coba lagi.";
      if (error instanceof Error) { // Type guard to check if it's an Error instance
        errorMessage = error.message;
      }
      toast({
        title: "Backup Gagal",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
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
          setIsRestoring(true); // Start loading state for restore
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const content = e.target?.result as string;
              const restoredData = JSON.parse(content);

              // Validate the structure of the backup file before importing
              if (!restoredData.pegawai || !restoredData.events || !restoredData.attendance) {
                throw new Error("File backup tidak lengkap atau tidak valid.");
              }

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
                variant: "default",
              });
            } catch (parseError: unknown) { // Changed to unknown
              console.error('Error parsing JSON or importing data:', parseError);
              let errorMessage = "File yang dipilih bukan file backup yang valid atau terjadi kesalahan saat import.";
              if (parseError instanceof Error) { // Type guard
                errorMessage = parseError.message;
              }
              toast({
                title: "Restore Gagal",
                description: errorMessage,
                variant: "destructive",
              });
            } finally {
              setIsRestoring(false); // End loading state
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    } catch (error: unknown) { // Changed to unknown
      console.error('Error during restore initiation:', error);
      let errorMessage = "Terjadi kesalahan saat memulai proses restore data.";
      if (error instanceof Error) { // Type guard
        errorMessage = error.message;
      }
      toast({
        title: "Restore Gagal",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="shadow-lg border-2 border-gray-100 dark:border-gray-800">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800 dark:text-gray-100">
            <Database className="h-7 w-7 mr-3 text-emerald-600 dark:text-emerald-400" />
            Manajemen Data
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola data aplikasi Anda dengan membuat cadangan atau memulihkannya.
          </p>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Backup Data Section */}
            <div className="space-y-4 p-5 border rounded-lg bg-blue-50/50 dark:bg-blue-900/20 flex flex-col justify-between">
              <h4 className="font-semibold text-lg flex items-center text-gray-800 dark:text-gray-100">
                <Download className="h-5 w-5 mr-3 text-blue-600" /> Backup Data
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
                Buat salinan cadangan dari semua data penting sistem Anda (pegawai, acara, dan kehadiran) dalam format JSON. Disarankan untuk backup secara berkala.
              </p>
              <Button 
                onClick={handleBackupData} 
                className="w-full mt-4 px-6 py-2.5 text-base font-semibold"
                disabled={isBackingUp}
              >
                {isBackingUp ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mem-backup...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Backup Sekarang
                  </>
                )}
              </Button>
            </div>
            
            {/* Restore Data Section */}
            <div className="space-y-4 p-5 border rounded-lg bg-orange-50/50 dark:bg-orange-900/20 flex flex-col justify-between">
              <h4 className="font-semibold text-lg flex items-center text-gray-800 dark:text-gray-100">
                <Upload className="h-5 w-5 mr-3 text-orange-600" /> Pulihkan Data
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
                Pulihkan data sistem Anda dari file cadangan JSON yang telah ada. **Peringatan: Ini akan menimpa data yang ada.**
              </p>
              <Button 
                onClick={handleRestoreData} 
                className="w-full mt-4 px-6 py-2.5 text-base font-semibold"
                disabled={isRestoring}
              >
                {isRestoring ? (
                   <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memulihkan...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Pulihkan Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagement;