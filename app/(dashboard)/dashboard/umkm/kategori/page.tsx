import { PageHeader } from "@/components/dashboard/page-header";
import { BackLink } from "@/components/dashboard/back-link";
import { CategoryManager } from "@/components/dashboard/category-manager";
import { getUmkmCategories } from "@/lib/data/umkm";

export default async function KategoriUmkmPage() {
  const categories = await getUmkmCategories();

  return (
    <div>
      <BackLink href="/dashboard/umkm" label="Kembali ke Daftar UMKM" />
      <PageHeader title="Kategori UMKM" description="Kelola daftar kategori yang dapat dipilih saat menambahkan data UMKM." />
      <CategoryManager categories={categories} />
    </div>
  );
}
