"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/types/database";

interface DeleteButtonProps {
  action: () => Promise<ActionResult>;
  confirmMessage: string;
  className?: string;
}

export function DeleteButton({ action, confirmMessage, className }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          const result = await action();
          if (!result.success) {
            window.alert(result.message ?? "Terjadi kesalahan.");
          }
        });
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-error)] px-3 py-1.5 text-xs font-medium text-[var(--color-error)] hover:bg-red-50 disabled:opacity-50",
        className
      )}
    >
      <Trash2 className="h-3.5 w-3.5" />
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}
