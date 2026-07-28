import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getNewsBySlug } from "@/lib/data/news";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  return { title: news?.title ?? "Berita" };
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link href="/berita" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Berita
      </Link>

      {news.thumbnail_url && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-primary-light)]">
          <Image src={news.thumbnail_url} alt={news.title} fill className="object-cover" priority />
        </div>
      )}

      <p className="mb-3 text-sm text-[var(--color-muted)]">{formatDate(news.published_at)}</p>
      <h1 className="mb-6 font-display text-3xl leading-tight text-[var(--color-primary-dark)] sm:text-4xl">
        {news.title}
      </h1>
      <p className="mb-8 text-lg text-[var(--color-foreground)]/80">{news.summary}</p>
      <div className="whitespace-pre-line leading-relaxed text-[var(--color-foreground)]/90">{news.content}</div>
    </article>
  );
}
