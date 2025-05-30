import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAppFirestore } from '@/hooks/useAppFirestore';

interface ProfileSettingsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ loading, setLoading }) => {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const { updateUserProfile } = useAppFirestore();

  const [profile, setProfile] = useState({
    nama: '',
    phone: '',
    position: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfile({
        nama: currentUser.displayName || '',
        phone: userProfile?.phone || '',
        position: userProfile?.position || ''
      });
    }
  }, [currentUser, userProfile]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await updateUserProfile(currentUser.uid, profile);
      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui profil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Profil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{currentUser?.email}</h3>
            <p className="text-gray-600">Administrator</p>
            <Badge className="mt-1 bg-green-100 text-green-800">Aktif</Badge>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Masukkan nama lengkap"
              value={profile.nama}
              onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={currentUser?.email || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              placeholder="Masukkan nomor telepon"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Jabatan</Label>
            <Input
              id="position"
              placeholder="Masukkan jabatan"
              value={profile.position}
              onChange={(e) => setProfile({ ...profile, position: e.target.value })}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveProfile} disabled={loading}>
            Simpan Perubahan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;