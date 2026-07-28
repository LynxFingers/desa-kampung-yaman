import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, MessageCircle, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { getUmkmById, getUmkmProducts } from "@/lib/data/umkm";
import { toWhatsAppLink, formatCurrency, getStockStatus } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const umkm = await getUmkmById(id);
  return { title: umkm?.name ?? "UMKM" };
}

export default async function UmkmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [umkm, products] = await Promise.all([getUmkmById(id), getUmkmProducts(id)]);

  if (!umkm) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Link href="/umkm" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke UMKM
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <Reveal direction="left" className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-card)] border-4 border-white bg-[var(--color-accent-light)] shadow-soft-lg">
          {umkm.photo_url ? (
            <Image src={umkm.photo_url} alt={umkm.name} fill className="object-cover" priority />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--color-accent)]">
              <ImageOff className="h-10 w-10" />
            </div>
          )}
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          {umkm.umkm_categories?.name && <Badge className="mb-3">{umkm.umkm_categories.name}</Badge>}
          <h1 className="mb-2 font-display text-3xl text-[var(--color-primary-dark)]">{umkm.name}</h1>
          <p className="mb-6 text-sm text-[var(--color-muted)]">Pemilik: {umkm.owner}</p>

          {umkm.address && (
            <p className="mb-4 flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" /> {umkm.address}
            </p>
          )}

          {umkm.description && (
            <p className="mb-8 whitespace-pre-line leading-relaxed text-[var(--color-foreground)]/90">
              {umkm.description}
            </p>
          )}

          <Button href={toWhatsAppLink(umkm.whatsapp)} variant="accent" size="lg">
            <MessageCircle className="h-4 w-4" /> Hubungi via WhatsApp
          </Button>
        </Reveal>
      </div>

      {products.length > 0 && (
        <div className="mt-16">
          <Reveal direction="up">
            <h2 className="field-underline mb-6 font-display text-2xl text-[var(--color-primary-dark)]">
              Produk ({products.length})
            </h2>
          </Reveal>
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <StaggerItem key={product.id}>
                  <Card className="flex h-full flex-col overflow-hidden p-3">
                    <Link
                      href={`/umkm/${umkm.id}/produk/${product.id}`}
                      className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[var(--color-accent-light)]"
                    >
                      {product.photo_url ? (
                        <Image
                          src={product.photo_url}
                          alt={product.name ?? umkm.name}
                          fill
                          className="object-cover transition-transform duration-500 ease-out hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--color-accent)]">
                          <ImageOff className="h-8 w-8" />
                        </div>
                      )}
                      {stockStatus && (
                        <span
                          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium shadow-soft ${stockStatus.className}`}
                        >
                          {stockStatus.label}
                        </span>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-4 pb-2">
                      <Link href={`/umkm/${umkm.id}/produk/${product.id}`}>
                        <p className="mb-1 line-clamp-1 font-display text-base font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-primary)]">
                          {product.name ?? "Produk"}
                        </p>
                      </Link>
                      <p className="mb-2 text-xs text-[var(--color-muted)]">{umkm.name}</p>

                      {(product.variant || product.type) && (
                        <div className="mb-2 flex flex-wrap gap-1">
                          {product.variant && (
                            <span className="rounded-full bg-[var(--color-primary-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary-dark)]">
                              {product.variant}
                            </span>
                          )}
                          {product.type && (
                            <span className="rounded-full bg-[var(--color-accent-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary-dark)]">
                              {product.type}
                            </span>
                          )}
                        </div>
                      )}

                      {product.caption && (
                        <p className="mb-3 line-clamp-2 text-sm text-[var(--color-muted)]">{product.caption}</p>
                      )}

                      {umkm.address && (
                        <p className="mb-3 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                          <MapPin className="h-3.5 w-3.5 shrink-0" /> {umkm.address}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                        {formatCurrency(product.price) ? (
                          <p className="font-display text-lg font-semibold text-[var(--color-primary)]">
                            {formatCurrency(product.price)}
                          </p>
                        ) : (
                          <span />
                        )}
                        <Button href={`/umkm/${umkm.id}/produk/${product.id}`} size="sm">
                          Detail
                        </Button>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      )}
    </div>
  );
}
