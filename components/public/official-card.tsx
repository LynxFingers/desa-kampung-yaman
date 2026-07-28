import Image from "next/image";
import { UserRound, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { VillageOfficial } from "@/types/database";

export function OfficialCard({
  official,
  showPhone = false,
}: {
  official: VillageOfficial;
  showPhone?: boolean;
}) {
  return (
    <Card className="group flex flex-col items-center p-6 text-center">
      <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full bg-[var(--color-primary-light)] ring-4 ring-[var(--color-primary-light)]/60 transition-transform duration-500 ease-out group-hover:scale-110">
        {official.photo_url ? (
          <Image src={official.photo_url} alt={official.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-primary)]">
            <UserRound className="h-10 w-10" />
          </div>
        )}
      </div>
      <h3 className="font-display text-lg text-[var(--color-primary-dark)]">{official.name}</h3>
      <p className="text-sm font-medium text-[var(--color-accent)]">{official.position}</p>
      {official.term_period && <p className="mt-1 text-xs text-[var(--color-muted)]">Masa Jabatan {official.term_period}</p>}
      {showPhone && official.phone && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
          <Phone className="h-3.5 w-3.5" /> {official.phone}
        </p>
      )}
    </Card>
  );
}
