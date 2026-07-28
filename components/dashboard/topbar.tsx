"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import type { Admin } from "@/types/database";

export function Topbar({ admin }: { admin: Admin | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-4 py-4 lg:px-8">
      <button className="rounded-lg p-2 hover:bg-[var(--color-primary-light)] lg:hidden" onClick={() => setOpen(true)} aria-label="Buka menu">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden lg:block" />
      <div className="text-right">
        <p className="text-sm font-medium">{admin?.name ?? "Admin"}</p>
        <p className="text-xs text-[var(--color-muted)]">
          {admin?.role === "super_admin" ? "Super Admin" : "Admin Operator"}
        </p>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-72">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}
