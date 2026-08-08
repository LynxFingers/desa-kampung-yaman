import { Store } from "lucide-react";
import type { Umkm } from "@/types/database";

/**
 * Renders UMKM rows that only have a category assigned (no name/owner/etc.
 * yet) as a compact, non-clickable notice grouped by category — instead of
 * an empty-looking UmkmCard. These entries already count in the statistics
 * (see getUmkmCategoryCounts); this is purely how they're surfaced visually
 * on the public directory.
 */
export function UmkmIncompleteNotice({ items }: { items: Umkm[] }) {
  if (items.length === 0) return null;

  const grouped = new Map<string, { name: string; total: number }>();
  for (const item of items) {
    const key = item.category_id ?? "tanpa-kategori";
    const name = item.umkm_categories?.name ?? "Tanpa kategori";
    const existing = grouped.get(key);
    grouped.set(key, { name, total: (existing?.total ?? 0) + 1 });
  }

  return (
    <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-primary-light)]/30 p-5">
      <p className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--color-primary-dark)]">
        <Store className="h-4 w-4 shrink-0" />
        Ada {items.length} UMKM lain yang sudah terdaftar, tapi profil usahanya belum dilengkapi:
      </p>
      <div className="flex flex-wrap gap-2">
        {Array.from(grouped.values()).map((group) => (
          <span
            key={group.name}
            className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
          >
            {group.name} &times; {group.total}
          </span>
        ))}
      </div>
    </div>
  );
}
