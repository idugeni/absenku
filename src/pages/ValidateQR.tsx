import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const ValidateQR: React.FC = () => {
  const { eventId, token } = useParams<{ eventId: string; token: string }>();
  const [nip, setNip] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (!eventId || !token) {
      setMessage('URL validasi tidak lengkap.');
    }
  }, [eventId, token]);

  const handleValidation = async () => {
    if (!nip) {
      toast({
        title: 'Input NIP',
        description: 'NIP tidak boleh kosong.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Simulate API call for validation
      // In a real application, this would be an actual API call to your backend
      // const response = await fetch(`/api/validate-qr`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ eventId, token, nip }),
      // });
      // const data = await response.json();

      // For demonstration purposes:
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

      if (nip === '12345' && eventId === 'testEvent' && token === 'testToken') {
        setMessage('Validasi berhasil! Kehadiran Anda telah dicatat.');
        toast({
          title: 'Sukses',
          description: 'Kehadiran berhasil dicatat.',
          variant: 'default',
        });
      } else {
        setMessage('Validasi gagal. NIP atau QR code tidak valid.');
        toast({
          title: 'Gagal',
          description: 'NIP atau QR code tidak valid.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error during validation:', error);
      setMessage('Terjadi kesalahan saat validasi.');
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat validasi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Validasi Kehadiran</CardTitle>
          <CardDescription className="text-center">
            Masukkan NIP Anda untuk memvalidasi kehadiran.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!eventId || !token ? (
            <p className="text-red-500 text-center">{message}</p>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  id="nip"
                  type="text"
                  placeholder="NIP Anda"
                  required
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" onClick={handleValidation} disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memvalidasi...</>
                ) : (
                  'Validasi'
                )}
              </Button>
              {message && (
                <p className={`text-center ${message.includes('berhasil') ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidateQR;