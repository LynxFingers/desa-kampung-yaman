-- Allow a UMKM row to exist with only a category assigned. This supports
-- entries where the village only knows a business exists in a given
-- category but hasn't collected its full profile yet. Such rows still
-- count in UMKM statistics, but the app hides them from the public card
-- grid (see hasUmkmProfile() in lib/utils.ts) until name is filled in.
alter table umkm alter column name drop not null;
alter table umkm alter column owner drop not null;
alter table umkm alter column whatsapp drop not null;
