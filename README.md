# Absenku

## Deskripsi Proyek

Absenku adalah aplikasi web untuk manajemen kehadiran yang efisien menggunakan pemindaian QR Code. Aplikasi ini dirancang untuk memudahkan pencatatan kehadiran karyawan atau peserta acara dengan cepat dan akurat.

## Fitur Utama

- **Login/Register Pengguna**: Sistem otentikasi pengguna untuk akses aman.
- **Manajemen Karyawan/Peserta**: Tambah, edit, dan hapus data karyawan atau peserta.
- **Pembuatan QR Code**: Otomatis membuat QR Code unik untuk setiap karyawan/peserta.
- **Pemindaian QR Code**: Fitur pemindaian QR Code untuk mencatat kehadiran.
- **Laporan Kehadiran**: Menghasilkan laporan kehadiran berdasarkan tanggal atau acara.
- **Manajemen Acara**: Membuat dan mengelola berbagai acara atau kegiatan.

## Teknologi yang Digunakan

Proyek ini dibangun dengan:

- **Frontend**:
  - [React](https://react.dev/) (dengan [Vite](https://vitejs.dev/) sebagai build tool)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) untuk styling
  - [Shadcn/ui](https://ui.shadcn.com/) sebagai komponen UI
- **Backend/Database**:
  - [Firebase Authentication](https://firebase.google.com/docs/auth) untuk otentikasi pengguna
  - [Cloud Firestore](https://firebase.google.com/docs/firestore) sebagai database NoSQL

## Instalasi dan Menjalankan Proyek (Lokal)

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

### Prasyarat

Pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/en/) (disarankan versi LTS)
- [npm](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)

### Langkah-langkah

1.  **Clone repositori:**

    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd absenku-smart-scan
    ```

2.  **Instal dependensi:**

    ```bash
    npm install
    ```

3.  **Konfigurasi Firebase:**

    Buat file `.env` di root proyek Anda dan tambahkan kredensial Firebase Anda. Anda bisa mendapatkan ini dari konsol Firebase proyek Anda.

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Jalankan aplikasi:**

    ```bash
    npm run dev
    ```

    Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

## Struktur Proyek

```
src/
├── components/         # Komponen UI yang dapat digunakan kembali
├── contexts/           # Konteks React untuk manajemen state global (misal: otentikasi)
├── hooks/              # Custom React Hooks
├── layouts/            # Tata letak halaman
├── lib/                # Utilitas dan konfigurasi (misal: Firebase)
├── pages/              # Halaman-halaman aplikasi (misal: Login, Dashboard)
├── types/              # Definisi tipe TypeScript
├── utils/              # Fungsi utilitas
└── App.tsx             # Komponen utama aplikasi dan routing
```

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan fork repositori dan buat pull request dengan perubahan Anda. Pastikan untuk mengikuti panduan gaya kode yang ada.

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.
