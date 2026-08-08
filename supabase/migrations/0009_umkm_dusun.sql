-- Adds a free-text "dusun" (hamlet) field to umkm, so UMKM entries can be
-- grouped by which dusun they belong to (see getUmkmDusunCounts() in
-- lib/data/umkm.ts and the UmkmDusunStats dashboard widget). Optional,
-- like name/owner/whatsapp — a UMKM can still exist without it.
alter table umkm add column if not exists dusun text;
