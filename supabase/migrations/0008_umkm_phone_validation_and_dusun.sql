-- =========================================================
-- Migration 0008: validasi nomor HP UMKM & pengelompokan
-- UMKM berdasarkan Dusun (1-5).
-- Jalankan SETELAH 0007_storage_upload_hardening.sql.
-- =========================================================

-- ---------------------------------------------------------
-- Dusun UMKM: setiap UMKM dapat dikelompokkan ke salah satu
-- dari 5 dusun. Kolom dibuat nullable agar data UMKM lama
-- yang belum memiliki dusun tidak rusak/gagal migrasi -
-- cukup tampil sebagai "Belum diatur" sampai diedit ulang
-- oleh admin.
-- ---------------------------------------------------------
alter table umkm
  add column if not exists dusun smallint;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'umkm_dusun_check'
  ) then
    alter table umkm
      add constraint umkm_dusun_check check (dusun is null or dusun between 1 and 5);
  end if;
end $$;

create index if not exists idx_umkm_dusun on umkm(dusun);

-- ---------------------------------------------------------
-- Validasi nomor HP/WhatsApp UMKM: hanya boleh berisi angka
-- (9-15 digit), atau tanda "-" jika pemilik UMKM tidak
-- memiliki nomor HP. Constraint ditambahkan sebagai NOT VALID
-- sehingga HANYA berlaku untuk data yang baru
-- ditambahkan/diubah setelah migrasi ini - baris lama yang
-- sudah tersimpan (mis. berformat "+62 812-3456-7890") TIDAK
-- akan divalidasi ulang dan tetap aman.
-- ---------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'umkm_whatsapp_format_check'
  ) then
    alter table umkm
      add constraint umkm_whatsapp_format_check
      check (whatsapp = '-' or whatsapp ~ '^[0-9]{9,15}$')
      not valid;
  end if;
end $$;

comment on column umkm.whatsapp is 'Nomor HP/WhatsApp UMKM: angka saja (9-15 digit) atau "-" jika tidak tersedia.';
comment on column umkm.dusun is 'Nomor dusun (1-5) tempat UMKM berada. Boleh kosong untuk data lama yang belum dikelompokkan.';
