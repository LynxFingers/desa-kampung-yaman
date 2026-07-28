import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { BackLink } from "@/components/dashboard/back-link";
import { NewsForm } from "@/components/dashboard/news-form";
import { getNewsById } from "@/lib/data/news";

export default async function EditBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const news = await getNewsById(id);
  if (!news) notFound();

  return (
    <div>
      <BackLink href="/dashboard/berita" label="Kembali ke Daftar Berita" />
      <PageHeader title="Ubah Berita" description={`Perbarui konten untuk "${news.title}".`} />
      <NewsForm news={news} />
    </div>
  );
}
