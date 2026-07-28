import Image from "next/image";
import { ImageOff } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { BackLink } from "@/components/dashboard/back-link";
import { GalleryForm } from "@/components/dashboard/gallery-form";
import { getGalleryList } from "@/lib/data/gallery";
import { deleteGalleryItem } from "@/lib/actions/gallery.actions";
import { formatDate, getPageFromSearchParams, PAGE_SIZE } from "@/lib/utils";

export default async function DashboardGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = getPageFromSearchParams(params);
  const { items, total } = await getGalleryList(page, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <BackLink href="/dashboard" label="Kembali ke Dashboard" />
      <PageHeader title="Galeri" description="Kelola dokumentasi foto kegiatan desa." />

      <GalleryForm />

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white">
              <div className="relative aspect-square w-full bg-[var(--color-primary-light)]">
                {item.photo_url ? (
                  <Image src={item.photo_url} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--color-primary)]">
                    <ImageOff className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                <p className="mb-2 text-xs text-[var(--color-muted)]">{formatDate(item.taken_at)}</p>
                <DeleteButton
                  action={deleteGalleryItem.bind(null, item.id, item.title, item.photo_url)}
                  confirmMessage={`Hapus foto "${item.title}"?`}
                  className="w-full justify-center"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada foto galeri" />
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/dashboard/galeri" />
    </div>
  );
}
