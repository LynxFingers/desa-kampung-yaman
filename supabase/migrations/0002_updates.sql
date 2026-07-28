-- =========================================================
-- Migration 0002: perangkat desa phone number, foto profil
-- desa, dan galeri foto produk UMKM.
-- Jalankan file ini SETELAH 0001_init.sql.
-- =========================================================

-- ---------------------------------------------------------
-- Nomor HP perangkat desa (opsional, tidak ditampilkan
-- pada preview Beranda, hanya di halaman Pemerintahan Desa
-- dan dashboard admin).
-- ---------------------------------------------------------
alter table village_officials
  add column if not exists phone varchar(20);

-- ---------------------------------------------------------
-- Foto profil desa (foto sampul untuk halaman Profil Desa).
-- ---------------------------------------------------------
alter table village_profile
  add column if not exists photo_url text;

-- ---------------------------------------------------------
-- Foto produk UMKM (opsional, satu UMKM dapat memiliki
-- beberapa foto produk untuk memperkenalkan produknya).
-- ---------------------------------------------------------
create table if not exists umkm_products (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid not null references umkm(id) on delete cascade,
  photo_url text not null,
  caption varchar(150),
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_umkm_products_umkm_id on umkm_products(umkm_id);

alter table umkm_products enable row level security;

create policy "public read umkm_products" on umkm_products
  for select using (true);

create policy "admin write umkm_products" on umkm_products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
