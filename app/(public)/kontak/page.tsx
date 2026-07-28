import type { Metadata } from "next";
import { MapPin, Mail, Phone, Link2 } from "lucide-react";
import { MapEmbed } from "@/components/public/map-embed";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Kontak" };

export default async function KontakPage() {
  const settings = await getSiteSettings();

  const items = [
    { icon: MapPin, label: "Alamat", value: settings.address },
    { icon: Phone, label: "Telepon", value: settings.phone },
    { icon: Mail, label: "Email", value: settings.email },
  ].filter((item) => item.value);

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Hubungi Kami</p>
      <h1 className="mb-10 font-display text-4xl text-[var(--color-primary-dark)]">Kontak</h1>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{label}</p>
            <p className="mt-1 font-medium">{value}</p>
          </div>
        ))}
      </div>

      {(settings.facebook_url || settings.instagram_url) && (
        <div className="mb-10 flex gap-3">
          {settings.facebook_url && (
            <a
              href={settings.facebook_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-primary-light)]"
            >
              <Link2 className="h-4 w-4" /> Facebook
            </a>
          )}
          {settings.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-primary-light)]"
            >
              <Link2 className="h-4 w-4" /> Instagram
            </a>
          )}
        </div>
      )}

      <MapEmbed mapsUrl={settings.maps_url} villageName={settings.village_name} />
    </div>
  );
}
