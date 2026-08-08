import { Plus, Pencil, Tag, Images } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { UmkmCategoryStats } from "@/components/dashboard/umkm-category-stats";
import { UmkmDusunStats } from "@/components/dashboard/umkm-dusun-stats";
import { getUmkmList, getUmkmCategoryCounts, getUmkmDusunCounts } from "@/lib/data/umkm";
import { deleteUmkm } from "@/lib/actions/umkm.actions";
import { getPageFromSearchParams, PAGE_SIZE } from "@/lib/utils";

export default async function DashboardUmkmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = getPageFromSearchParams(params);
  const [{ items, total }, categoryCounts, dusunCounts] = await Promise.all([
    getUmkmList({ page, pageSize: PAGE_SIZE }),
    getUmkmCategoryCounts(),
    getUmkmDusunCounts(),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="UMKM"
        description="Kelola direktori Usaha Mikro, Kecil, dan Menengah desa."
        action={
          <div className="flex gap-2">
            <Button href="/dashboard/umkm/kategori" variant="outline"><Tag className="h-4 w-4" /> Kategori</Button>
            <Button href="/dashboard/umkm/baru"><Plus className="h-4 w-4" /> Tambah UMKM</Button>
          </div>
        }
      />

      <UmkmCategoryStats total={categoryCounts.total} categories={categoryCounts.categories} />
      <UmkmDusunStats dusun={dusunCounts.dusun} unassigned={dusunCounts.unassigned} />

      {items.length > 0 ? (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-primary-light)]/40 text-xs uppercase text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3">Nama Usaha</th>
                <th className="px-5 py-3">Pemilik</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {items.map((umkm) => (
                <tr key={umkm.id}>
                  <td className="px-5 py-3 font-medium">
                    {umkm.name ?? <span className="italic text-[var(--color-muted)]">Belum diisi</span>}
                  </td>
                  <td className="px-5 py-3">{umkm.owner ?? <span className="italic text-[var(--color-muted)]">—</span>}</td>
                  <td className="px-5 py-3">{umkm.umkm_categories?.name && <Badge>{umkm.umkm_categories.name}</Badge>}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Button href={`/dashboard/umkm/${umkm.id}/produk`} variant="ghost" size="sm">
                        <Images className="h-3.5 w-3.5" /> Foto Produk
                      </Button>
                      <Button href={`/dashboard/umkm/${umkm.id}`} variant="outline" size="sm">
                        <Pencil className="h-3.5 w-3.5" /> Ubah
                      </Button>
                      <DeleteButton
                        action={deleteUmkm.bind(null, umkm.id, umkm.name)}
                        confirmMessage={`Hapus data UMKM "${umkm.name ?? "(belum ada nama)"}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Belum ada data UMKM" description="Klik tombol Tambah UMKM untuk mulai mempromosikan usaha warga." />
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/dashboard/umkm" />
    </div>
  );
}
