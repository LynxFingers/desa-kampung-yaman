import type { Metadata } from "next";
import Link from "next/link";
import { UmkmCard } from "@/components/public/umkm-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getUmkmList, getUmkmCategoryCounts, getUmkmDusunCounts } from "@/lib/data/umkm";
import { getPageFromSearchParams, PAGE_SIZE, cn, formatNumber } from "@/lib/utils";
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
  const dusunParam = typeof params.dusun === "string" ? Number(params.dusun) : undefined;
  const dusun = dusunParam && dusunParam >= 1 && dusunParam <= 5 ? dusunParam : undefined;

  const [{ items, total }, categoryCounts, dusunCounts] = await Promise.all([
    getUmkmList({ search, categoryId, dusun, page }),
    getUmkmCategoryCounts(),
    getUmkmDusunCounts(),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

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

      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Berdasarkan Dusun</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/umkm"
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              !dusun
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : "border-[var(--color-border)] hover:bg-[var(--color-primary-light)]"
            )}
          >
            Semua Dusun
          </Link>
          {dusunCounts.dusun.map((d) => (
            <Link
              key={d.dusun}
              href={`/umkm?dusun=${d.dusun}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium",
                dusun === d.dusun
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] hover:bg-[var(--color-primary-light)]"
              )}
            >
              Dusun {d.dusun} ({formatNumber(d.total)})
            </Link>
          ))}
        </div>
      </div>

      {search && (
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          Menampilkan {total} hasil untuk &ldquo;{search}&rdquo;
        </p>
      )}

      {items.length > 0 ? (
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <UmkmCard umkm={item} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <EmptyState title="UMKM tidak ditemukan" description="Coba ubah kata kunci atau kategori pencarian." />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/umkm"
        searchParams={{ search, kategori: categoryId, dusun: dusun ? String(dusun) : undefined }}
      />
    </div>
  );
}
