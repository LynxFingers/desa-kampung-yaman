import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href, label = "Kembali" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </Link>
  );
}
