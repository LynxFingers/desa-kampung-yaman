"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Sprout, Search, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/profil-desa", label: "Profil Desa" },
  { href: "/pemerintahan", label: "Pemerintahan" },
  { href: "/berita", label: "Berita" },
  { href: "/umkm", label: "UMKM" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

export function Header({
  villageName,
  logoUrl,
}: {
  villageName: string;
  logoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <header
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white bg-white/90 px-3 shadow-soft backdrop-blur-md transition-all duration-300 ease-out",
          scrolled ? "py-2 shadow-soft-lg" : "py-3"
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 pl-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={villageName} width={36} height={36} className="rounded-full" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
              <Sprout className="h-5 w-5" />
            </span>
          )}
          <span className="font-display text-base font-semibold text-[var(--color-primary-dark)] sm:text-lg">
            {villageName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-primary-light)]",
                pathname === item.href && "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 pr-1 sm:gap-2">
          <Link
            href="/pencarian"
            aria-label="Cari"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-[var(--color-foreground)] transition-all hover:scale-105 hover:bg-[var(--color-primary-light)] sm:inline-flex"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>

          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all duration-300 hover:scale-105 hover:bg-[var(--color-primary-dark)] hover:shadow-soft-lg sm:inline-flex"
          >
            <LayoutDashboard className="h-4 w-4" />
            Login Admin
          </Link>

          <button
            className="rounded-full p-2.5 hover:bg-[var(--color-primary-light)] lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Buka menu navigasi"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-white bg-white/95 p-3 shadow-soft-lg backdrop-blur-md lg:hidden">
          <Link
            href="/pencarian"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--color-primary-light)]"
          >
            <Search className="h-4 w-4" /> Cari
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-2xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--color-primary-light)]",
                pathname === item.href && "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-3 py-3 text-sm font-medium text-white"
          >
            <LayoutDashboard className="h-4 w-4" /> Login Admin
          </Link>
        </nav>
      )}
    </motion.div>
  );
}
