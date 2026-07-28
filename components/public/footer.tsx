import Link from "next/link";
import { Link2, MapPin, Mail, Phone, Sprout } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { SiteSettings } from "@/types/database";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-10 overflow-hidden rounded-t-[2.5rem] rounded-b-[1.75rem] bg-[var(--color-primary-dark)] text-white/90 sm:rounded-b-[2.5rem]">
      <Reveal direction="up" className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Sprout className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-lg text-white">{settings.village_name}</span>
          </div>
          <p className="max-w-xs text-sm text-white/70">
            {settings.motto ?? "Website resmi pemerintahan desa untuk masyarakat."}
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Tautan Cepat</p>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/profil-desa" className="hover:text-white">Profil Desa</Link></li>
            <li><Link href="/pemerintahan" className="hover:text-white">Pemerintahan Desa</Link></li>
            <li><Link href="/berita" className="hover:text-white">Berita</Link></li>
            <li><Link href="/umkm" className="hover:text-white">UMKM</Link></li>
            <li><Link href="/galeri" className="hover:text-white">Galeri</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Kontak</p>
          <ul className="space-y-2.5 text-sm text-white/80">
            {settings.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {settings.address}
              </li>
            )}
            {settings.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> {settings.phone}
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> {settings.email}
              </li>
            )}
          </ul>
          <div className="mt-4 flex gap-3">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Facebook">
                <Link2 className="h-4 w-4" />
              </a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Instagram">
                <Link2 className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </Reveal>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {settings.village_name}. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
