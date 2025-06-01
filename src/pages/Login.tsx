import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Gagal Validasi",
        description: "Mohon pastikan email dan password telah terisi.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login Berhasil!",
        description: "Selamat datang kembali! Anda telah berhasil masuk ke sistem AbsenKu. Silakan mulai menggunakan layanan kami.",
        variant: "success",
      });
      navigate('/');
    } catch (error: unknown) {
      toast({
        title: "Login Failed",
        description: (error as Error).message || "An unknown error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary/30 selection:text-primary">
      <div className="w-full max-w-md space-y-8">
        <Card className="bg-card border border-input shadow-2xl rounded-xl">
          <CardHeader className="text-center p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4"> {/* Lingkaran dengan primary transparan */}
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold text-card-foreground">
            <h2>Absen<span className="text-primary">Ku</span></h2>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm pt-1">
            Sistem Manajemen Kehadiran Terpadu
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 relative">
                <Label htmlFor="email" className="text-card-foreground font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    
                    className="pl-10 bg-input-bg border-input-border text-card-foreground placeholder:text-input-placeholder focus:border-input-focus-border focus:ring-1 focus:ring-ring transition-all duration-300 rounded-md" 
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-card-foreground font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-input-bg border-input-border text-card-foreground placeholder:text-input-placeholder focus:border-input-focus-border focus:ring-1 focus:ring-ring transition-all duration-300 rounded-md"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 text-base rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-ring/50
                           disabled:bg-muted disabled:text-muted-foreground disabled:border-slate-600 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </div>
                ) : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;