"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  { value: "semua", label: "Semua Kategori" },
  { value: "berita", label: "Berita" },
  { value: "umkm", label: "UMKM" },
  { value: "produk", label: "Produk UMKM" },
  { value: "galeri", label: "Galeri" },
  { value: "aparatur", label: "Aparatur Desa" },
];

/**
 * Global search box used both as the floating box under the homepage hero
 * and as the search field on /pencarian. Always routes to the unified
 * /pencarian results page (grouped by category) instead of hard-coding
 * /berita, which used to make an "UMKM" search incorrectly land on news.
 */
export function SearchBar({
  placeholder = "Cari berita, UMKM, produk, galeri...",
  defaultValue = "",
  defaultCategory = "semua",
  size = "md",
}: {
  placeholder?: string;
  defaultValue?: string;
  defaultCategory?: string;
  size?: "md" | "lg";
}) {
  const [query, setQuery] = useState(defaultValue);
  const [category, setCategory] = useState(defaultCategory);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query.trim() });
    if (category !== "semua") params.set("kategori", category);
    router.push(`/pencarian?${params.toString()}`);
  }

  const isLarge = size === "lg";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-3 rounded-3xl bg-white p-3 shadow-float transition-shadow duration-300 hover:shadow-[0_24px_70px_rgba(22,63,39,0.22)] sm:flex-row sm:items-center sm:gap-2 sm:p-2.5 ${
        isLarge ? "sm:p-3" : ""
      }`}
    >
      <div className="flex flex-1 items-center gap-2 rounded-full px-3 py-1">
        <Search className="h-4 w-4 shrink-0 text-[var(--color-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent py-2.5 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)]"
        />
      </div>

      <div className="hidden h-8 w-px bg-[var(--color-border)] sm:block" />

      <div className="flex items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-w-0 flex-1 rounded-full border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none sm:flex-none sm:border-none sm:bg-transparent"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-white shadow-soft transition-all duration-300 hover:scale-105 hover:bg-[var(--color-primary-dark)] hover:shadow-soft-lg active:scale-95 sm:px-6"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Cari</span>
        </button>
      </div>
    </form>
  );
}
