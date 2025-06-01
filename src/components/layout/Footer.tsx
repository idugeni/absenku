import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 p-6 mt-12 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Bagian Hak Cipta - Tetap di kiri pada layar besar, atas pada layar kecil */}
        <div className="text-center md:text-left">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} <strong className="font-semibold">AbsenKu</strong>. Hak Cipta Dilindungi Undang-Undang.
          </p>
          {/* Baris "Dibuat oleh Eliyanto Sarage" kini akan berada di dalam div yang terpisah di kanan */}
        </div>

        {/* Bagian Informasi Kredit - Dipindahkan ke kanan pada layar besar, bawah pada layar kecil */}
        <div className="text-center md:text-right">
          <p className="text-xs opacity-80">Dibuat dengan ❤️ oleh Eliyanto Sarage</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;