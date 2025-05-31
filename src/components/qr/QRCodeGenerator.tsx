import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { QRCodeSVG } from 'qrcode.react'; // No longer needed
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

import { Event } from '@/types';

interface QRCodeGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData?: Event;
}

const QRCodeGenerator = ({ open, onOpenChange, eventData }: QRCodeGeneratorProps) => {
  if (!eventData) return null;

  const downloadQRCode = async () => {
    const qrCodeElement = document.querySelector('.qrcode-image'); // Select the QR code image element
    if (qrCodeElement) {
      const canvas = await html2canvas(qrCodeElement as HTMLElement);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `QR_Code_${eventData.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Kegiatan: {eventData.name}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          {eventData.qrCode ? (
            <img src={eventData.qrCode} alt="QR Code" className="qrcode-image" style={{ width: 256, height: 256 }} />
          ) : (
            <p>QR Code tidak tersedia.</p>
          )}
        </div>
        <p className="text-center text-sm text-gray-500">Scan QR Code ini untuk absensi.</p>
        <DialogFooter>
          <Button onClick={downloadQRCode} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Unduh QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;