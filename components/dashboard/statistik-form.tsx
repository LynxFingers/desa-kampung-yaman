"use client";

import { useActionState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { updateStatistics } from "@/lib/actions/settings.actions";
import type { ActionResult, VillageStatistics } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

const FIELDS: { name: keyof VillageStatistics; label: string; step?: string }[] = [
  { name: "population", label: "Jumlah Penduduk" },
  { name: "male_count", label: "Penduduk Laki-laki" },
  { name: "female_count", label: "Penduduk Perempuan" },
  { name: "total_families", label: "Jumlah Kepala Keluarga (KK)" },
  { name: "total_hamlets", label: "Jumlah Dusun" },
  { name: "total_rt", label: "Jumlah RT" },
  { name: "total_rw", label: "Jumlah RW" },
  { name: "area_size", label: "Luas Wilayah (km²)", step: "0.01" },
];

export function StatistikForm({ statistics }: { statistics: VillageStatistics }) {
  const [state, formAction] = useActionState(
    (_prev: ActionResult, formData: FormData) => updateStatistics(statistics.id, formData),
    initialState
  );

  return (
    <div>
      <PageHeader title="Statistik Desa" description="Perbarui data kependudukan dan wilayah desa secara berkala." />

      <form action={formAction} className="max-w-2xl space-y-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6">
        {state.message && (
          <div className={`rounded-lg px-4 py-3 text-sm ${state.success ? "bg-green-50 text-[var(--color-success)]" : "bg-red-50 text-[var(--color-error)]"}`}>
            {state.message}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={0}
                step={field.step}
                defaultValue={String(statistics[field.name] ?? 0)}
                required
              />
            </div>
          ))}
        </div>
        <SubmitButton>Simpan Statistik</SubmitButton>
      </form>
    </div>
  );
}
