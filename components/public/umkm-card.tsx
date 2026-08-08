import Link from "next/link";
import Image from "next/image";
import { ImageOff, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDusun } from "@/lib/utils";
import type { Umkm } from "@/types/database";

export function UmkmCard({ umkm }: { umkm: Umkm }) {
  const dusunLabel = formatDusun(umkm.dusun);

  return (
    <Card className="group flex h-full flex-col overflow-hidden p-3">
      <Link href={`/umkm/${umkm.id}`} className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[var(--color-accent-light)]">
        {umkm.photo_url ? (
          <Image
            src={umkm.photo_url}
            alt={umkm.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-accent)]">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        {umkm.umkm_categories?.name && (
          <Badge className="absolute left-3 top-3 bg-white/90 shadow-soft">{umkm.umkm_categories.name}</Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 pb-2">
        <Link href={`/umkm/${umkm.id}`}>
          <h3 className="mb-1.5 line-clamp-1 font-display text-lg font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-primary)]">
            {umkm.name}
          </h3>
        </Link>
        <p className="mb-1.5 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
          <User className="h-3.5 w-3.5 shrink-0" /> {umkm.owner}
        </p>
        <p className="mb-4 text-xs font-medium text-[var(--color-accent)]">{dusunLabel ?? "\u00A0"}</p>
        <Button href={`/umkm/${umkm.id}`} className="mt-auto w-full">
          Lihat Detail
        </Button>
      </div>
    </Card>
  );
}
