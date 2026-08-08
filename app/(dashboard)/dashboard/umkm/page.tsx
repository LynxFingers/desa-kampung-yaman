import { Plus, Pencil, Tag, Images } from "lucide-react";
import Link from "next/link";
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
import { getPageFromSearchParams, PAGE_SIZE, cn, formatDusun } from "@/lib/utils";

export default async function DashboardUmkmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = getPageFromSearchParams(params);
  const dusunParam = typeof params.dusun === "string" ? Number(params.dusun) : undefined;
  const dusun = dusunParam && dusunParam >= 1 && dusunParam <= 5 ? dusunParam : undefined;

  const [{ items, total }, categoryCounts, dusunCounts] = await Promise.all([
    getUmkmList({ page, pageSize: PAGE_SIZE, dusun }),
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

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/dashboard/umkm"
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
            href={`/dashboard/umkm?dusun=${d.dusun}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              dusun === d.dusun
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : "border-[var(--color-border)] hover:bg-[var(--color-primary-light)]"
            )}
          >
            Dusun {d.dusun} ({d.total})
          </Link>
        ))}
      </div>

      {items.length > 0 ? (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-primary-light)]/40 text-xs uppercase text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3">Nama Usaha</th>
                <th className="px-5 py-3">Pemilik</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Dusun</th>
                <th className="px-5 py-3">No. HP</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {items.map((umkm) => (
                <tr key={umkm.id}>
                  <td className="px-5 py-3 font-medium">{umkm.name}</td>
                  <td className="px-5 py-3">{umkm.owner}</td>
                  <td className="px-5 py-3">{umkm.umkm_categories?.name && <Badge>{umkm.umkm_categories.name}</Badge>}</td>
                  <td className="px-5 py-3">
                    {formatDusun(umkm.dusun) ?? <span className="text-[var(--color-muted)]">Belum diatur</span>}
                  </td>
                  <td className="px-5 py-3">{umkm.whatsapp}</td>
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
                        confirmMessage={`Hapus data UMKM "${umkm.name}"?`}
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

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/umkm"
        searchParams={{ dusun: dusun ? String(dusun) : undefined }}
      />
    </div>
  );
}
