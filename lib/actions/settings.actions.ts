"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { statisticsSchema, profileSchema, settingsSchema } from "@/lib/validations/schemas";
import { logActivity } from "@/lib/data/admins";
import type { ActionResult } from "@/types/database";

export async function updateStatistics(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = statisticsSchema.safeParse({
    population: formData.get("population"),
    total_families: formData.get("total_families"),
    total_hamlets: formData.get("total_hamlets"),
    total_rt: formData.get("total_rt"),
    total_rw: formData.get("total_rw"),
    male_count: formData.get("male_count"),
    female_count: formData.get("female_count"),
    area_size: formData.get("area_size"),
  });

  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("village_statistics")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, message: "Gagal memperbarui statistik desa." };

  await logActivity("village_statistics", "update", "Memperbarui statistik desa");
  revalidatePath("/dashboard/statistik");
  revalidatePath("/");
  return { success: true, message: "Statistik desa berhasil diperbarui." };
}

export async function updateVillageProfile(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = profileSchema.safeParse({
    history: formData.get("history") ?? "",
    vision: formData.get("vision") ?? "",
    mission: formData.get("mission") ?? "",
    potency: formData.get("potency") ?? "",
    photo_url: formData.get("photo_url") ?? "",
  });

  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("village_profile")
    .update({ ...parsed.data, photo_url: parsed.data.photo_url || null })
    .eq("id", id);

  if (error) return { success: false, message: "Gagal memperbarui profil desa." };

  await logActivity("village_profile", "update", "Memperbarui profil desa");
  revalidatePath("/dashboard/profil-desa");
  revalidatePath("/profil-desa");
  return { success: true, message: "Profil desa berhasil diperbarui." };
}

export async function updateSiteSettings(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse({
    village_name: formData.get("village_name"),
    motto: formData.get("motto") ?? "",
    address: formData.get("address") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    maps_url: formData.get("maps_url") ?? "",
    facebook_url: formData.get("facebook_url") ?? "",
    instagram_url: formData.get("instagram_url") ?? "",
    logo_url: formData.get("logo_url") ?? "",
    hero_image_url: formData.get("hero_image_url") ?? "",
  });

  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      ...parsed.data,
      logo_url: parsed.data.logo_url || null,
      hero_image_url: parsed.data.hero_image_url || null,
    })
    .eq("id", id);

  if (error) return { success: false, message: "Gagal memperbarui pengaturan situs." };

  await logActivity("site_settings", "update", "Memperbarui pengaturan situs");
  revalidatePath("/dashboard/pengaturan");
  revalidatePath("/", "layout");
  return { success: true, message: "Pengaturan situs berhasil diperbarui." };
}
