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