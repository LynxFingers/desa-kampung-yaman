import Image from "next/image";
import { Users, Home as HomeIcon, MapPinned, Ruler, UserRound, Store, Sprout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/public/section-heading";
import { SearchBar } from "@/components/public/search-bar";
import { StatCard } from "@/components/public/stat-card";
import { OfficialCard } from "@/components/public/official-card";
import { NewsCard } from "@/components/public/news-card";
import { UmkmCard } from "@/components/public/umkm-card";
import { GalleryCard } from "@/components/public/gallery-card";
import { MapEmbed } from "@/components/public/map-embed";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { getSiteSettings, getVillageStatistics } from "@/lib/data/settings";
import { getOfficials, getHeadOfVillage } from "@/lib/data/officials";
import { getLatestNews } from "@/lib/data/news";
import { getFeaturedUmkm, getUmkmCategoryCounts } from "@/lib/data/umkm";
import { getLatestGallery } from "@/lib/data/gallery";
import { formatNumber } from "@/lib/utils";

export default async function BerandaPage() {
  const [settings, statistics, officials, news, umkm, gallery, umkmCategoryCounts] = await Promise.all([
    getSiteSettings(),
    getVillageStatistics(),
    getOfficials(5),
    getLatestNews(3),
    getFeaturedUmkm(3),
    getLatestGallery(5),
    getUmkmCategoryCounts(),
  ]);

  const headOfVillage = await getHeadOfVillage(officials);

  return (
    <>
      {/* Hero */}
      <section className="px-2 pt-2 sm:px-4 sm:pt-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] sm:aspect-auto sm:h-[650px] sm:rounded-[2rem]">
          <div className="absolute inset-0">
            {settings.hero_image_url ? (
              <Image src={settings.hero_image_url} alt={settings.village_name} fill priority className="object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>

          <div className="relative mx-auto flex h-full max-w-6xl flex-col items-start justify-center gap-6 px-6 sm:px-10">
            <Reveal direction="fade">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur">
                <Sprout className="h-3.5 w-3.5" /> Website Resmi Pemerintah Desa
              </span>
            </Reveal>
            <Reveal direction="left" delay={0.1}>
              <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
                {settings.village_name}
              </h1>
            </Reveal>
            {settings.motto && (
              <Reveal direction="fade" delay={0.25}>
                <p className="max-w-lg text-lg text-white/90">{settings.motto}</p>
              </Reveal>
            )}
            <Reveal direction="up" delay={0.4}>
              <Button href="/profil-desa" variant="accent" size="lg">
                Jelajahi Desa <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Floating Search Box, on a soft green panel overlapping the hero */}
      <div className="relative z-10 mx-auto -mt-10 max-w-4xl px-4 sm:-mt-14 sm:px-6">
        <Reveal direction="up" delay={0.1}>
          <div className="rounded-[2rem] bg-[var(--color-primary-light)] p-3 shadow-soft-lg sm:p-4">
            <SearchBar size="lg" />
          </div>
        </Reveal>
      </div>

      {/* Sambutan Kepala Desa */}
      {headOfVillage && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal direction="left" className="relative mx-auto w-full max-w-md">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-card)] border-4 border-white bg-[var(--color-primary-light)] shadow-soft-lg">
                {headOfVillage.photo_url ? (
                  <Image src={headOfVillage.photo_url} alt={headOfVillage.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--color-primary)]">
                    <UserRound className="h-20 w-20" />
                  </div>
                )}
              </div>
              <span className="animate-float absolute -bottom-5 -right-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)] text-center text-xs font-medium text-white shadow-soft-lg">
                <Sprout className="h-8 w-8" />
              </span>
            </Reveal>

            <Reveal direction="right" delay={0.1}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Sambutan {headOfVillage.position}
              </p>
              <h2 className="mb-4 font-display text-3xl text-[var(--color-primary-dark)]">Selamat Datang</h2>
              <p className="mb-6 leading-relaxed text-[var(--color-muted)]">
                {headOfVillage.welcome_speech ??
                  `Selamat datang di website resmi ${settings.village_name}. Semoga informasi yang tersedia dapat bermanfaat bagi kita semua.`}
              </p>
              <div className="mb-6">
                <p className="font-display font-semibold text-[var(--color-primary-dark)]">{headOfVillage.name}</p>
                <p className="text-sm text-[var(--color-muted)]">{headOfVillage.position}</p>
              </div>
              <Button href="/pemerintahan" variant="primary">
                Kenali Perangkat Desa <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </div>
        </section>
      )}

      {/* Statistik */}
      <section className="bg-[var(--color-primary-light)] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal direction="up">
            <SectionHeading eyebrow="Data Desa" title="Statistik Kampung Yaman" />
          </Reveal>
          <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StaggerItem><StatCard icon={Users} label="Jumlah Penduduk" value={statistics.population} /></StaggerItem>
            <StaggerItem><StatCard icon={HomeIcon} label="Kepala Keluarga" value={statistics.total_families} /></StaggerItem>
            <StaggerItem><StatCard icon={MapPinned} label="Jumlah Dusun" value={statistics.total_hamlets} /></StaggerItem>
            <StaggerItem><StatCard icon={Ruler} label="Luas Wilayah" value={statistics.area_size ?? 0} suffix=" km²" /></StaggerItem>
            <StaggerItem><StatCard icon={Store} label="Total UMKM" value={umkmCategoryCounts.total} /></StaggerItem>
          </StaggerGroup>

          {umkmCategoryCounts.categories.some((cat) => cat.total > 0) && (
            <Reveal direction="up" delay={0.15} className="mt-6 rounded-[var(--radius-card)] border border-white bg-white p-6 shadow-soft">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                UMKM Berdasarkan Kategori
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {umkmCategoryCounts.categories
                  .filter((cat) => cat.total > 0)
                  .map((cat) => (
                    <div
                      key={cat.id}
                      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3"
                    >
                      <p className="font-display text-lg text-[var(--color-primary-dark)]">{formatNumber(cat.total)}</p>
                      <p className="line-clamp-1 text-xs text-[var(--color-muted)]">{cat.name}</p>
                    </div>
                  ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Perangkat Desa */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal direction="up">
          <SectionHeading
            eyebrow="Pemerintahan"
            title="Perangkat Desa"
            action={<Button href="/pemerintahan" variant="outline">Lihat Semua</Button>}
          />
        </Reveal>
        {officials.length > 0 ? (
          <StaggerGroup className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {officials.map((official) => (
              <StaggerItem key={official.id}>
                <OfficialCard official={official} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState title="Belum ada data perangkat desa" description="Admin dapat menambahkan data melalui dashboard." />
        )}
      </section>

      {/* Berita */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal direction="up">
            <SectionHeading
              eyebrow="Informasi Terkini"
              title="Berita Terbaru"
              action={<Button href="/berita" variant="outline">Lihat Semua</Button>}
            />
          </Reveal>
          {news.length > 0 ? (
            <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <StaggerItem key={item.id}>
                  <NewsCard news={item} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <EmptyState title="Belum ada berita" description="Berita yang dipublikasikan admin akan tampil di sini." />
          )}
        </div>
      </section>

      {/* UMKM */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal direction="up">
          <SectionHeading
            eyebrow="Ekonomi Desa"
            title="UMKM Unggulan"
            action={<Button href="/umkm" variant="outline">Lihat Semua</Button>}
          />
        </Reveal>
        {umkm.length > 0 ? (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {umkm.map((item) => (
              <StaggerItem key={item.id}>
                <UmkmCard umkm={item} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState title="Belum ada UMKM terdaftar" description="Promosikan usaha warga melalui dashboard admin." />
        )}
      </section>

      {/* Galeri */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal direction="up">
            <SectionHeading
              eyebrow="Dokumentasi"
              title="Galeri Desa"
              action={<Button href="/galeri" variant="outline">Lihat Semua</Button>}
            />
          </Reveal>
          {gallery.length > 0 ? (
            <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {gallery.map((item) => (
                <StaggerItem key={item.id} direction="zoom">
                  <GalleryCard item={item} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <EmptyState title="Belum ada foto galeri" />
          )}
        </div>
      </section>

      {/* Peta */}
      {settings.maps_url && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal direction="up">
            <SectionHeading eyebrow="Lokasi" title="Peta Desa" />
            <MapEmbed mapsUrl={settings.maps_url} villageName={settings.village_name} />
          </Reveal>
        </section>
      )}
    </>
  );
}
