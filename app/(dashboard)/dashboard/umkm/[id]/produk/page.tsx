import Image from "next/image";
import { notFound } from "next/navigation";
import { ImageOff } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { BackLink } from "@/components/dashboard/back-link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { ProductPhotoForm } from "@/components/dashboard/product-photo-form";
import { getUmkmById, getUmkmProducts } from "@/lib/data/umkm";
import { deleteUmkmProduct } from "@/lib/actions/umkm-products.actions";
import { formatCurrency } from "@/lib/utils";

export default async function UmkmProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [umkm, products] = await Promise.all([getUmkmById(id), getUmkmProducts(id)]);
  if (!umkm) notFound();

  return (
    <div>
      <BackLink href={`/dashboard/umkm/${id}`} label="Kembali ke Data UMKM" />
      <PageHeader
        title="Produk UMKM"
        description={`Kelola daftar produk "${umkm.name}" lengkap dengan foto, harga, rasa/varian, dan tipe. Bagian ini bersifat opsional.`}
      />

      <ProductPhotoForm umkmId={id} />

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white">
              <div className="relative aspect-square w-full bg-[var(--color-accent-light)]">
                {product.photo_url ? (
                  <Image src={product.photo_url} alt={product.name ?? umkm.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--color-accent)]">
                    <ImageOff className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="mb-1 line-clamp-1 text-sm font-medium">{product.name ?? "Tanpa nama"}</p>
                {formatCurrency(product.price) && (
                  <p className="mb-1.5 text-sm font-semibold text-[var(--color-primary)]">{formatCurrency(product.price)}</p>
                )}
                <div className="mb-2 flex flex-wrap gap-1">
                  {product.variant && <Badge className="text-[10px]">{product.variant}</Badge>}
                  {product.type && <Badge className="text-[10px]">{product.type}</Badge>}
                  {product.stock !== null && product.stock !== undefined && (
                    <Badge className="text-[10px]">Stok: {product.stock}</Badge>
                  )}
                </div>
                <DeleteButton
                  action={deleteUmkmProduct.bind(null, product.id, id, product.photo_url)}
                  confirmMessage={`Hapus produk "${product.name ?? "ini"}"?`}
                  className="w-full justify-center"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum ada produk"
          description="Tambahkan produk (foto, harga, rasa/varian, tipe) agar pengunjung lebih mengenal UMKM ini. Bagian ini opsional."
        />
      )}
    </div>
  );
}
