import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/public/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { searchAll, type SearchCategory, type SearchResultItem } from "@/lib/data/search";

export const metadata: Metadata = { title: "Hasil Pencarian" };

const SECTION_LABELS: Record<SearchCategory, string> = {
  berita: "Berita",
  umkm: "UMKM",
  produk: "Produk UMKM",
  galeri: "Galeri",
  aparatur: "Aparatur Desa",
};

function ResultCard({ item }: { item: SearchResultItem }) {
  return (
    <Link href={item.href}>
      <Card className="group flex h-full items-center gap-4 overflow-hidden p-4">
        <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--color-primary-light)]">
          {item.image ? (
            <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--color-primary)]">
              <ImageOff className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-1 font-display text-sm font-semibold text-[var(--color-primary-dark)]">{item.title}</p>
          {item.subtitle && <p className="line-clamp-1 text-xs text-[var(--color-muted)]">{item.subtitle}</p>}
        </div>
      </Card>
    </Link>
  );
}

export default async function PencarianPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = (typeof params.kategori === "string" ? params.kategori : "semua") as SearchCategory | "semua";
  const results = q ? await searchAll(q, category) : null;

  const sections = (["berita", "umkm", "produk", "galeri", "aparatur"] as SearchCategory[])
    .filter((key) => category === "semua" || category === key)
    .map((key) => ({ key, label: SECTION_LABELS[key], items: results?.[key] ?? [] }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal direction="up">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Pencarian</p>
        <h1 className="mb-8 font-display text-4xl text-[var(--color-primary-dark)]">Hasil Pencarian</h1>
      </Reveal>

      <Reveal direction="up" delay={0.05} className="mb-10">
        <SearchBar defaultValue={q} defaultCategory={category} />
      </Reveal>

      {!q && (
        <EmptyState title="Masukkan kata kunci pencarian" description="Cari berita, UMKM, produk, galeri, atau aparatur desa." />
      )}

      {q && results && results.total === 0 && (
        <EmptyState
          title={`Tidak ada hasil untuk "${q}"`}
          description="Coba gunakan kata kunci lain, atau periksa kembali ejaannya."
        />
      )}

      {q && sections.length > 0 && (
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.key}>
              <h2 className="field-underline mb-6 font-display text-xl text-[var(--color-primary-dark)]">
                {section.label} <span className="text-sm font-normal text-[var(--color-muted)]">({section.items.length})</span>
              </h2>
              <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <StaggerItem key={item.id}>
                    <ResultCard item={item} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
