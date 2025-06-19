import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  return (
    // PERUBAHAN 1: Latar belakang utama menggunakan variabel semantik
    // Gradasi dibuat dari --background ke warna --muted yang lebih gelap.
    // Ini memastikan gradasi beradaptasi dengan tema.
    <div className="min-h-screen w-full 
                   bg-background 
                   bg-gradient-to-br from-background to-muted/20 
                   flex items-center justify-center p-4">

      {/* PERUBAHAN 2: Kartu form menggunakan variabel semantik dengan transparansi */}
      <Card className="w-full max-w-md
                     bg-card/70           
                     backdrop-blur-lg   
                     border-border      
                     shadow-2xl">
        {/*
          Penjelasan Perubahan pada Kartu:
          - bg-card/70: Menggunakan warna latar kartu dari tema (--card) dengan opasitas 70%.
          - backdrop-blur-lg: Tetap untuk efek kaca yang modern.
          - border-border: Menggunakan warna border dari tema (--border), tidak lagi hardcoded.
        */}
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          {/* PERUBAHAN 3: Teks menggunakan variabel warna semantik */}
          <CardTitle className="text-2xl font-bold text-card-foreground">
            Absen<span className="text-primary">Ku</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Silakan masuk untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;