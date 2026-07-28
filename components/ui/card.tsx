import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-white bg-[var(--color-card)] shadow-soft transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-soft-lg",
        className
      )}
      {...props}
    />
  );
}
