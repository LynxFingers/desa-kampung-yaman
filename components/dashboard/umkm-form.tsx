"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { ImageUploadField } from "@/components/dashboard/image-upload-field";
import { createUmkm, updateUmkm } from "@/lib/actions/umkm.actions";
import { DUSUN_OPTIONS } from "@/lib/validations/schemas";
import type { ActionResult, Umkm, UmkmCategory } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export function UmkmForm({ umkm, categories }: { umkm?: Umkm; categories: UmkmCategory[] }) {
  const action = umkm
    ? (_prev: ActionResult, formData: FormData) => updateUmkm(umkm.id, formData)
    : (_prev: ActionResult, formData: FormData) => createUmkm(formData);

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
          <Label htmlFor="name">Nama Usaha</Label>
          <Input id="name" name="name" defaultValue={umkm?.name ?? ""} required />
        </div>
        <div>
          <Label htmlFor="owner">Nama Pemilik</Label>
          <Input id="owner" name="owner" defaultValue={umkm?.owner ?? ""} required />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="category_id">Kategori</Label>
          <Select id="category_id" name="category_id" defaultValue={umkm?.category_id ?? ""} required>
            <option value="" disabled>Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="dusun">Dusun</Label>
          <Select id="dusun" name="dusun" defaultValue={umkm?.dusun ? String(umkm.dusun) : ""} required>
            <option value="" disabled>Pilih dusun</option>
            {DUSUN_OPTIONS.map((d) => (
              <option key={d} value={d}>Dusun {d}</option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="whatsapp">Nomor HP/WhatsApp</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            inputMode="tel"
            pattern="^(-|[0-9]{9,15})$"
            title='Isi dengan angka saja (contoh: 081234567890), atau tanda "-" jika pemilik tidak memiliki nomor HP.'
            defaultValue={umkm?.whatsapp ?? ""}
            placeholder='0812xxxxxxx atau "-" jika tidak ada'
            required
          />
          <p className="mt-1.5 text-xs text-[var(--color-muted)]">
            Isi dengan angka saja, atau tanda &ldquo;-&rdquo; jika pemilik UMKM belum memiliki nomor HP.
          </p>
        </div>
        <div>
          <Label htmlFor="address">Alamat Usaha</Label>
          <Input id="address" name="address" defaultValue={umkm?.address ?? ""} />
        </div>
      </div>
      <ImageUploadField
        name="photo_url"
        label="Foto Usaha/Produk"
        defaultValue={umkm?.photo_url}
        folder="umkm"
      />
      <div>
        <Label htmlFor="description">Deskripsi Usaha</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={umkm?.description ?? ""} />
      </div>
      <SubmitButton>{umkm ? "Simpan Perubahan" : "Tambah UMKM"}</SubmitButton>
    </form>
  );
}
