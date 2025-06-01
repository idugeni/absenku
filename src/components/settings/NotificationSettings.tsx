import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { Bell, Mail, Smartphone, MessageSquare, Save } from 'lucide-react';

interface NotificationSettingsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ loading, setLoading }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { updateUserProfile } = useAppFirestore();

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      if (currentUser?.uid) {
        await updateUserProfile(currentUser.uid, { notifications });
        toast({
          title: "Berhasil",
          description: "Pengaturan notifikasi berhasil disimpan.",
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
        description: "Gagal menyimpan pengaturan notifikasi. Silakan coba lagi.",
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
            <Bell className="h-7 w-7 mr-3 text-purple-600 dark:text-purple-400" /> {/* Icon added */}
            Pengaturan Notifikasi
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sesuaikan bagaimana Anda ingin menerima pembaruan dan informasi dari aplikasi.
          </p>
        </CardHeader>
        <CardContent className="space-y-8 p-6"> {/* Increased vertical spacing and padding */}
          
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-blue-500" />
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-100">Notifikasi Email</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Terima pembaruan penting, ringkasan aktivitas, dan pengumuman ke kotak masuk email Anda.
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, email: checked }))
              }
            />
          </div>
          
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 mr-3 text-green-500" />
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-100">Notifikasi Push</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Dapatkan notifikasi instan langsung di perangkat Anda saat aplikasi tidak dibuka (memerlukan izin browser).
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, push: checked }))
              }
            />
          </div>
          
          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-3 text-orange-500" />
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-100">Notifikasi SMS</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Terima pemberitahuan singkat dan penting langsung ke nomor telepon Anda (biaya SMS mungkin berlaku).
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, sms: checked }))
              }
            />
          </div>
          
          <div className="flex justify-end w-full pt-4">
            <Button onClick={handleSaveNotifications} disabled={loading} className="w-full md:w-auto px-6 py-2.5 text-base font-semibold">
              <Save className="h-5 w-5 mr-2" />
              {loading ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;