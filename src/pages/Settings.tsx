
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import SystemSettings from '@/components/settings/SystemSettings';
import DataManagement from '@/components/settings/DataManagement';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Sistem</h1>
        <p className="text-gray-600">Kelola preferensi dan konfigurasi sistem AbsenKu</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Keamanan</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <SettingsIcon className="h-4 w-4" />
            <span>Sistem</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings loading={loading} setLoading={setLoading} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings loading={loading} setLoading={setLoading} />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="system">
          <SystemSettings loading={loading} setLoading={setLoading} />
        </TabsContent>
        <TabsContent value="data">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
