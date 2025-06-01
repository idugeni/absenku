import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AbsensiFormProps {
  nip: string;
  setNip: (nip: string) => void;
  isSubmitting: boolean;
  handleAbsensi: () => Promise<void>;
}

const AbsensiForm: React.FC<AbsensiFormProps> = ({
  nip,
  setNip,
  isSubmitting,
  handleAbsensi,
}) => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <label htmlFor="nip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Nomor Induk Pegawai (NIP)
      </label>
      <Input
        id="nip"
        type="text"
        placeholder="Masukkan NIP Anda di sini"
        value={nip}
        onChange={(e) => setNip(e.target.value)}
        className="mt-1 w-full dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        disabled={isSubmitting}
      />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Pastikan NIP sesuai dengan yang terdaftar.
      </p>
      <div className="mt-6">
        <Button
          type="submit"
          className="w-full"
          onClick={handleAbsensi}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Memproses Absensi...' : 'Absen Sekarang'}
        </Button>
      </div>
    </div>
  );
};

export default AbsensiForm;