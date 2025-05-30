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
      await updateUserProfile(currentUser.uid, { systemSettings });
      toast({
        title: "Berhasil",
        description: "Pengaturan sistem berhasil disimpan"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan sistem",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Sistem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="timezone">Zona Waktu</Label>
            <Select value={systemSettings.timezone} onValueChange={(value) => 
              setSystemSettings(prev => ({ ...prev, timezone: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Jakarta">WIB (GMT+7)</SelectItem>
                <SelectItem value="Asia/Makassar">WITA (GMT+8)</SelectItem>
                <SelectItem value="Asia/Jayapura">WIT (GMT+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Format Tanggal</Label>
            <Select value={systemSettings.dateFormat} onValueChange={(value) => 
              setSystemSettings(prev => ({ ...prev, dateFormat: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">Bahasa</Label>
            <Select value={systemSettings.language} onValueChange={(value) => 
              setSystemSettings(prev => ({ ...prev, language: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxAttendanceTime">Batas Waktu Absensi (menit)</Label>
            <Input
              id="maxAttendanceTime"
              value={systemSettings.maxAttendanceTime}
              onChange={(e) => 
                setSystemSettings(prev => ({ ...prev, maxAttendanceTime: e.target.value }))
              }
              placeholder="30"
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Backup Otomatis</h4>
            <p className="text-sm text-gray-600">Backup data secara otomatis setiap hari</p>
          </div>
          <Switch
            checked={systemSettings.autoBackup}
            onCheckedChange={(checked) => 
              setSystemSettings(prev => ({ ...prev, autoBackup: checked }))
            }
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSystem} disabled={loading}>
            Simpan Pengaturan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;