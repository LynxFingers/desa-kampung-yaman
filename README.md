# Sistem Informasi Desa Kampung Yaman

Website resmi desa (Next.js App Router + TypeScript + Tailwind CSS + Supabase) sesuai dokumen SRS/SDD **Sistem Informasi Desa Kampung Yaman**. Terdiri dari **Website Publik** (Beranda, Profil Desa, Pemerintahan, Berita, UMKM, Galeri, Kontak) dan **Dashboard Admin** (Pengaturan, Profil Desa, Pemerintahan, Statistik, Berita, UMKM + Kategori, Galeri, Manajemen Admin).

## Teknologi

- Next.js (App Router, Server Components, Server Actions)
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL, Auth, Storage)
- Zod (validasi), lucide-react (ikon), recharts (grafik)

## 1. Menyiapkan Proyek Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan **berurutan**: `0001_init.sql` → `0002_updates.sql` → `0003_umkm_product_details.sql` → `0004_fix_storage_policies.sql` → `0005_umkm_product_stock.sql` → `0006_login_rate_limit.sql` → `0007_storage_upload_hardening.sql` → `0008_umkm_phone_validation_and_dusun.sql`. File pertama membuat seluruh tabel inti, index, kebijakan RLS, data awal, dan bucket Storage publik `uploads`. File kedua menambahkan nomor HP perangkat desa, foto profil desa, dan tabel foto produk UMKM. File ketiga melengkapi tabel produk UMKM dengan nama, harga, rasa/varian, dan tipe. File keempat memastikan bucket dan kebijakan Storage benar-benar aktif (aman dijalankan ulang kapan saja jika upload gambar gagal). File kelima menambahkan stok produk UMKM. File keenam menambahkan rate limit percobaan login. File ketujuh mengunci batasan tipe & ukuran file upload di level Storage. File kedelapan menambahkan validasi format nomor HP UMKM dan kolom pengelompokan UMKM per Dusun (1-5).
3. Buat admin pertama:
   - Buka **Authentication > Users > Add user**, buat user dengan email & password.
   - Buka **Table Editor > admins**, tambahkan baris baru dengan `email` yang **sama persis**, `name`, dan `role = 'super_admin'`.
5. Salin `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` dari **Project Settings > API**.

## 2. Konfigurasi Environment

```bash
cp .env.example .env.local
```

Isi `.env.local` dengan kredensial dari langkah di atas.

## 3. Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` untuk website publik, dan `http://localhost:3000/login` untuk masuk ke dashboard admin.

## 4. Build Produksi

```bash
npm run build
npm start
```

## 5. Deploy

Proyek ini siap di-deploy ke **Vercel**:

1. Push repository ini ke GitHub.
2. Import ke Vercel, isi environment variable yang sama seperti `.env.local`.
3. Deploy — setiap push ke branch `main` akan otomatis membangun ulang (continuous deployment).

## Troubleshooting

**Error saat mengunggah gambar: "new row violates row-level security policy"**

Ini berarti bucket Storage `uploads` atau kebijakan aksesnya belum benar-benar aktif di project Supabase Anda. Cara memperbaiki:

1. Buka **SQL Editor** di Supabase, jalankan ulang `supabase/migrations/0004_fix_storage_policies.sql`. File ini aman dijalankan berkali-kali dan akan mereset bucket + kebijakan dari awal.
2. Periksa juga secara manual di **Storage** pada dashboard Supabase: pastikan bucket bernama `uploads` ada dan statusnya **Public**.
3. Buka **Storage > Policies**, pastikan ada 4 kebijakan untuk bucket `uploads` (read publik, insert/update/delete untuk peran `authenticated`).
4. Pastikan Anda benar-benar sedang login sebagai admin saat mencoba upload (coba logout lalu login ulang di `/login`) — sesi yang kedaluwarsa juga bisa menyebabkan error ini karena permintaan dianggap sebagai pengunjung anonim, bukan admin yang terautentikasi.

## Struktur Folder

