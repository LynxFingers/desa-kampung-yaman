-- =========================================================
-- Migration 0007: hardening bucket storage "uploads".
-- Sebelumnya validasi tipe & ukuran file hanya dilakukan di
-- browser (bisa dilewati). Migration ini menambahkan batasan
-- di level Supabase Storage sendiri, sehingga server MENOLAK
-- upload apa pun yang bukan gambar atau lebih besar dari 5MB,
-- terlepas dari apa yang dikirim klien.
-- Jalankan SETELAH 0006_login_rate_limit.sql.
-- =========================================================

update storage.buckets
set
  file_size_limit = 5242880, -- 5MB, samakan dengan MAX_SIZE_BYTES di image-upload-field.tsx
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'uploads';
