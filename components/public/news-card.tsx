import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { News } from "@/types/database";

export function NewsCard({ news }: { news: News }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-3">
      <Link href={`/berita/${news.slug}`} className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[var(--color-primary-light)]">
        {news.thumbnail_url ? (
          <Image
            src={news.thumbnail_url}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-primary)]">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 pb-2">
        <p className="mb-2 text-xs font-medium text-[var(--color-accent)]">{formatDate(news.published_at)}</p>
        <Link href={`/berita/${news.slug}`}>
          <h3 className="mb-2 line-clamp-2 font-display text-lg font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-primary)]">
            {news.title}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-sm text-[var(--color-muted)]">{news.summary}</p>
        <Button href={`/berita/${news.slug}`} variant="outline" className="mt-auto w-full">
          Baca Selengkapnya
        </Button>
      </div>
    </Card>
  );
}
