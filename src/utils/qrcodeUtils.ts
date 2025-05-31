import QRCode from 'qrcode';

interface PegawaiQRCodeData {
  id: string;
  nip: string;
  nama: string;
}

export const generatePegawaiQRCode = async (data: PegawaiQRCodeData): Promise<string> => {
  try {
    const qrValue = JSON.stringify(data);
    const svgString = await QRCode.toString(qrValue, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      width: 256,
      margin: 0
    });

    const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
    return dataUrl;
  } catch (error) {
    throw new Error(`Error generating QR code: ${(error as Error).message}`);
  }
};

interface EventQRCodeData {
  eventId: string;
  token: string;
}

export const generateEventQRCode = async (data: EventQRCodeData): Promise<string> => {
  try {
    const baseUrl = "https://quickchart.io/qr";
    const targetUrl = `${window.location.origin}/api/validate-qr?eventId=${data.eventId}&token=${data.token}`;
    const qrCodeUrl = `${baseUrl}?text=${encodeURIComponent(targetUrl)}&size=256&margin=0`;

    const response = await fetch(qrCodeUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch QR code from QuickChart: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Error generating event QR code: ${(error as Error).message}`);
  }
};