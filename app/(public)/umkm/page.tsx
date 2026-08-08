import type { Metadata } from "next";
import Link from "next/link";
import { UmkmCard } from "@/components/public/umkm-card";
import { UmkmIncompleteNotice } from "@/components/public/umkm-incomplete-notice";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getUmkmList, getUmkmCategoryCounts } from "@/lib/data/umkm";
import { getPageFromSearchParams, PAGE_SIZE, cn, formatNumber, hasUmkmProfile } from "@/lib/utils";
import { SearchBar } from "@/components/public/search-bar";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = { title: "UMKM Desa" };

export default async function UmkmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = getPageFromSearchParams(params);
  const search = typeof params.search === "string" ? params.search : undefined;
  const categoryId = typeof params.kategori === "string" ? params.kategori : undefined;

  const [{ items, total }, categoryCounts] = await Promise.all([
    getUmkmList({ search, categoryId, page }),
    getUmkmCategoryCounts(),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const completeItems = items.filter(hasUmkmProfile);
  const incompleteItems = items.filter((item) => !hasUmkmProfile(item));

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Ekonomi Desa</p>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl text-[var(--color-primary-dark)]">Direktori UMKM</h1>
        <p className="text-sm text-[var(--color-muted)]">
          <span className="font-semibold text-[var(--color-primary-dark)]">{formatNumber(categoryCounts.total)}</span> UMKM terdaftar
        </p>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Cari nama usaha..." />
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/umkm"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium",
            !categoryId
              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
              : "border-[var(--color-border)] hover:bg-[var(--color-primary-light)]"
          )}
        >
          Semua Kategori ({formatNumber(categoryCounts.total)})
        </Link>
        {categoryCounts.categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/umkm?kategori=${cat.id}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              categoryId === cat.id
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : "border-[var(--color-border)] hover:bg-[var(--color-primary-light)]"
            )}
          >
            {cat.name} ({formatNumber(cat.total)})
          </Link>
        ))}
      </div>

      {search && (
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          Menampilkan {total} hasil untuk &ldquo;{search}&rdquo;
        </p>
      )}

      {completeItems.length > 0 ? (
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {completeItems.map((item) => (
            <StaggerItem key={item.id}>
              <UmkmCard umkm={item} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : incompleteItems.length === 0 ? (
        <EmptyState title="UMKM tidak ditemukan" description="Coba ubah kata kunci atau kategori pencarian." />
      ) : null}

      <UmkmIncompleteNotice items={incompleteItems} />

      <Pagination currentPage={page} totalPages={totalPages} basePath="/umkm" searchParams={{ search, kategori: categoryId }} />
    </div>
  );
}
