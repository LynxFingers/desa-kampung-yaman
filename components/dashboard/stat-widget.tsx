import type { LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function StatWidget({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-2xl text-[var(--color-primary-dark)]">{formatNumber(value)}</p>
      <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
