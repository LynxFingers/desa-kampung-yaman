import { Store } from "lucide-react";
import type { UmkmCategoryCount } from "@/lib/data/umkm";
import { formatNumber } from "@/lib/utils";

export function UmkmCategoryStats({
  total,
  categories,
}: {
  total: number;
  categories: UmkmCategoryCount[];
}) {
  return (
    <div className="mb-8 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
          <Store className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-2xl text-[var(--color-primary-dark)]">{formatNumber(total)}</p>
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Total UMKM Terdaftar</p>
        </div>
      </div>

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Rincian per Kategori
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3"
          >
            <p className="font-display text-lg text-[var(--color-primary-dark)]">{formatNumber(cat.total)}</p>
            <p className="line-clamp-1 text-xs text-[var(--color-muted)]">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
