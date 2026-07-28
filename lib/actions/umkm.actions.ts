"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { umkmSchema, umkmCategorySchema } from "@/lib/validations/schemas";
import { logActivity } from "@/lib/data/admins";
import type { ActionResult } from "@/types/database";

function parseUmkmForm(formData: FormData) {
  return umkmSchema.safeParse({
    name: formData.get("name"),
    owner: formData.get("owner"),
    category_id: formData.get("category_id"),
    address: formData.get("address") ?? "",
    whatsapp: formData.get("whatsapp"),
    description: formData.get("description") ?? "",
    photo_url: formData.get("photo_url") ?? "",
  });
}

export async function createUmkm(formData: FormData): Promise<ActionResult> {
  const parsed = parseUmkmForm(formData);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("umkm").insert({
    ...parsed.data,
    address: parsed.data.address || null,
    description: parsed.data.description || null,
    photo_url: parsed.data.photo_url || null,
  });

  if (error) return { success: false, message: "Gagal menyimpan data UMKM." };

  await logActivity("umkm", "create", `Menambahkan UMKM "${parsed.data.name}"`);
  revalidatePath("/umkm");
  revalidatePath("/dashboard/umkm");
  revalidatePath("/");
  return { success: true, message: "UMKM berhasil disimpan." };
}

export async function updateUmkm(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseUmkmForm(formData);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("umkm")
    .update({
      ...parsed.data,
      address: parsed.data.address || null,
      description: parsed.data.description || null,
      photo_url: parsed.data.photo_url || null,
    })
    .eq("id", id);

  if (error) return { success: false, message: "Gagal memperbarui data UMKM." };

  await logActivity("umkm", "update", `Memperbarui UMKM "${parsed.data.name}"`);
  revalidatePath("/umkm");
  revalidatePath("/dashboard/umkm");
  revalidatePath("/");
  return { success: true, message: "UMKM berhasil diperbarui." };
}

export async function deleteUmkm(id: string, name: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("umkm").delete().eq("id", id);
  if (error) return { success: false, message: "Gagal menghapus data UMKM." };

  await logActivity("umkm", "delete", `Menghapus UMKM "${name}"`);
  revalidatePath("/umkm");
  revalidatePath("/dashboard/umkm");
  revalidatePath("/");
  return { success: true, message: "UMKM berhasil dihapus." };
}

export async function createUmkmCategory(formData: FormData): Promise<ActionResult> {
  const parsed = umkmCategorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("umkm_categories").insert(parsed.data);
  if (error) return { success: false, message: "Kategori sudah ada atau gagal disimpan." };

  revalidatePath("/dashboard/umkm/kategori");
  revalidatePath("/umkm");
  return { success: true, message: "Kategori berhasil ditambahkan." };
}

export async function updateUmkmCategory(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = umkmCategorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("umkm_categories").update(parsed.data).eq("id", id);
  if (error) return { success: false, message: "Nama kategori sudah digunakan atau gagal disimpan." };

  revalidatePath("/dashboard/umkm/kategori");
  revalidatePath("/umkm");
  revalidatePath("/dashboard/umkm");
  return { success: true, message: "Kategori berhasil diperbarui." };
}

export async function deleteUmkmCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("umkm_categories").delete().eq("id", id);
  if (error) {
    return {
      success: false,
      message: "Kategori tidak dapat dihapus karena masih digunakan oleh data UMKM.",
    };
  }
  revalidatePath("/dashboard/umkm/kategori");
  revalidatePath("/umkm");
  return { success: true, message: "Kategori berhasil dihapus." };
}
