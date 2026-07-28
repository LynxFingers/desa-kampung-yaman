import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

function buildHref(basePath: string, page: number, searchParams?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Navigasi halaman">
      <Link
        href={buildHref(basePath, Math.max(1, currentPage - 1), searchParams)}
        aria-disabled={currentPage === 1}
        className={cn(
          "rounded-full border border-[var(--color-border)] px-4 py-2 text-sm",
          currentPage === 1 && "pointer-events-none opacity-40"
        )}
      >
        Sebelumnya
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(basePath, page, searchParams)}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium",
            page === currentPage
              ? "bg-[var(--color-primary)] text-white"
              : "border border-[var(--color-border)] hover:bg-[var(--color-primary-light)]"
          )}
        >
          {page}
        </Link>
      ))}
      <Link
        href={buildHref(basePath, Math.min(totalPages, currentPage + 1), searchParams)}
        aria-disabled={currentPage === totalPages}
        className={cn(
          "rounded-full border border-[var(--color-border)] px-4 py-2 text-sm",
          currentPage === totalPages && "pointer-events-none opacity-40"
        )}
      >
        Berikutnya
      </Link>
    </nav>
  );
}
