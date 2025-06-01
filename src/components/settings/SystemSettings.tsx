import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Settings, Clock, CalendarDays, Globe, Cloud, Save } from 'lucide-react'; 

interface SystemSettingsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ loading, setLoading }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { updateUserProfile } = useAppFirestore(); 

  const [systemSettings, setSystemSettings] = useState({
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    language: 'id',
    autoBackup: true,
    maxAttendanceTime: '30'
  });

  const handleSaveSystem = async () => {
    setLoading(true);
    try {
      
      if (currentUser?.uid) {
        await updateUserProfile(currentUser.uid, { systemSettings });
        toast({
          title: "Berhasil",
          description: "Pengaturan sistem berhasil disimpan.",
          variant: "default" 
        });
      } else {
        toast({
          title: "Error",
          description: "Pengguna tidak terautentikasi.",
          variant: "destructive"
        });
      }
    } catch (error) {

      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan sistem. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4"> 
      <Card className="shadow-lg border-2 border-gray-100 dark:border-gray-800"> 
        <CardHeader className="border-b pb-4"> 
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800 dark:text-gray-100">
            <Settings className="h-7 w-7 mr-3 text-indigo-600 dark:text-indigo-400" /> 
            Pengaturan Sistem
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sesuaikan preferensi aplikasi Anda secara keseluruhan.</p> 
        </CardHeader>
        <CardContent className="space-y-8 p-6"> 
          
          <div className="grid gap-6 md:grid-cols-2"> 
            
            <div className="space-y-2">
              <Label htmlFor="timezone" className="font-semibold flex items-center text-gray-700 dark:text-gray-200">
                <Clock className="h-4 w-4 mr-2 text-blue-500" /> Zona Waktu
              </Label>
              <Select value={systemSettings.timezone} onValueChange={(value) => 
                setSystemSettings(prev => ({ ...prev, timezone: value }))
              }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Zona Waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">WIB (GMT+7) - Jakarta</SelectItem>
                  <SelectItem value="Asia/Makassar">WITA (GMT+8) - Makassar</SelectItem>
                  <SelectItem value="Asia/Jayapura">WIT (GMT+9) - Jayapura</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Atur zona waktu yang digunakan untuk semua operasi aplikasi.</p>
            </div>
            
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat" className="font-semibold flex items-center text-gray-700 dark:text-gray-200">
                <CalendarDays className="h-4 w-4 mr-2 text-green-500" /> Format Tanggal
              </Label>
              <Select value={systemSettings.dateFormat} onValueChange={(value) => 
                setSystemSettings(prev => ({ ...prev, dateFormat: value }))
              }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Format Tanggal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (contoh: 31/05/2025)</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (contoh: 05/31/2025)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (contoh: 2025-05-31)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pilih format tampilan tanggal yang Anda inginkan.</p>
            </div>
            
            
            <div className="space-y-2">
              <Label htmlFor="language" className="font-semibold flex items-center text-gray-700 dark:text-gray-200">
                <Globe className="h-4 w-4 mr-2 text-purple-500" /> Bahasa
              </Label>
              <Select value={systemSettings.language} onValueChange={(value) => 
                setSystemSettings(prev => ({ ...prev, language: value }))
              }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Bahasa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ganti bahasa antarmuka aplikasi.</p>
            </div>
            
            
            <div className="space-y-2">
              <Label htmlFor="maxAttendanceTime" className="font-semibold flex items-center text-gray-700 dark:text-gray-200">
                <Clock className="h-4 w-4 mr-2 text-orange-500" /> Batas Waktu Absensi
              </Label>
              <div className="flex items-center"> 
                <Input
                  id="maxAttendanceTime"
                  type="number" 
                  value={systemSettings.maxAttendanceTime}
                  onChange={(e) => 
                    setSystemSettings(prev => ({ ...prev, maxAttendanceTime: e.target.value }))
                  }
                  placeholder="30"
                  className="flex-grow"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">menit</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Batas waktu (dalam menit) untuk mengizinkan absensi setelah waktu mulai acara.</p>
            </div>
          </div>
          
          <Separator className="my-6" /> 
          
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"> 
            <div>
              <h4 className="font-medium flex items-center text-gray-800 dark:text-gray-100">
                <Cloud className="h-5 w-5 mr-2 text-teal-500" /> Backup Otomatis
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Aktifkan untuk mencadangkan data Anda secara otomatis setiap hari.</p>
            </div>
            <Switch
              checked={systemSettings.autoBackup}
              onCheckedChange={(checked) => 
                setSystemSettings(prev => ({ ...prev, autoBackup: checked }))
              }
            />
          </div>
          
          <div className="flex justify-end w-full pt-4"> 
            <Button onClick={handleSaveSystem} disabled={loading} className="w-full md:w-auto px-6 py-2.5 text-base font-semibold">
              <Save className="h-5 w-5 mr-2" /> 
              {loading ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;