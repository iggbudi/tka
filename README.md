# Cek Nilai TKA - Vercel Secure

Versi ini tidak menyimpan data siswa di JavaScript frontend. Data dibaca di server lewat environment variable `TKA_DATA_JSON`.

## Jalankan lokal

```bash
npm install
npm run extract:data
npm run dev
```

Buka `http://localhost:3000`.

## Deploy ke Vercel

1. Upload/push folder ini ke repository private.
2. Import project di Vercel.
3. Buat environment variable `TKA_DATA_JSON` berisi JSON data siswa.
   - Cara cepat: jalankan `npm run extract:data`, lalu copy isi `.env.local` ke Environment Variables Vercel.
4. Deploy.

## Catatan keamanan

- Jangan pakai file HTML lama karena data siswa terlihat di browser.
- Jangan commit `.env.local` atau data asli ke GitHub.
- NISN + tanggal lahir adalah autentikasi lemah. Untuk keamanan lebih tinggi, gunakan database dengan audit log/rate limit, atau login resmi per siswa.
