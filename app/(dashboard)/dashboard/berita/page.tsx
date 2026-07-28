import { Plus, Pencil } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { getNewsList } from "@/lib/data/news";
import { deleteNews } from "@/lib/actions/news.actions";
import { formatDate, getPageFromSearchParams, PAGE_SIZE } from "@/lib/utils";

export default async function DashboardBeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = getPageFromSearchParams(params);
  const { items, total } = await getNewsList({ page, pageSize: PAGE_SIZE });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Berita"
        description="Kelola publikasi berita desa."
        action={<Button href="/dashboard/berita/baru"><Plus className="h-4 w-4" /> Tambah Berita</Button>}
      />

      {items.length > 0 ? (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-primary-light)]/40 text-xs uppercase text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3">Judul</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {items.map((news) => (
                <tr key={news.id}>
                  <td className="px-5 py-3 font-medium">{news.title}</td>
                  <td className="px-5 py-3">{formatDate(news.published_at)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Button href={`/dashboard/berita/${news.id}`} variant="outline" size="sm">
                        <Pencil className="h-3.5 w-3.5" /> Ubah
                      </Button>
                      <DeleteButton
                        action={deleteNews.bind(null, news.id, news.title)}
                        confirmMessage={`Hapus berita "${news.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Belum ada berita" description="Klik tombol Tambah Berita untuk mempublikasikan berita pertama." />
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/dashboard/berita" />
    </div>
  );
}
