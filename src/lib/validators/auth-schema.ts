// src/lib/validators/auth-schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email tidak boleh kosong." })
    .email({ message: "Format email tidak valid." }),
  password: z.string()
    .min(1, { message: "Password tidak boleh kosong." })
    .min(8, { message: "Password minimal harus 8 karakter." }),
});

// Mengekstrak tipe TypeScript dari skema Zod
export type TLoginSchema = z.infer<typeof loginSchema>;