import { useAbsensi } from '@/hooks/useAbsensi';
import { Card } from '@/components/ui/card';
import AbsensiForm from '@/components/absensi/AbsensiForm';
import EventDetailsCard from '@/components/absensi/EventDetailsCard';

const Absensi: React.FC = () => {
  const { nip, setNip, eventData, isLoading, isSubmitting, handleAbsensi } = useAbsensi();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Memuat detail event, mohon tunggu...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="container mx-auto p-4 flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold text-destructive mb-4">Gagal Memuat Event</h2>
        <p className="text-gray-600 mb-6">
          Detail event tidak dapat ditampilkan. Pastikan ID event sudah benar atau coba lagi nanti.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-lg mx-auto shadow-lg py-0">
        <EventDetailsCard eventData={eventData} />
        <AbsensiForm
          nip={nip}
          setNip={setNip}
          isSubmitting={isSubmitting}
          handleAbsensi={handleAbsensi}
        />
      </Card>
    </div>
  );
};

export default Absensi;