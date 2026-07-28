"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  BookOpenText,
  Users,
  BarChart3,
  Newspaper,
  Store,
  Image as ImageIcon,
  ShieldCheck,
  LogOut,
  Sprout,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/admins.actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/pengaturan", label: "Pengaturan Website", icon: Settings },
  { href: "/dashboard/profil-desa", label: "Profil Desa", icon: BookOpenText },
  { href: "/dashboard/pemerintahan", label: "Pemerintahan Desa", icon: Users },
  { href: "/dashboard/statistik", label: "Statistik Desa", icon: BarChart3 },
  { href: "/dashboard/berita", label: "Berita", icon: Newspaper },
  { href: "/dashboard/umkm", label: "UMKM", icon: Store },
  { href: "/dashboard/galeri", label: "Galeri", icon: ImageIcon },
  { href: "/dashboard/admin", label: "Manajemen Admin", icon: ShieldCheck },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[var(--color-primary-dark)] text-white">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-base">Desa Kampung Yaman</span>
        </Link>
        <button onClick={onNavigate} className="rounded-full p-1.5 hover:bg-white/10 lg:hidden" aria-label="Tutup menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white",
                active && "bg-white/15 text-white"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut} className="border-t border-white/10 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </form>
    </div>
  );
}
