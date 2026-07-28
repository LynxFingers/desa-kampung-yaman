import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageOff, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { getUmkmById, getUmkmProductById } from "@/lib/data/umkm";
import { formatCurrency, getStockStatus, toWhatsAppLink } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = await getUmkmProductById(productId);
  return { title: product?.name ?? "Produk UMKM" };
}

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = await params;
  const [umkm, product] = await Promise.all([getUmkmById(id), getUmkmProductById(productId)]);

  if (!umkm || !product || product.umkm_id !== umkm.id) notFound();

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <Link
        href={`/umkm/${umkm.id}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke {umkm.name}
      </Link>

      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <Reveal direction="left">
          <Card className="relative aspect-square w-full overflow-hidden p-0">
            {product.photo_url ? (
              <Image src={product.photo_url} alt={product.name ?? umkm.name} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[var(--color-accent)]">
                <ImageOff className="h-10 w-10" />
              </div>
            )}
            {stockStatus && (
              <span
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium shadow-soft ${stockStatus.className}`}
              >
                {stockStatus.label}
              </span>
            )}
          </Card>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <Link href={`/umkm/${umkm.id}`}>
            <Badge className="mb-3 hover:bg-[var(--color-primary)] hover:text-white">{umkm.name}</Badge>
          </Link>
          <h1 className="mb-3 font-display text-3xl text-[var(--color-primary-dark)]">{product.name ?? "Produk"}</h1>

          {(product.variant || product.type) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {product.variant && (
                <span className="rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-medium text-[var(--color-primary-dark)]">
                  {product.variant}
                </span>
              )}
              {product.type && (
                <span className="rounded-full bg-[var(--color-accent-light)] px-3 py-1 text-xs font-medium text-[var(--color-primary-dark)]">
                  {product.type}
                </span>
              )}
            </div>
          )}

          {formatCurrency(product.price) && (
            <p className="mb-4 font-display text-3xl font-semibold text-[var(--color-primary)]">
              {formatCurrency(product.price)}
            </p>
          )}

          {product.caption && (
            <p className="mb-6 leading-relaxed text-[var(--color-muted)]">{product.caption}</p>
          )}

          {umkm.address && (
            <p className="mb-6 flex items-start gap-2 text-sm text-[var(--color-muted)]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" /> {umkm.address}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button href={toWhatsAppLink(umkm.whatsapp)} variant="accent" size="lg">
              <MessageCircle className="h-4 w-4" /> Tanya via WhatsApp
            </Button>
            <Button href={`/umkm/${umkm.id}`} variant="outline" size="lg">
              Lihat Semua Produk {umkm.name}
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
