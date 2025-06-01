import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventNotFoundState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Kegiatan Tidak Ditemukan</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Maaf, kegiatan yang Anda cari tidak ditemukan.</p>
          <Button onClick={() => navigate('/events')} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Kegiatan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventNotFoundState;