export function MapEmbed({ mapsUrl, villageName }: { mapsUrl?: string | null; villageName: string }) {
  if (!mapsUrl) return null;
  const isEmbeddable = mapsUrl.includes("/embed") || mapsUrl.includes("output=embed");
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)]">
      {isEmbeddable ? (
        <iframe
          src={mapsUrl}
          title={`Lokasi ${villageName}`}
          className="h-80 w-full"
          loading="lazy"
        />
      ) : (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-80 w-full items-center justify-center bg-[var(--color-primary-light)] text-sm font-medium text-[var(--color-primary-dark)] hover:underline"
        >
          Buka Lokasi {villageName} di Google Maps
        </a>
      )}
    </div>
  );
}
