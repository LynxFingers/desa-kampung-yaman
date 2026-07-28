"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { signIn } from "@/lib/actions/admins.actions";
import type { ActionResult } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export default function LoginPage() {
  const [state, formAction] = useActionState(
    (_prev: ActionResult, formData: FormData) => signIn(formData),
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-light)]/40 px-4">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-white bg-white p-8 shadow-soft-lg">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] transition-all duration-300 hover:-translate-x-0.5 hover:bg-[var(--color-primary-light)]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>

        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
            <Sprout className="h-6 w-6" />
          </span>
          <h1 className="font-display text-2xl text-[var(--color-primary-dark)]">Masuk Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Sistem Informasi Desa Kampung Yaman</p>
        </div>

        <form action={formAction} className="space-y-4">
          {state.message && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">{state.message}</div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="admin@kampungyaman.desa.id" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
          <SubmitButton pendingText="Memproses..." className="w-full">
            Masuk
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
