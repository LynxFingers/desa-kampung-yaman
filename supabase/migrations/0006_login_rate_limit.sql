-- =========================================================
-- Migration 0006: rate limiting percobaan login admin.
-- Menyimpan setiap percobaan login (berhasil/gagal) supaya
-- server action signIn() bisa mengunci sementara email/IP
-- yang terlalu banyak gagal login (mencegah brute force).
-- Ditulis lewat service-role client (bypass RLS) karena
-- percobaan login terjadi SEBELUM user terautentikasi.
-- Jalankan SETELAH 0005_umkm_product_stock.sql.
-- =========================================================

create table if not exists login_attempts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  ip text,
  success boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists login_attempts_email_created_idx on login_attempts (email, created_at desc);
create index if not exists login_attempts_ip_created_idx on login_attempts (ip, created_at desc);

alter table login_attempts enable row level security;

-- No public/anon policies on purpose: this table is only ever read/written
-- through the server-side service-role client in lib/actions/admins.actions.ts,
-- never directly from the browser.

comment on table login_attempts is 'Riwayat percobaan login admin, dipakai untuk rate limiting brute force.';
