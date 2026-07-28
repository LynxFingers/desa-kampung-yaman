"use client";

import { useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { ImageUploadField } from "@/components/dashboard/image-upload-field";
import { createUmkmProduct } from "@/lib/actions/umkm-products.actions";
import type { ActionResult } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export function ProductPhotoForm({ umkmId }: { umkmId: string }) {
  const [state, formAction] = useActionState(
    (_prev: ActionResult, formData: FormData) => createUmkmProduct(umkmId, formData),
    initialState
  );
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.success) setFormKey((prev) => prev + 1);
  }, [state.success]);

  return (
    <form
      key={formKey}
      action={formAction}
      className="mb-8 max-w-xl space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5"
    >
      {state.message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${state.success ? "bg-green-50 text-[var(--color-success)]" : "bg-red-50 text-[var(--color-error)]"}`}>
          {state.message}
        </div>
      )}
      <ImageUploadField name="photo_url" label="Foto Produk" folder="umkm-products" />
      <div>
        <Label htmlFor="name">Nama Produk</Label>
        <Input id="name" name="name" placeholder="Contoh: Keripik Singkong" maxLength={150} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input id="price" name="price" type="number" min={0} step="500" placeholder="15000" />
        </div>
        <div>
          <Label htmlFor="stock">Stok</Label>
          <Input id="stock" name="stock" type="number" min={0} step="1" placeholder="Contoh: 40" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="variant">Rasa / Varian</Label>
          <Input id="variant" name="variant" placeholder="Pedas, Original, dll." maxLength={100} />
        </div>
        <div>
          <Label htmlFor="type">Tipe / Kemasan</Label>
          <Input id="type" name="type" placeholder="250gr, 500gr, dll." maxLength={100} />
        </div>
      </div>
      <div>
        <Label htmlFor="caption">Deskripsi Singkat (opsional)</Label>
        <Input id="caption" name="caption" placeholder="Contoh: Nutritious, fiber-rich, and wholesome loaves." maxLength={150} />
      </div>
      <p className="text-xs text-[var(--color-muted)]">
        Semua field selain foto bersifat opsional — isi sesuai kebutuhan produk UMKM ini.
      </p>
      <SubmitButton pendingText="Mengunggah...">Tambah Produk</SubmitButton>
    </form>
  );
}
