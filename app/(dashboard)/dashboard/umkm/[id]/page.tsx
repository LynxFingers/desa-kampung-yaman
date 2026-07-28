import { notFound } from "next/navigation";
import { Images } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { BackLink } from "@/components/dashboard/back-link";
import { Button } from "@/components/ui/button";
import { UmkmForm } from "@/components/dashboard/umkm-form";
import { getUmkmById, getUmkmCategories } from "@/lib/data/umkm";

export default async function EditUmkmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [umkm, categories] = await Promise.all([getUmkmById(id), getUmkmCategories()]);
  if (!umkm) notFound();

  return (
    <div>
      <BackLink href="/dashboard/umkm" label="Kembali ke Daftar UMKM" />
      <PageHeader
        title="Ubah UMKM"
        description={`Perbarui data untuk "${umkm.name}".`}
        action={
          <Button href={`/dashboard/umkm/${id}/produk`} variant="outline">
            <Images className="h-4 w-4" /> Kelola Foto Produk
          </Button>
        }
      />
      <UmkmForm umkm={umkm} categories={categories} />
    </div>
  );
}
