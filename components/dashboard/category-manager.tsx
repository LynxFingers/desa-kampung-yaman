"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { createUmkmCategory, updateUmkmCategory, deleteUmkmCategory } from "@/lib/actions/umkm.actions";
import type { ActionResult, UmkmCategory } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

function CategoryRow({ category }: { category: UmkmCategory }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(
    (_prev: ActionResult, formData: FormData) => updateUmkmCategory(category.id, formData),
    initialState
  );

  useEffect(() => {
    if (state.success) setEditing(false);
  }, [state.success]);

  if (editing) {
    return (
      <li className="px-5 py-3">
        <form action={formAction} className="flex items-center gap-2">
          <Input name="name" defaultValue={category.name} required autoFocus className="flex-1" />
          <SubmitButton pendingText="Menyimpan..." variant="outline">
            Simpan
          </SubmitButton>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-full border border-[var(--color-border)] p-2 hover:bg-[var(--color-primary-light)]"
            aria-label="Batal"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </form>
        {state.message && !state.success && (
          <p className="mt-2 text-sm text-[var(--color-error)]">{state.message}</p>
        )}
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between px-5 py-3">
      <span className="text-sm font-medium">{category.name}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--color-primary-light)]"
        >
          <Pencil className="h-3.5 w-3.5" /> Ubah
        </button>
        <DeleteButton
          action={deleteUmkmCategory.bind(null, category.id)}
          confirmMessage={`Hapus kategori "${category.name}"? Kategori yang masih digunakan UMKM tidak dapat dihapus.`}
        />
      </div>
    </li>
  );
}

export function CategoryManager({ categories }: { categories: UmkmCategory[] }) {
  const [state, formAction] = useActionState(
    (_prev: ActionResult, formData: FormData) => createUmkmCategory(formData),
    initialState
  );
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.success) setFormKey((prev) => prev + 1);
  }, [state.success]);

  return (
    <div className="max-w-xl">
      <form
        key={formKey}
        action={formAction}
        className="mb-6 flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5"
      >
        <div className="flex-1">
          <Input name="name" placeholder="Nama kategori baru, contoh: Makanan" required />
          {state.message && (
            <p className={`mt-2 text-sm ${state.success ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}>
              {state.message}
            </p>
          )}
        </div>
        <SubmitButton pendingText="Menyimpan...">Tambah</SubmitButton>
      </form>

      {categories.length > 0 ? (
        <ul className="divide-y divide-[var(--color-border)] rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white">
          {categories.map((cat) => (
            <CategoryRow key={cat.id} category={cat} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--color-muted)]">Belum ada kategori. Tambahkan kategori pertama di atas.</p>
      )}
    </div>
  );
}
