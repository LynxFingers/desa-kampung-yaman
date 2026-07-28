import type { Metadata } from "next";
import { GalleryCard } from "@/components/public/gallery-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getGalleryList } from "@/lib/data/gallery";
import { getPageFromSearchParams, PAGE_SIZE } from "@/lib/utils";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = { title: "Galeri Desa" };

export default async function GaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = getPageFromSearchParams(params);
  const { items, total } = await getGalleryList(page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Dokumentasi</p>
      <h1 className="mb-10 font-display text-4xl text-[var(--color-primary-dark)]">Galeri Desa</h1>

      {items.length > 0 ? (
        <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <StaggerItem key={item.id} direction="zoom">
              <GalleryCard item={item} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <EmptyState title="Belum ada foto pada galeri" />
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/galeri" />
    </div>
  );
}
