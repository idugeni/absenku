'use client'; // Diperlukan jika menggunakan Next.js App Router

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

// Skema & Tipe
import { loginSchema, TLoginSchema } from '@/lib/validators/auth-schema';

// Hooks & Konteks
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

// Komponen UI & Ikon
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth(); // Asumsi fungsi login Anda menangani API call
  const [showPassword, setShowPassword] = useState(false);

  // 1. Inisialisasi React Hook Form
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    formState: { isSubmitting }, // Dapatkan status loading langsung dari form
  } = form;

  // 2. Fungsi onSubmit yang sudah tervalidasi
  const onSubmit = async (data: TLoginSchema) => {
    try {
      await login(data.email, data.password);
      toast({
        title: "Login Berhasil!",
        description: "Selamat datang kembali. Anda akan diarahkan ke dashboard.",
        variant: "success",
      });
      navigate('/'); // Redirect setelah berhasil
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.",
        variant: "destructive",
      });
    }
  };

  return (
    // 3. Integrasi dengan komponen Form dari shadcn/ui
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-10"
                    disabled={isSubmitting}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    disabled={isSubmitting}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full font-semibold" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </Form>
  );
}