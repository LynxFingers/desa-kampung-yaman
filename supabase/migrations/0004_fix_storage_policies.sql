-- =========================================================
-- Migration 0004: perbaikan bucket & kebijakan RLS Storage
-- untuk mengatasi error "new row violates row-level security
-- policy" saat mengunggah gambar.
--
-- Aman dijalankan berulang kali (idempotent) — jalankan file
-- ini kapan saja di SQL Editor Supabase jika upload gambar
-- gagal dengan pesan error tersebut.
-- =========================================================

-- Pastikan bucket "uploads" ada dan bersifat publik.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

-- Pastikan RLS aktif pada storage.objects.
alter table storage.objects enable row level security;

-- Hapus kebijakan lama (jika ada) agar tidak bentrok, lalu buat ulang dari nol.
drop policy if exists "public read uploads bucket" on storage.objects;
drop policy if exists "authenticated upload to uploads bucket" on storage.objects;
drop policy if exists "authenticated update uploads bucket" on storage.objects;
drop policy if exists "authenticated delete uploads bucket" on storage.objects;

create policy "public read uploads bucket" on storage.objects
  for select using (bucket_id = 'uploads');

create policy "authenticated upload to uploads bucket" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'uploads');

create policy "authenticated update uploads bucket" on storage.objects
  for update to authenticated
  using (bucket_id = 'uploads');

create policy "authenticated delete uploads bucket" on storage.objects
  for delete to authenticated
  using (bucket_id = 'uploads');
