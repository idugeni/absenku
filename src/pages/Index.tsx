
import QuickActions from '@/components/dashboard/QuickActions';
import EventList from '@/components/events/EventList';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen">
      <main className="flex-1 p-4 md:p-8">
        {/* Welcome Section */}
        <Card className="mb-8 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">
          AbsenKu adalah solusi digital inovatif yang didedikasikan untuk mengelola dan memonitor daftar hadir secara komprehensif. Dengan fitur pencatatan akurat, rekapitulasi otomatis, dan pelaporan intuitif, AbsenKu bertujuan meningkatkan efektivitas administratif dan mendukung pengambilan keputusan berbasis data dalam organisasi.
          </p>
        </Card>

        {/* Statistics Cards */}
        <div className="mb-8">

        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* Events and Quick Actions */}
          <div className="space-y-8">
            <EventList />
            <QuickActions />
          </div>


        </div>

      </main>
    </div>
  );
};

export default Index;
