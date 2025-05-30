import QRCode from 'qrcode';

interface PegawaiQRCodeData {
  id: string;
  nip: string;
  nama: string;
}

export const generatePegawaiQRCode = async (data: PegawaiQRCodeData): Promise<string | undefined> => {
  try {
    const qrValue = JSON.stringify(data);
    // Render the QR code component to a string (SVG)
    const svgString = await QRCode.toString(qrValue, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      width: 256,
      margin: 0
    });

    // Encode the SVG string to a data URL
    const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
    return dataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return undefined;
  }
};