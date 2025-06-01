import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Key, LogOut, Laptop, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'; // Import additional icons
import { useState } from 'react'; // Import useState for password visibility

const SecuritySettings = () => {
  const { logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State for password inputs (add these to enable actual input handling)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Placeholder for password strength logic (you'll need to implement this)
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { label: 'Kosong', color: 'text-gray-400' };
    if (password.length < 6) return { label: 'Sangat Lemah', color: 'text-red-500' };
    if (password.length < 10) return { label: 'Lemah', color: 'text-orange-500' };
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { label: 'Sangat Kuat', color: 'text-green-600' };
    }
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { label: 'Cukup Kuat', color: 'text-blue-500' };
    return { label: 'Sedang', color: 'text-yellow-500' };
  };

  const newPasswordStrength = getPasswordStrength(newPassword);

  const handleChangePassword = () => {
    // Implement your password change logic here

    // Add toast notifications for success/failure
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="shadow-lg border-2 border-gray-100 dark:border-gray-800">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800 dark:text-gray-100">
            <Lock className="h-7 w-7 mr-3 text-red-600 dark:text-red-400" /> {/* Icon added */}
            Keamanan & Akses
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola kredensial login dan sesi perangkat Anda.</p> {/* Sub-description */}
        </CardHeader>
        <CardContent className="space-y-8 p-6"> {/* Increased vertical spacing and padding */}
          
          {/* Ubah Password Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 flex items-center">
              <Key className="h-5 w-5 mr-2 text-yellow-600" /> Ubah Password
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pastikan password Anda kuat dan unik untuk keamanan akun.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Password Saat Ini</Label>
                <div className="relative">
                  <Input 
                    id="current-password" 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password Anda saat ini"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-0 top-0 h-full px-3 py-2" 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <div className="relative">
                  <Input 
                    id="new-password" 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru Anda"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-0 top-0 h-full px-3 py-2" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {newPassword.length > 0 && (
                  <p className={`text-sm ${newPasswordStrength.color}`}>
                    Kekuatan Password: <span className="font-semibold">{newPasswordStrength.label}</span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi password baru Anda"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-0 top-0 h-full px-3 py-2" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                  <p className="text-sm text-red-500">Password tidak cocok.</p>
                )}
              </div>
              <Button onClick={handleChangePassword} className="w-full md:w-auto mt-4 px-6 py-2.5 text-base font-semibold">
                Ubah Password
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Sesi Login Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 flex items-center">
              <Laptop className="h-5 w-5 mr-2 text-blue-600" /> Sesi Login
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kelola perangkat tempat Anda sedang login.</p>
            
            {/* Current Session */}
            <div className="p-4 border rounded-lg flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/20"> {/* Highlight current session */}
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-green-500" /> {/* Active indicator icon */}
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">Sesi Saat Ini (Perangkat Anda)</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chrome di Windows • Aktif sekarang • Salatiga</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>
            </div>

            {/* Example of Other Sessions (you'd fetch these from backend) */}
            <div className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-3 text-orange-500" /> {/* Inactive/other session indicator */}
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">Sesi Lain</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Firefox di Android • Aktif 3 hari yang lalu • Yogyakarta</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Logout</Button>
            </div>

            <div className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-3 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">Sesi Lain</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Safari di iOS • Aktif 1 minggu yang lalu • Jakarta</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Logout</Button>
            </div>
          </div>
          
          <div className="flex justify-end w-full pt-4"> {/* Align button to the right */}
            <Button variant="destructive" onClick={logout} className="w-full md:w-auto px-6 py-2.5 text-base font-semibold">
              <LogOut className="h-5 w-5 mr-2" />
              Logout dari Semua Perangkat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;