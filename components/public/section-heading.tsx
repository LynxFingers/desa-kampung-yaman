export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        )}
        <h2 className="field-underline font-display text-3xl text-[var(--color-primary-dark)] sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-4 max-w-2xl text-[var(--color-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
