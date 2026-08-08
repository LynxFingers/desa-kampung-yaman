import { MapPin } from "lucide-react";
import type { UmkmDusunCount } from "@/lib/data/umkm";
import { formatNumber } from "@/lib/utils";

export function UmkmDusunStats({
  dusun,
  unassigned,
}: {
  dusun: UmkmDusunCount[];
  unassigned: number;
}) {
  return (
    <div className="mb-8 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)]">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-lg text-[var(--color-primary-dark)]">Rincian per Dusun</p>
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Pengelompokan UMKM berdasarkan wilayah dusun</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {dusun.map((d) => (
          <div
            key={d.dusun}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3"
          >
            <p className="font-display text-lg text-[var(--color-primary-dark)]">{formatNumber(d.total)}</p>
            <p className="line-clamp-1 text-xs text-[var(--color-muted)]">Dusun {d.dusun}</p>
          </div>
        ))}
        {unassigned > 0 && (
          <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3">
            <p className="font-display text-lg text-[var(--color-muted)]">{formatNumber(unassigned)}</p>
            <p className="line-clamp-1 text-xs text-[var(--color-muted)]">Belum diatur</p>
          </div>
        )}
      </div>
    </div>
  );
}
