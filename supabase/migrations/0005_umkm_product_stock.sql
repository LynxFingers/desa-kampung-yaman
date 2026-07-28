-- =========================================================
-- Migration 0005: stok produk UMKM.
-- Menambahkan kolom stock agar setiap produk UMKM dapat
-- menampilkan status ketersediaan (Stok Tersedia / Stok
-- Terbatas / Habis) seperti pada aplikasi ecommerce.
-- Jalankan file ini SETELAH 0004_fix_storage_policies.sql.
-- =========================================================

alter table umkm_products
  add column if not exists stock integer;

comment on column umkm_products.stock is 'Jumlah stok produk (opsional). Kosongkan jika stok tidak perlu dilacak.';
