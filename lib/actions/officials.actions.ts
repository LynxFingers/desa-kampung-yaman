"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { officialSchema } from "@/lib/validations/schemas";
import { logActivity } from "@/lib/data/admins";
import type { ActionResult } from "@/types/database";

function parseOfficialForm(formData: FormData) {
  return officialSchema.safeParse({
    name: formData.get("name"),
    position: formData.get("position"),
    term_period: formData.get("term_period") ?? "",
    photo_url: formData.get("photo_url") ?? "",
    phone: formData.get("phone") ?? "",
    display_order: formData.get("display_order") ?? 0,
    welcome_speech: formData.get("welcome_speech") ?? "",
  });
}

export async function createOfficial(formData: FormData): Promise<ActionResult> {
  const parsed = parseOfficialForm(formData);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("village_officials").insert({
    ...parsed.data,
    term_period: parsed.data.term_period || null,
    photo_url: parsed.data.photo_url || null,
    phone: parsed.data.phone || null,
    welcome_speech: parsed.data.welcome_speech || null,
  });

  if (error) return { success: false, message: "Gagal menyimpan data perangkat desa." };

  await logActivity("village_officials", "create", `Menambahkan perangkat desa "${parsed.data.name}"`);
  revalidatePath("/pemerintahan");
  revalidatePath("/dashboard/pemerintahan");
  revalidatePath("/");
  return { success: true, message: "Data perangkat desa berhasil disimpan." };
}

export async function updateOfficial(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseOfficialForm(formData);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("village_officials")
    .update({
      ...parsed.data,
      term_period: parsed.data.term_period || null,
      photo_url: parsed.data.photo_url || null,
      phone: parsed.data.phone || null,
      welcome_speech: parsed.data.welcome_speech || null,
    })
    .eq("id", id);

  if (error) return { success: false, message: "Gagal memperbarui data perangkat desa." };

  await logActivity("village_officials", "update", `Memperbarui perangkat desa "${parsed.data.name}"`);
  revalidatePath("/pemerintahan");
  revalidatePath("/dashboard/pemerintahan");
  revalidatePath("/");
  return { success: true, message: "Data perangkat desa berhasil diperbarui." };
}

export async function deleteOfficial(id: string, name: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("village_officials").delete().eq("id", id);
  if (error) return { success: false, message: "Gagal menghapus data perangkat desa." };

  await logActivity("village_officials", "delete", `Menghapus perangkat desa "${name}"`);
  revalidatePath("/pemerintahan");
  revalidatePath("/dashboard/pemerintahan");
  revalidatePath("/");
  return { success: true, message: "Data perangkat desa berhasil dihapus." };
}
