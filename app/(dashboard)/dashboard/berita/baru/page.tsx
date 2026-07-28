import { PageHeader } from "@/components/dashboard/page-header";
import { BackLink } from "@/components/dashboard/back-link";
import { NewsForm } from "@/components/dashboard/news-form";

export default function TambahBeritaPage() {
  return (
    <div>
      <BackLink href="/dashboard/berita" label="Kembali ke Daftar Berita" />
      <PageHeader title="Tambah Berita" description="Isi form berikut untuk mempublikasikan berita baru." />
      <NewsForm />
    </div>
  );
}
