import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string) {
  return slugify(title, { lower: true, strict: true, locale: "id" });
}

export function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatCurrency(value: number | null | undefined) {
  if (!value) return null;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    value
  );
}

/**
 * Escapes a user-supplied string so it's safe to interpolate into a
 * PostgREST filter expression (used by supabase-js `.or()` / `.ilike()`
 * strings). Commas and parentheses are meaningful in that mini filter
 * syntax — without escaping them, a search query like `a,b.eq.1` could
 * inject extra filter clauses. Percent/underscore are also escaped so
 * they aren't treated as ILIKE wildcards.
 */
export function escapePostgrestFilterValue(value: string): string {
  return value.replace(/[\\,()%_]/g, (char) => `\\${char}`);
}
export function getStockStatus(stock: number | null | undefined) {
  if (stock === null || stock === undefined) return null;
  if (stock <= 0) {
    return { label: "Stok Habis", className: "bg-red-50 text-[var(--color-error)]" };
  }
  if (stock <= 10) {
    return { label: `Stok Terbatas: ${stock}`, className: "bg-[var(--color-accent-light)] text-[var(--color-accent)]" };
  }
  return { label: `Stok Tersedia: ${stock}`, className: "bg-green-50 text-[var(--color-success)]" };
}

/** Normalizes a phone number to the wa.me format (62xxxxxxxxxx). */
export function toWhatsAppLink(phone: string | null | undefined) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  return `https://wa.me/${normalized}`;
}

/**
 * A UMKM only counts as "having a profile" (and gets a full card) once it
 * has a name. Entries that only carry a category (no name/owner/etc. yet)
 * still count toward statistics, but are rendered as a lightweight notice
 * instead of an empty-looking card.
 */
export function hasUmkmProfile(umkm: { name?: string | null }) {
  return Boolean(umkm.name && umkm.name.trim().length > 0);
}

/** Extracts the object path within a bucket from a Supabase public storage URL. */
export function extractStoragePath(url: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export const PAGE_SIZE = 9;

export function getPageFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }) {
  const raw = searchParams.page;
  const page = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}
