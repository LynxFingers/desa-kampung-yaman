import type { ReactNode } from "react";

export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
      {icon && <div className="mb-4 text-[var(--color-muted)]">{icon}</div>}
      <p className="font-display text-lg text-[var(--color-foreground)]">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-[var(--color-muted)]">{description}</p>}
    </div>
  );
}
