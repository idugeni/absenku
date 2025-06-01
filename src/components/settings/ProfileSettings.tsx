import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Briefcase, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAppFirestore } from '@/hooks/useAppFirestore';

interface ProfileSettingsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}


const getGradientColorClass = (id: string) => {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600',
    'from-teal-400 to-teal-600',
    'from-orange-400 to-orange-600',
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return `bg-gradient-to-r ${colors[index]}`;
};


const ProfileSettings: React.FC<ProfileSettingsProps> = ({ loading, setLoading }) => {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const { updateUserProfile } = useAppFirestore();

  const [profile, setProfile] = useState({
    displayName: '',
    phoneNumber: '',
    position: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfile({
        displayName: currentUser.displayName || '',
        phoneNumber: userProfile?.phoneNumber || '',
        position: userProfile?.position || ''
      });
    }
  }, [currentUser, userProfile]);

  const handleSaveProfile = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Pengguna tidak terautentikasi.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile(currentUser.uid, {
        displayName: profile.displayName,
        phoneNumber: profile.phoneNumber,
        position: profile.position
      });
      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui.",
        variant: "default"
      });
    } catch (error) {

      toast({
        title: "Error",
        description: "Gagal memperbarui profil. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'AK';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="shadow-lg border-2 border-gray-100 dark:border-gray-800">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800 dark:text-gray-100">
            <User className="h-7 w-7 mr-3 text-blue-600 dark:text-blue-400" />
            Informasi Profil
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola informasi pribadi dan detail kontak Anda.</p>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Avatar className="h-20 w-20 border-2 border-white dark:border-gray-700 shadow-sm">
              {currentUser?.photoURL ? (
                <AvatarImage src={currentUser.photoURL} alt="User Avatar" />
              ) : (
                <AvatarFallback className={`text-white text-3xl font-bold ${getGradientColorClass(currentUser?.uid || currentUser?.email || 'default')}`}>
                  {getInitials(profile.displayName || currentUser?.displayName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{profile.displayName || 'Pengguna'}</h3>
              <p className="text-base text-gray-600 dark:text-gray-300 flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2 text-gray-500" /> {currentUser?.email || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                 {/* This 'Administrator' is a placeholder. You might get roles from userProfile.role */}
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 px-2 py-0.5 mt-1">
                  Administrator
                </Badge>
              </p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Profile Details Form */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold flex items-center text-gray-700 dark:text-gray-200">
                <User className="h-4 w-4 mr-2 text-blue-500" /> Nama Lengkap
              </Label>
              <Input
                id="name"
                placeholder="Contoh: Prabu Prawira Laksana"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} 
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nama yang akan ditampilkan di aplikasi.</p>
            </div>
            
            {/* Email (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold flex items-center text-gray-700 dark:text-gray-200">
                <Mail className="h-4 w-4 mr-2 text-red-500" /> Email
              </Label>
              <Input id="email" value={currentUser?.email || ''} disabled className="w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email Anda digunakan sebagai ID login dan tidak dapat diubah.</p>
            </div>
            
            {/* Nomor Telepon */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-semibold flex items-center text-gray-700 dark:text-gray-200">
                <Phone className="h-4 w-4 mr-2 text-green-500" /> Nomor Telepon
              </Label>
              <Input
                id="phone"
                placeholder="Contoh: +6281234567890"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })} 
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nomor yang dapat dihubungi.</p>
            </div>
            
            {/* Jabatan */}
            <div className="space-y-2">
              <Label htmlFor="position" className="font-semibold flex items-center text-gray-700 dark:text-gray-200">
                <Briefcase className="h-4 w-4 mr-2 text-orange-500" /> Jabatan
              </Label>
              <Input
                id="position"
                placeholder="Contoh: Manager Operasional"
                value={profile.position}
                onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jabatan atau peran Anda dalam organisasi.</p>
            </div>
          </div>
          
          <div className="flex justify-end w-full pt-4">
            <Button onClick={handleSaveProfile} disabled={loading} className="w-full md:w-auto px-6 py-2.5 text-base font-semibold">
              <Save className="h-5 w-5 mr-2" />
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;