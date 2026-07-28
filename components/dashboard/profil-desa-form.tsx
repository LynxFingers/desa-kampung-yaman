"use client";

import { useActionState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { ImageUploadField } from "@/components/dashboard/image-upload-field";
import { updateVillageProfile } from "@/lib/actions/settings.actions";
import type { ActionResult, VillageProfile } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export function ProfilDesaForm({ profile }: { profile: VillageProfile }) {
  const [state, formAction] = useActionState(
    (_prev: ActionResult, formData: FormData) => updateVillageProfile(profile.id, formData),
    initialState
  );

  return (
    <div>
      <PageHeader title="Profil Desa" description="Kelola konten Sejarah, Visi, Misi, Potensi Desa, dan foto sampul halaman Profil Desa." />

      <form action={formAction} className="max-w-2xl space-y-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6">
        {state.message && (
          <div className={`rounded-lg px-4 py-3 text-sm ${state.success ? "bg-green-50 text-[var(--color-success)]" : "bg-red-50 text-[var(--color-error)]"}`}>
            {state.message}
          </div>
        )}
        <ImageUploadField
          name="photo_url"
          label="Foto Profil Desa (Sampul Halaman Profil)"
          defaultValue={profile.photo_url}
          folder="profile"
        />
        <div>
          <Label htmlFor="history">Sejarah Desa</Label>
          <Textarea id="history" name="history" rows={5} defaultValue={profile.history ?? ""} />
        </div>
        <div>
          <Label htmlFor="vision">Visi</Label>
          <Textarea id="vision" name="vision" rows={3} defaultValue={profile.vision ?? ""} />
        </div>
        <div>
          <Label htmlFor="mission">Misi</Label>
          <Textarea id="mission" name="mission" rows={5} defaultValue={profile.mission ?? ""} />
        </div>
        <div>
          <Label htmlFor="potency">Potensi Desa</Label>
          <Textarea id="potency" name="potency" rows={5} defaultValue={profile.potency ?? ""} />
        </div>
        <SubmitButton>Simpan Profil Desa</SubmitButton>
      </form>
    </div>
  );
}
