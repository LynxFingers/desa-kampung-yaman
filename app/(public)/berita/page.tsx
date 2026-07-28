import type { Metadata } from "next";
import { NewsCard } from "@/components/public/news-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getNewsList } from "@/lib/data/news";
import { getPageFromSearchParams, PAGE_SIZE } from "@/lib/utils";
import { SearchBar } from "@/components/public/search-bar";

export const metadata: Metadata = { title: "Berita Desa" };

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = getPageFromSearchParams(params);
  const search = typeof params.search === "string" ? params.search : undefined;
  const { items, total } = await getNewsList({ search, page });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Informasi Desa</p>
      <h1 className="mb-8 font-display text-4xl text-[var(--color-primary-dark)]">Berita</h1>

      <div className="mb-10">
        <SearchBar placeholder="Cari berita berdasarkan judul..." />
      </div>

      {search && (
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          Menampilkan {total} hasil untuk &ldquo;{search}&rdquo;
        </p>
      )}

      {items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Berita tidak ditemukan"
          description="Coba gunakan kata kunci lain atau lihat kembali seluruh berita."
        />
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/berita" searchParams={{ search }} />
    </div>
  );
}
