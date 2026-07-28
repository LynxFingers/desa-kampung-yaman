import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Eye, ListChecks, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getVillageProfile } from "@/lib/data/settings";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Profil Desa" };

function Section({
  icon: Icon,
  title,
  content,
}: {
  icon: LucideIcon;
  title: string;
  content: string | null;
}) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-display text-xl text-[var(--color-primary-dark)]">{title}</h2>
      </div>
      {content ? (
        <p className="whitespace-pre-line leading-relaxed text-[var(--color-foreground)]/90">{content}</p>
      ) : (
        <p className="text-sm text-[var(--color-muted)]">Konten belum tersedia.</p>
      )}
    </Card>
  );
}

export default async function ProfilDesaPage() {
  const profile = await getVillageProfile();

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState title="Profil desa belum tersedia" description="Admin belum mengisi konten profil desa." />
      </div>
    );
  }

  return (
    <div>
      {profile.photo_url ? (
        <section className="relative h-72 w-full overflow-hidden sm:h-96">
          <Image src={profile.photo_url} alt="Profil Desa" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 px-4 py-10 sm:px-6">
            <div className="mx-auto w-full max-w-3xl">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Mengenal Desa Kami</p>
              <h1 className="font-display text-4xl text-white">Profil Desa</h1>
            </div>
          </div>
        </section>
      ) : (
        <div className="mx-auto max-w-3xl px-4 pt-20 sm:px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Mengenal Desa Kami</p>
          <h1 className="font-display text-4xl text-[var(--color-primary-dark)]">Profil Desa</h1>
        </div>
      )}

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-14 sm:px-6">
        <Section icon={BookOpen} title="Sejarah Desa" content={profile.history} />
        <Section icon={Eye} title="Visi" content={profile.vision} />
        <Section icon={ListChecks} title="Misi" content={profile.mission} />
        <Section icon={Sprout} title="Potensi Desa" content={profile.potency} />
      </div>
    </div>
  );
}