```
app/
  (public)/          # Halaman publik: beranda, profil-desa, pemerintahan, berita, umkm, galeri, kontak
  (dashboard)/       # Dashboard admin (dilindungi middleware)
  login/             # Halaman login admin
lib/
  supabase/          # Client Supabase (server & browser)
  data/              # Query data per modul
  actions/           # Server Actions (create/update/delete) per modul
  validations/       # Skema validasi Zod
components/
  ui/                # Komponen dasar (Button, Card, Input, dll.)
  public/            # Komponen khusus halaman publik
  dashboard/         # Komponen khusus dashboard admin
supabase/migrations/ # Skema database SQL
types/               # Definisi TypeScript untuk seluruh tabel
```

## Catatan Implementasi

- **Upload gambar**: setiap field foto (logo, hero image, thumbnail berita, foto UMKM, foto perangkat desa, foto galeri, foto profil desa, foto produk UMKM) mendukung dua cara pengisian — **unggah langsung dari perangkat** (otomatis tersimpan ke bucket Storage `uploads` dan menghasilkan URL publik), atau **tempel URL gambar publik** secara manual (harus berupa tautan file gambar langsung berakhiran `.jpg/.png/.webp`, bukan tautan halaman web/Google Images).
- **Nomor HP perangkat desa**: diisi pada form Pemerintahan Desa, ditampilkan pada halaman publik Pemerintahan Desa — **tidak** ditampilkan pada preview kartu perangkat desa di Beranda (sesuai permintaan).
- **Foto profil desa**: field foto pada modul Profil Desa dashboard, tampil sebagai foto sampul (cover) di bagian atas halaman publik Profil Desa.
- **Kategori UMKM** sekarang dapat ditambah, **diubah (edit inline)**, dan dihapus dari halaman `/dashboard/umkm/kategori`.
- **Foto produk UMKM**: setiap UMKM dapat memiliki beberapa produk opsional — foto, nama produk, harga, rasa/varian, dan tipe/kemasan — dikelola dari tombol "Kelola Foto Produk"/"Produk UMKM" pada halaman Ubah UMKM atau tabel daftar UMKM dashboard. Ditampilkan sebagai galeri produk lengkap pada halaman detail UMKM publik jika tersedia.
- **Kartu UMKM** (di halaman daftar UMKM dan preview Beranda) menampilkan foto, kategori, nama usaha, pemilik, nomor WhatsApp, dan tombol "Lihat Detail" menuju halaman detail lengkap.
- **Nomor HP/WhatsApp UMKM**: hanya boleh diisi angka (9-15 digit), atau tanda `-` jika pemilik UMKM belum memiliki nomor HP. Validasi dilakukan di form (pola input browser) dan di server (Zod) pada `lib/validations/schemas.ts`; di level database, `supabase/migrations/0008_umkm_phone_validation_and_dusun.sql` menambahkan constraint format sebagai `NOT VALID` sehingga hanya berlaku untuk data baru/yang diubah - data lama yang formatnya berbeda tetap aman. Jika nomor HP berupa `-`, tombol "Hubungi via WhatsApp" pada halaman publik otomatis disembunyikan.
- **Pengelompokan UMKM per Dusun**: setiap UMKM dikelompokkan ke salah satu dari 5 dusun (Dusun 1-5), diisi lewat dropdown "Dusun" pada form Tambah/Ubah UMKM. Direktori UMKM publik (`/umkm`) dan tabel UMKM dashboard menyediakan filter per dusun beserta jumlahnya; UMKM lama yang belum memiliki dusun ditandai "Belum diatur" dan tetap tampil di "Semua Dusun" tanpa terhapus.
- **Peran admin**: `operator` dapat mengelola seluruh konten kecuali data admin; `super_admin` dapat mengelola admin lain (tambah/hapus), sesuai matriks hak akses pada dokumen SRS BAB II.
- **Slug berita** dibuat otomatis dari judul menggunakan `slugify`.
- **UMKM** menggunakan URL `/umkm/[id]` (bukan slug) mengikuti struktur tabel `umkm` pada BAB V dokumen SRS/SDD.
- Halaman publik memanfaatkan Server Component + `revalidatePath` sehingga perubahan admin langsung tampil tanpa perlu rebuild.
