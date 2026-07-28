"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { createAdmin } from "@/lib/actions/admins.actions";
import type { ActionResult } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export function AdminForm() {
  const [state, formAction] = useActionState(
    (_prev: ActionResult, formData: FormData) => createAdmin(formData),
    initialState
  );

  return (
    <form action={formAction} className="mb-8 max-w-xl space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5">
      {state.message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${state.success ? "bg-green-50 text-[var(--color-success)]" : "bg-red-50 text-[var(--color-error)]"}`}>
          {state.message}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" minLength={8} required />
        </div>
        <div>
          <Label htmlFor="role">Peran</Label>
          <Select id="role" name="role" defaultValue="operator">
            <option value="operator">Admin Operator</option>
            <option value="super_admin">Super Admin</option>
          </Select>
        </div>
      </div>
      <SubmitButton pendingText="Menyimpan...">Tambah Admin</SubmitButton>
    </form>
  );
}
