
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
        <TabsList className="flex w-full justify-around md:grid md:grid-cols-5">
          <TabsTrigger value="profile" className="flex-grow flex items-center space-x-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary w-full">
            <User className="h-4 w-4" />
            <span className="hidden md:block">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-grow flex items-center space-x-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary w-full">
            <Bell className="h-4 w-4" />
            <span className="hidden md:block">Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-grow flex items-center space-x-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary w-full">
            <Shield className="h-4 w-4" />
            <span className="hidden md:block">Keamanan</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex-grow flex items-center space-x-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary w-full">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden md:block">Sistem</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex-grow flex items-center space-x-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary w-full">
            <Database className="h-4 w-4" />
            <span className="hidden md:block">Data</span>
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
