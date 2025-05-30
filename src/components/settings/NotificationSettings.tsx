import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAppFirestore } from '@/hooks/useAppFirestore';

interface NotificationSettingsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ loading, setLoading }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { updateUserProfile } = useAppFirestore();

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    attendanceReminders: true,
    eventUpdates: true
  });

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await updateUserProfile(currentUser.uid, { notifications });
      toast({
        title: "Berhasil",
        description: "Pengaturan notifikasi berhasil disimpan"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan notifikasi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Notifikasi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifikasi Email</h4>
              <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifikasi Push</h4>
              <p className="text-sm text-gray-600">Terima notifikasi push di browser</p>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, pushNotifications: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Pengingat Kehadiran</h4>
              <p className="text-sm text-gray-600">Pengingat otomatis untuk kegiatan</p>
            </div>
            <Switch
              checked={notifications.attendanceReminders}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, attendanceReminders: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Update Kegiatan</h4>
              <p className="text-sm text-gray-600">Notifikasi perubahan kegiatan</p>
            </div>
            <Switch
              checked={notifications.eventUpdates}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, eventUpdates: checked }))
              }
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveNotifications} disabled={loading}>
            Simpan Pengaturan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;