import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';

import { Event } from '@/types';

interface QRCodeGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData?: Event;
}

const QRCodeGenerator = ({ open, onOpenChange, eventData }: QRCodeGeneratorProps) => {
  if (!eventData) return null;

  const qrValue = JSON.stringify({
    id: eventData.id,
    name: eventData.name,
    location: eventData.location,
    startDate: eventData.startDate?.toISOString(),
    // Include the full event object if needed for attendance logic
    event: eventData, 
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Kegiatan: {eventData.name}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          {eventData.qrCode ? (
            <img src={eventData.qrCode} alt="QR Code" className="w-64 h-64" />
          ) : (
            <QRCodeSVG value={qrValue} size={256} level="H" />
          )}
        </div>
        <p className="text-center text-sm text-gray-500">Scan QR Code ini untuk absensi.</p>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;