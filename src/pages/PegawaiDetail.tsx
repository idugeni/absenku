
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, QrCode, Edit, Calendar, MapPin, Clock, Download } from 'lucide-react';
import { useAppFirestore } from '@/hooks/useAppFirestore';
import { useToast } from '@/hooks/use-toast';


const PegawaiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pegawai, attendance, events } = useAppFirestore();
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const currentPegawai = pegawai.find(p => p.id === id);
  const pegawaiAttendance = attendance.filter(a => a.pegawaiId === id);

  const generateQRCode = useCallback(async () => {
    if (!currentPegawai) return;
    
    setIsGeneratingQR(true);
    try {
      const qrData = {
        pegawaiId: currentPegawai.id,
        nip: currentPegawai.nip,
        nama: currentPegawai.nama,
        timestamp: Date.now()
      };
      
      const qrString = JSON.stringify(qrData);
      const encodedData = encodeURIComponent(qrString);
      const qrUrl = `https://quickchart.io/qr?text=${encodedData}&size=300&format=png`;
      
      setQrCodeUrl(qrUrl);
      
      toast({
        title: "QR Code Generated",
        description: "QR Code pegawai berhasil dibuat"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat QR Code",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingQR(false);
    }
  }, [currentPegawai, toast]);

  useEffect(() => {
    if (currentPegawai && !qrCodeUrl) {
      generateQRCode();
    }
  }, [currentPegawai, generateQRCode, qrCodeUrl]);

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${currentPegawai?.nama}_${currentPegawai?.nip}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "QR Code berhasil diunduh"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengunduh QR Code",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>;
      case 'pensiun':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Non-aktif</Badge>;
      case 'cuti':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Cuti</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Hadir</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Terlambat</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Tidak Hadir</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadgeVariant = (status: 'aktif' | 'pensiun' | 'cuti') => {
    switch (status) {
      case 'aktif':
        return 'default';
      case 'pensiun':
        return 'destructive';
      case 'cuti':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (!currentPegawai) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pegawai tidak ditemukan</h1>
          <Button onClick={() => navigate('/pegawai')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke daftar pegawai
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Button onClick={() => navigate('/pegawai')} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke daftar pegawai
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Detail Pegawai</h1>
              <p className="text-gray-600">Informasi lengkap pegawai dan riwayat kehadiran</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {currentPegawai.nama.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{currentPegawai.nama}</CardTitle>
                <p className="text-gray-600">{currentPegawai.jabatan}</p>
                {getStatusBadge(currentPegawai.status)}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">NIP</label>
                    <p className="text-sm">{currentPegawai.nip}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm">{currentPegawai.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tanggal Bergabung</label>
                    <p className="text-sm">{currentPegawai.tanggalBergabung.toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card className="mt-6 w-full max-w-md mx-auto shadow-lg rounded-xl">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl flex items-center font-semibold text-gray-700">
      <QrCode className="h-6 w-6 mr-3 text-indigo-600" />
      QR Code Pegawai
    </CardTitle>
  </CardHeader>
  <CardContent className="text-center space-y-6 p-6">
    {qrCodeUrl ? (
      <>
        <div className="p-3 bg-white border border-gray-200 rounded-lg inline-block shadow-md transition-all duration-300 ease-in-out hover:shadow-xl">
          <img src={qrCodeUrl} alt="QR Code Pegawai" className="w-56 h-56 md:w-64 md:h-64 object-contain" />
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <Button onClick={downloadQRCode} className="w-full py-2.5 text-base">
            <Download className="h-5 w-5 mr-2" />
            Download
          </Button>
          <Button onClick={generateQRCode} variant="outline" className="w-full py-2.5 text-base">
            <QrCode className="h-5 w-5 mr-2" />
            Regenerate
          </Button>
        </div>
      </>
    ) : (
      <div className="space-y-6">
        <div className="w-56 h-56 md:w-64 md:h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mx-auto p-4">
          {isGeneratingQR ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 font-medium">Sedang membuat QR Code...</p>
            </div>
          ) : (
            <>
              <QrCode className="h-20 w-20 text-gray-400 mb-3" />
              <p className="text-sm text-gray-500">QR Code belum tersedia.</p>
              <p className="text-xs text-gray-400 mt-1">Klik tombol di bawah untuk membuat.</p>
            </>
          )}
        </div>
        <Button
          onClick={generateQRCode}
          disabled={isGeneratingQR}
          className="w-full max-w-xs mx-auto py-3 text-base font-medium"
        >
          <QrCode className="h-5 w-5 mr-2" />
          {isGeneratingQR ? "Memproses..." : "Generate QR Code"}
        </Button>
      </div>
    )}
  </CardContent>
</Card>
          </div>

          {/* Attendance History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Riwayat Kehadiran</CardTitle>
              </CardHeader>
              <CardContent>
                {pegawaiAttendance.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-400">Belum ada riwayat kehadiran</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pegawaiAttendance.map((record) => {
                      const event = events.find(e => e.id === record.eventId);
                      return (
                        <div key={record.id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{event?.name || 'Unknown Event'}</h4>
                              <p className="text-sm text-gray-600">{event?.location || 'Unknown Location'}</p>
                            </div>
                            {getAttendanceStatusBadge(record.status)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {record.checkInTime.toLocaleDateString('id-ID')}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {record.checkInTime.toLocaleTimeString('id-ID')}
                            </div>
                            {record.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {record.location}
                              </div>
                            )}
                          </div>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

    </div>
  );
};

export default PegawaiDetail;
