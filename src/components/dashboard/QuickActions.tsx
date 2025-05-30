
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Calendar, FileText, Settings, Users, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PegawaiDialog from '@/components/employees/PegawaiDialog';
import EventDialog from '@/components/events/EventDialog';
import PegawaiList from '@/components/employees/PegawaiList';
import EventList from '@/components/events/EventList';

const QuickActions = () => {
  const navigate = useNavigate();
  const [pegawaiDialogOpen, setPegawaiDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [pegawaiListOpen, setPegawaiListOpen] = useState(false);
  const [eventListOpen, setEventListOpen] = useState(false);

  const actions = [
    {
      title: 'Tambah Pegawai',
      description: 'Daftarkan pegawai baru ke sistem',
      icon: UserPlus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => setPegawaiDialogOpen(true)
    },
    {
      title: 'Kelola Pegawai',
      description: 'Lihat dan kelola data pegawai',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => setPegawaiListOpen(true)
    },
    {
      title: 'Buat Kegiatan',
      description: 'Buat acara atau kegiatan baru',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => setEventDialogOpen(true)
    },
    {
      title: 'Kelola Kegiatan',
      description: 'Lihat dan kelola semua kegiatan',
      icon: CalendarDays,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: () => setEventListOpen(true)
    },
    {
      title: 'Laporan',
      description: 'Lihat laporan kehadiran',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      onClick: () => navigate('/reports')
    },
    {
      title: 'Pengaturan',
      description: 'Konfigurasi sistem',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Aksi Cepat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {actions.map((action, index) => (
              <Card
                key={index}
                className="h-auto p-6 flex flex-col items-start text-left hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                onClick={action.onClick}
              >
                <CardContent className="p-0">
                  <div className={`p-3 rounded-xl ${action.bgColor} mb-4`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                </CardContent>
                <CardFooter className="p-0 flex flex-col items-start space-y-1">
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-wrap">{action.description}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <PegawaiDialog 
        open={pegawaiDialogOpen} 
        onOpenChange={setPegawaiDialogOpen} 
      />
      
      <EventDialog 
        open={eventDialogOpen} 
        onOpenChange={setEventDialogOpen} 
      />
      
      <PegawaiList 
        open={pegawaiListOpen} 
        onOpenChange={setPegawaiListOpen} 
      />
      
      <EventList 
        open={eventListOpen} 
        onOpenChange={setEventListOpen} 
      />
    </>
  );
};

export default QuickActions;
