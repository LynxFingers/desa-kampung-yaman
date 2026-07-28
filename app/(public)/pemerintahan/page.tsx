import type { Metadata } from "next";
import Image from "next/image";
import { UserRound, Phone } from "lucide-react";
import { OfficialCard } from "@/components/public/official-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getOfficials, getHeadOfVillage } from "@/lib/data/officials";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = { title: "Pemerintahan Desa" };

export default async function PemerintahanPage() {
  const officials = await getOfficials();
  const head = await getHeadOfVillage(officials);
  const rest = officials.filter((o) => o.id !== head?.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Struktur Pemerintahan</p>
      <h1 className="mb-12 font-display text-4xl text-[var(--color-primary-dark)]">Pemerintahan Desa</h1>

      {head && (
        <Reveal direction="up" className="mb-14 grid gap-8 rounded-[var(--radius-card)] border border-white bg-white p-8 shadow-soft sm:p-10 md:grid-cols-[200px_1fr] md:items-center">
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full bg-[var(--color-primary-light)] ring-4 ring-[var(--color-primary-light)]/60 md:mx-0">
            {head.photo_url ? (
              <Image src={head.photo_url} alt={head.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[var(--color-primary)]">
                <UserRound className="h-14 w-14" />
              </div>
            )}
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Sambutan {head.position}
            </p>
            <p className="mb-4 font-display text-lg leading-relaxed text-[var(--color-primary-dark)]">
              {head.welcome_speech ?? "Belum ada sambutan."}
            </p>
            <p className="font-medium">{head.name}</p>
            {head.phone && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                <Phone className="h-3.5 w-3.5" /> {head.phone}
              </p>
            )}
          </div>
        </Reveal>
      )}

      <h2 className="mb-6 font-display text-2xl text-[var(--color-primary-dark)]">Daftar Perangkat Desa</h2>
      {rest.length > 0 ? (
        <StaggerGroup className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {rest.map((official) => (
            <StaggerItem key={official.id}>
              <OfficialCard official={official} showPhone />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <EmptyState title="Belum ada data perangkat desa lainnya" />
      )}
    </div>
  );
}
