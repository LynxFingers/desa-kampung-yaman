import type { LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-white bg-white p-6 text-center shadow-soft transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-lg">
      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
        <Icon className="h-5 w-5" />
      </span>
      <p className="font-display text-2xl text-[var(--color-primary-dark)]">
        {formatNumber(value)}
        {suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wide text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
