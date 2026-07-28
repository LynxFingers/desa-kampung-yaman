-- =========================================================
-- Migration 0003: detail produk UMKM (nama, harga, rasa/varian,
-- tipe) agar satu UMKM dapat menampilkan beberapa produk
-- lengkap dengan foto yang berbeda-beda.
-- Jalankan file ini SETELAH 0002_updates.sql.
-- =========================================================

alter table umkm_products
  add column if not exists name varchar(150),
  add column if not exists price numeric(12, 2),
  add column if not exists variant varchar(100),
  add column if not exists type varchar(100);

comment on column umkm_products.name is 'Nama produk, contoh: Keripik Singkong';
comment on column umkm_products.price is 'Harga produk dalam Rupiah';
comment on column umkm_products.variant is 'Rasa/varian produk, contoh: Original, Pedas, Balado';
comment on column umkm_products.type is 'Tipe/kategori produk, contoh: Kemasan 250gr, Kemasan 500gr';
comment on column umkm_products.caption is 'Catatan tambahan (opsional), dipertahankan untuk kompatibilitas versi sebelumnya';
