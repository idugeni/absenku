import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const SecuritySettings = () => {
  const { logout } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keamanan & Akses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Password Saat Ini</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Password Baru</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h4 className="font-medium">Sesi Login</h4>
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Sesi Saat Ini</p>
                <p className="text-sm text-gray-600">Chrome di Windows • Aktif sekarang</p>
              </div>
              <Badge variant="outline">Aktif</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={logout}>
            Logout dari Semua Perangkat
          </Button>
          <Button>
            Ubah Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;