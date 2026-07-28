"use client";

import { useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { ImageUploadField } from "@/components/dashboard/image-upload-field";
import { createGalleryItem } from "@/lib/actions/gallery.actions";
import type { ActionResult } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export function GalleryForm() {
  const [state, formAction] = useActionState(
    (_prev: ActionResult, formData: FormData) => createGalleryItem(formData),
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
      <div>
        <Label htmlFor="title">Judul Foto</Label>
        <Input id="title" name="title" required />
      </div>
      <ImageUploadField name="photo_url" label="Foto Galeri" folder="gallery" />
      <div>
        <Label htmlFor="taken_at">Tanggal</Label>
        <Input id="taken_at" name="taken_at" type="date" />
      </div>
      <SubmitButton pendingText="Mengunggah...">Tambah ke Galeri</SubmitButton>
    </form>
  );
}
