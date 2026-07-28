import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 disabled:active:scale-100",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-primary)] text-white shadow-soft hover:bg-[var(--color-primary-dark)] hover:shadow-soft-lg",
        outline:
          "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]",
        ghost: "text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]",
        accent: "bg-[var(--color-accent)] text-white shadow-soft hover:brightness-95 hover:shadow-soft-lg",
        danger: "bg-[var(--color-error)] text-white hover:brightness-90",
      },
      size: {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-5 py-2.5",
        lg: "text-base px-6 py-3",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({ className, variant, size, href, target, rel, ...props }: ButtonProps) {
  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        target={target ?? (isExternal ? "_blank" : undefined)}
        rel={rel ?? (isExternal ? "noreferrer" : undefined)}
        className={cn(buttonVariants({ variant, size }), className)}
      >
        {props.children as React.ReactNode}
      </Link>
    );
  }
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
