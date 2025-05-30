import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react"; // Menambahkan ikon untuk visual
import { useToast } from '@/components/ui/use-toast';

const NotFound = () => {
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Logging tetap penting untuk development atau monitoring
    console.error(
      `404 Error: Pengguna mencoba mengakses rute yang tidak ada: ${location.pathname}`
    );
    toast({
      title: "Error",
      description: "Page not found.",
      variant: "destructive",
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-800 dark:to-gray-900 p-4 selection:bg-indigo-500 selection:text-white">
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md shadow-2xl rounded-xl p-8 md:p-12 lg:p-16 max-w-lg w-full text-center transform transition-all duration-500 ease-in-out hover:scale-102">
        <div className="mb-6 text-indigo-500 dark:text-indigo-400">
          <AlertTriangle size={64} className="mx-auto animate-pulse" />
        </div>

        <h1 className="text-8xl md:text-9xl font-extrabold text-indigo-600 dark:text-indigo-500 mb-2 tracking-tighter">
          404
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Halaman Tidak Ditemukan
        </p>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm md:text-base">
          Maaf, halaman yang Anda cari di{" "}
          <code className="bg-slate-200 dark:bg-slate-700 p-1 rounded-md text-indigo-600 dark:text-indigo-400 break-all">
            {location.pathname}
          </code>{" "}
          tidak dapat kami temukan. Mungkin tautan tersebut rusak atau halaman telah dipindahkan.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-transform transform hover:scale-105 duration-150 ease-in-out group"
          aria-label="Kembali ke Beranda"
        >
          <Home size={20} className="mr-2 -ml-1 transition-transform duration-300 group-hover:rotate-[360deg]" />
          Kembali ke Beranda
        </Link>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Jika Anda yakin ini adalah kesalahan, silakan hubungi administrator.
        </p>
      </footer>
    </div>
  );
};

export default NotFound;