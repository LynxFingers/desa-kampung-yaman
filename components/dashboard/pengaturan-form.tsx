"use client";

import { useActionState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { ImageUploadField } from "@/components/dashboard/image-upload-field";
import { updateSiteSettings } from "@/lib/actions/settings.actions";
import type { ActionResult, SiteSettings } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export function PengaturanForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(
    (_prev: ActionResult, formData: FormData) => updateSiteSettings(settings.id, formData),
    initialState
  );

  return (
    <div>
      <PageHeader title="Pengaturan Website" description="Identitas dan informasi kontak resmi desa yang tampil di seluruh halaman publik." />

      <form action={formAction} className="max-w-2xl space-y-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6">
        {state.message && (
          <div className={`rounded-lg px-4 py-3 text-sm ${state.success ? "bg-green-50 text-[var(--color-success)]" : "bg-red-50 text-[var(--color-error)]"}`}>
            {state.message}
          </div>
        )}

        <div>
          <Label htmlFor="village_name">Nama Desa</Label>
          <Input id="village_name" name="village_name" defaultValue={settings.village_name} required />
        </div>
        <div>
          <Label htmlFor="motto">Motto Desa</Label>
          <Input id="motto" name="motto" defaultValue={settings.motto ?? ""} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageUploadField name="logo_url" label="Logo Desa" defaultValue={settings.logo_url} folder="settings/logo" />
          <ImageUploadField
            name="hero_image_url"
            label="Hero Image Beranda"
            defaultValue={settings.hero_image_url}
            folder="settings/hero"
          />
        </div>
        <div>
          <Label htmlFor="address">Alamat Kantor Desa</Label>
          <Input id="address" name="address" defaultValue={settings.address ?? ""} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={settings.email ?? ""} />
          </div>
          <div>
            <Label htmlFor="phone">Telepon</Label>
            <Input id="phone" name="phone" defaultValue={settings.phone ?? ""} />
          </div>
        </div>
        <div>
          <Label htmlFor="maps_url">Tautan Google Maps (embed)</Label>
          <Input id="maps_url" name="maps_url" defaultValue={settings.maps_url ?? ""} placeholder="https://www.google.com/maps/embed?..." />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="facebook_url">Facebook</Label>
            <Input id="facebook_url" name="facebook_url" defaultValue={settings.facebook_url ?? ""} />
          </div>
          <div>
            <Label htmlFor="instagram_url">Instagram</Label>
            <Input id="instagram_url" name="instagram_url" defaultValue={settings.instagram_url ?? ""} />
          </div>
        </div>

        <SubmitButton>Simpan Pengaturan</SubmitButton>
      </form>
    </div>
  );
}
