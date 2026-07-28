-- =========================================================
-- Sistem Informasi Desa Kampung Yaman - Initial Schema
-- Sesuai BAB V (Database Design) dokumen SRS/SDD
-- =========================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------
-- admins
-- ---------------------------------------------------------
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  email varchar(150) not null unique,
  role varchar(20) not null default 'operator' check (role in ('super_admin', 'operator')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- site_settings (singleton)
-- ---------------------------------------------------------
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  village_name varchar(100) not null default 'Desa Kampung Yaman',
  logo_url text,
  hero_image_url text,
  motto varchar(255),
  address text,
  email varchar(150),
  phone varchar(20),
  maps_url text,
  facebook_url text,
  instagram_url text
);

-- ---------------------------------------------------------
-- village_profile (singleton)
-- ---------------------------------------------------------
create table if not exists village_profile (
  id uuid primary key default gen_random_uuid(),
  history text,
  vision text,
  mission text,
  potency text
);

-- ---------------------------------------------------------
-- village_officials
-- ---------------------------------------------------------
create table if not exists village_officials (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admins(id) on delete set null,
  photo_url text,
  name varchar(100) not null,
  position varchar(100) not null,
  term_period varchar(50),
  display_order int not null default 0,
  welcome_speech text,
  created_at timestamptz not null default now()
);
create index if not exists idx_officials_display_order on village_officials(display_order);

-- ---------------------------------------------------------
-- village_statistics (singleton)
-- ---------------------------------------------------------
create table if not exists village_statistics (
  id uuid primary key default gen_random_uuid(),
  population int not null default 0 check (population >= 0),
  total_families int not null default 0 check (total_families >= 0),
  total_hamlets int not null default 0 check (total_hamlets >= 0),
  total_rt int not null default 0 check (total_rt >= 0),
  total_rw int not null default 0 check (total_rw >= 0),
  male_count int not null default 0 check (male_count >= 0),
  female_count int not null default 0 check (female_count >= 0),
  area_size decimal(10, 2),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- news
-- ---------------------------------------------------------
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admins(id) on delete set null,
  title varchar(200) not null,
  slug varchar(220) not null unique,
  summary varchar(300) not null,
  content text not null,
  thumbnail_url text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_news_published_at on news(published_at desc);
create index if not exists idx_news_title_trgm on news using gin (title gin_trgm_ops);

-- ---------------------------------------------------------
-- umkm_categories
-- ---------------------------------------------------------
create table if not exists umkm_categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) not null unique
);

-- ---------------------------------------------------------
-- umkm
-- ---------------------------------------------------------
create table if not exists umkm (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references umkm_categories(id) on delete restrict,
  admin_id uuid references admins(id) on delete set null,
  name varchar(150) not null,
  owner varchar(100) not null,
  address text,
  whatsapp varchar(20) not null,
  description text,
  photo_url text,
  created_at timestamptz not null default now()
);
create index if not exists idx_umkm_category_id on umkm(category_id);
create index if not exists idx_umkm_name_trgm on umkm using gin (name gin_trgm_ops);

-- ---------------------------------------------------------
-- gallery
-- ---------------------------------------------------------
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admins(id) on delete set null,
  photo_url text not null,
  title varchar(150) not null,
  taken_at date,
  created_at timestamptz not null default now()
);
create index if not exists idx_gallery_taken_at on gallery(taken_at desc);

-- ---------------------------------------------------------
-- activity_logs
-- ---------------------------------------------------------
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admins(id) on delete set null,
  module varchar(50) not null,
  action varchar(20) not null check (action in ('create', 'update', 'delete')),
  description varchar(255),
  created_at timestamptz not null default now()
);
create index if not exists idx_activity_logs_created_at on activity_logs(created_at desc);

-- =========================================================
-- Seed data (kategori UMKM baku & baris singleton)
-- =========================================================
insert into umkm_categories (name) values
  ('Makanan'), ('Minuman'), ('Kerajinan'), ('Pertanian'), ('Perikanan'),
  ('Peternakan'), ('Perdagangan'), ('Jasa'), ('Industri Rumahan'), ('Lainnya')
on conflict (name) do nothing;

insert into site_settings (village_name, motto)
select 'Desa Kampung Yaman', 'Guyub Rukun, Maju Bersama'
where not exists (select 1 from site_settings);

insert into village_profile (history, vision, mission, potency)
select '', '', '', ''
where not exists (select 1 from village_profile);

insert into village_statistics (population)
select 0
where not exists (select 1 from village_statistics);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table admins enable row level security;
alter table site_settings enable row level security;
alter table village_profile enable row level security;
alter table village_officials enable row level security;
alter table village_statistics enable row level security;
alter table news enable row level security;
alter table umkm_categories enable row level security;
alter table umkm enable row level security;
alter table gallery enable row level security;
alter table activity_logs enable row level security;

-- Public (anon) read access on public-facing tables
create policy "public read site_settings" on site_settings for select using (true);
create policy "public read village_profile" on village_profile for select using (true);
create policy "public read village_officials" on village_officials for select using (true);
create policy "public read village_statistics" on village_statistics for select using (true);
create policy "public read news" on news for select using (true);
create policy "public read umkm_categories" on umkm_categories for select using (true);
create policy "public read umkm" on umkm for select using (true);
create policy "public read gallery" on gallery for select using (true);

-- Authenticated (admin) full access on content tables
create policy "admin write site_settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write village_profile" on village_profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write village_officials" on village_officials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write village_statistics" on village_statistics for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write news" on news for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write umkm_categories" on umkm_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write umkm" on umkm for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write gallery" on gallery for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write activity_logs" on activity_logs for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin read activity_logs" on activity_logs for select using (auth.role() = 'authenticated');

-- admins table: only super_admin may manage; every admin may read their own row
create policy "admin read own row" on admins for select using (
  auth.role() = 'authenticated'
);
create policy "super_admin manage admins" on admins for all using (
  exists (
    select 1 from admins a
    where a.email = auth.jwt() ->> 'email' and a.role = 'super_admin'
  )
) with check (
  exists (
    select 1 from admins a
    where a.email = auth.jwt() ->> 'email' and a.role = 'super_admin'
  )
);

-- =========================================================
-- Storage: bucket "uploads" for logo, hero image, thumbnails,
-- UMKM photos, official photos, and gallery photos (organized
-- by folder prefix, e.g. news/, umkm/, gallery/, officials/,
-- settings/logo/, settings/hero/).
-- =========================================================
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

create policy "public read uploads bucket" on storage.objects
  for select using (bucket_id = 'uploads');

create policy "authenticated upload to uploads bucket" on storage.objects
  for insert with check (bucket_id = 'uploads' and auth.role() = 'authenticated');

create policy "authenticated update uploads bucket" on storage.objects
  for update using (bucket_id = 'uploads' and auth.role() = 'authenticated');

create policy "authenticated delete uploads bucket" on storage.objects
  for delete using (bucket_id = 'uploads' and auth.role() = 'authenticated');
