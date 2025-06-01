import { DialogDescription, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types';

interface QRCodeGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData?: Event;
}

const QRCodeGenerator = ({ open, onOpenChange, eventData }: QRCodeGeneratorProps) => {
  const { toast } = useToast();
  if (!eventData) return null;

  const downloadQRCode = async () => {
    if (!eventData.qrCode) {
      toast({
        title: "Error",
        description: "QR Code tidak tersedia untuk diunduh.",
        variant: "destructive",
      });
      return;
    }

    
    const isSvgDataUrl = eventData.qrCode.startsWith('data:image/svg+xml;');

    try {
      if (isSvgDataUrl) {
        
        const img = new Image();
        img.onload = () => {
          const padding = 20;
          const scale = 3;

          const canvas = document.createElement('canvas');
          canvas.width = (img.width + 2 * padding) * scale;
          canvas.height = (img.height + 2 * padding) * scale;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.scale(scale, scale);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

            ctx.drawImage(img, padding, padding, img.width, img.height);

            const pngDataUrl = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = pngDataUrl;
            link.download = `QR_Code_${eventData.name.replace(/\s+/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
              title: "Berhasil",
              description: "QR Code berhasil diunduh sebagai PNG dengan padding dan resolusi tinggi.",
            });
          } else {
            throw new Error("Gagal mendapatkan konteks 2D dari canvas.");
          }
        };
        img.onerror = (error) => {

          toast({
            title: "Error",
            description: "Gagal mengkonversi SVG ke PNG.",
            variant: "destructive",
          });
        };
        img.src = eventData.qrCode;
      } else {
        
        const link = document.createElement('a');
        link.href = eventData.qrCode;
        link.download = `QR_Code_${eventData.name.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Berhasil",
          description: "QR Code berhasil diunduh.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengunduh QR Code.",
        variant: "destructive",
      });

    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{eventData.name}</DialogTitle>
          <DialogDescription className="sr-only">
            QR Code untuk kegiatan {eventData.name}. Scan untuk absensi.
          </DialogDescription>
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