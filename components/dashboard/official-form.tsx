"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { ImageUploadField } from "@/components/dashboard/image-upload-field";
import { createOfficial, updateOfficial } from "@/lib/actions/officials.actions";
import type { ActionResult, VillageOfficial } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export function OfficialForm({ official }: { official?: VillageOfficial }) {
  const action = official
    ? (_prev: ActionResult, formData: FormData) => updateOfficial(official.id, formData)
    : (_prev: ActionResult, formData: FormData) => createOfficial(formData);

  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6">
      {state.message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${state.success ? "bg-green-50 text-[var(--color-success)]" : "bg-red-50 text-[var(--color-error)]"}`}>
          {state.message}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input id="name" name="name" defaultValue={official?.name ?? ""} required />
        </div>
        <div>
          <Label htmlFor="position">Jabatan</Label>
          <Input id="position" name="position" defaultValue={official?.position ?? ""} placeholder="Kepala Desa / Sekretaris Desa / dst." required />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="term_period">Masa Jabatan</Label>
          <Input id="term_period" name="term_period" defaultValue={official?.term_period ?? ""} placeholder="2023-2029" />
        </div>
        <div>
          <Label htmlFor="phone">Nomor HP</Label>
          <Input id="phone" name="phone" defaultValue={official?.phone ?? ""} placeholder="0812xxxxxxx" />
        </div>
      </div>
      <div>
        <Label htmlFor="display_order">Urutan Tampil</Label>
        <Input
          id="display_order"
          name="display_order"
          type="number"
          min={0}
          className="max-w-[160px]"
          defaultValue={String(official?.display_order ?? 0)}
        />
      </div>
      <ImageUploadField
        name="photo_url"
        label="Foto Perangkat Desa"
        defaultValue={official?.photo_url}
        folder="officials"
      />
      <div>
        <Label htmlFor="welcome_speech">Sambutan (khusus Kepala Desa)</Label>
        <Textarea id="welcome_speech" name="welcome_speech" rows={4} defaultValue={official?.welcome_speech ?? ""} />
      </div>
      <SubmitButton>{official ? "Simpan Perubahan" : "Tambah Perangkat Desa"}</SubmitButton>
    </form>
  );
}
