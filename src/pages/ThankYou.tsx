import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [eventName, setEventName] = useState<string>('');
  const [pegawaiName, setPegawaiName] = useState<string>('');

  useEffect(() => {
    const name = searchParams.get('eventName');
    const pName = searchParams.get('pegawaiName');

    if (name) {
      setEventName(name.replace(/-/g, ' '));
    } else {
      navigate('/');
    }

    if (pName) {
      setPegawaiName(pName.replace(/-/g, ' '));
    }
  }, [searchParams, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md text-center shadow-lg py-0">
        <CardHeader className="bg-green-50 dark:bg-green-900 rounded-t-lg py-6">
          <CheckCircle className="h-20 w-20 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-200">
            Terima Kasih!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Absensi atas nama <span className="font-semibold text-green-700 dark:text-green-300">{pegawaiName}</span> untuk kegiatan <span className="font-semibold text-green-700 dark:text-green-300">{eventName}</span> telah diverifikasi.
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400">
            Terima kasih atas kehadiran Anda.
          </p>

        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;