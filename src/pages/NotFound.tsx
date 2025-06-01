import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home, Info } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';

const NotFound = () => {
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {

    
    toast({
      title: "Halaman Tidak Ditemukan",
      description: "Maaf, halaman yang Anda cari tidak ada.",
      variant: "destructive",
      
      
    });
  }, [location.pathname, toast]);

  return (
    
    
    <div className="h-screen max-w-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-800 dark:to-gray-900 overflow-hidden relative">
      <div className="relative z-10 bg-white dark:bg-slate-800/50 backdrop-blur-lg shadow-2xl rounded-xl p-8 md:p-12 lg:p-16 max-w-2xl w-11/12 text-center transform transition-all duration-500 ease-in-out border border-gray-200 dark:border-gray-700">
        <div className="mb-6 text-indigo-500 dark:text-indigo-400">
          <AlertTriangle size={72} className="mx-auto" /> {/* Ukuran ikon lebih besar, animasi lebih lembut */}
        </div>

        <h1 className="text-7xl md:text-8xl font-extrabold text-indigo-600 dark:text-indigo-500 mb-2 tracking-tight drop-shadow-md">
          404
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Halaman Tidak Ditemukan
        </p>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm md:text-base leading-relaxed">
          Maaf, halaman yang Anda cari di{" "}
          <code className="bg-slate-200 dark:bg-slate-700 p-1 rounded-md text-indigo-600 dark:text-indigo-400 break-all text-xs md:text-sm font-mono">
            {location.pathname}
          </code>{" "}
          tidak dapat kami temukan. Mungkin tautan tersebut rusak atau halaman telah dipindahkan.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all duration-200 ease-in-out group shadow-lg"
          aria-label="Kembali ke Beranda"
        >
          <Home size={22} className="mr-2 -ml-1" />
          Kembali ke Beranda
        </Link>
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center z-0"> {/* Footer di posisi absolut */}
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center">
          <Info size={16} className="mr-2 text-slate-500" />
          Jika Anda yakin ini adalah kesalahan, silakan hubungi administrator.
        </p>
      </footer>
    </div>
  );
};

export default NotFound;