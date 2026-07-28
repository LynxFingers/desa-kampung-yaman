import { PageHeader } from "@/components/dashboard/page-header";
import { BackLink } from "@/components/dashboard/back-link";
import { UmkmForm } from "@/components/dashboard/umkm-form";
import { getUmkmCategories } from "@/lib/data/umkm";

export default async function TambahUmkmPage() {
  const categories = await getUmkmCategories();
  return (
    <div>
      <BackLink href="/dashboard/umkm" label="Kembali ke Daftar UMKM" />
      <PageHeader title="Tambah UMKM" description="Isi form berikut untuk mendaftarkan UMKM baru." />
      <UmkmForm categories={categories} />
    </div>
  );
}
