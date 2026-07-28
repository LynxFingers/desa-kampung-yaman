import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { GalleryItem } from "@/types/database";

export function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <figure className="group overflow-hidden rounded-[var(--radius-card)] border border-white bg-white p-2 shadow-soft transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-soft-lg">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[var(--color-primary-light)]">
        {item.photo_url ? (
          <Image
            src={item.photo_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-primary)]">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
      </div>
      <figcaption className="px-2 py-3">
        <p className="line-clamp-1 text-sm font-medium text-[var(--color-primary-dark)]">{item.title}</p>
        <p className="text-xs text-[var(--color-muted)]">{formatDate(item.taken_at)}</p>
      </figcaption>
    </figure>
  );
}
