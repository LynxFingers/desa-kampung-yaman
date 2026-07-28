"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { umkmProductSchema } from "@/lib/validations/schemas";
import { extractStoragePath } from "@/lib/utils";
import { logActivity } from "@/lib/data/admins";
import type { ActionResult } from "@/types/database";

export async function createUmkmProduct(umkmId: string, formData: FormData): Promise<ActionResult> {
  const parsed = umkmProductSchema.safeParse({
    photo_url: formData.get("photo_url"),
    name: formData.get("name") ?? "",
    price: formData.get("price") || 0,
    variant: formData.get("variant") ?? "",
    type: formData.get("type") ?? "",
    caption: formData.get("caption") ?? "",
    stock: formData.get("stock") || undefined,
  });
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("umkm_products").insert({
    umkm_id: umkmId,
    photo_url: parsed.data.photo_url,
    name: parsed.data.name || null,
    price: parsed.data.price || null,
    variant: parsed.data.variant || null,
    type: parsed.data.type || null,
    caption: parsed.data.caption || null,
    stock: parsed.data.stock ?? null,
  });

  if (error) return { success: false, message: "Gagal menyimpan foto produk." };

  await logActivity("umkm_products", "create", `Menambahkan produk "${parsed.data.name || "tanpa nama"}"`);
  revalidatePath(`/umkm/${umkmId}`);
  revalidatePath(`/dashboard/umkm/${umkmId}/produk`);
  return { success: true, message: "Produk berhasil ditambahkan." };
}

export async function deleteUmkmProduct(id: string, umkmId: string, photoUrl: string): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const path = extractStoragePath(photoUrl, "uploads");
    if (path) await supabase.storage.from("uploads").remove([path]);
  } catch {
    // Non-fatal: continue with metadata deletion even if storage cleanup fails.
  }

  const { error } = await supabase.from("umkm_products").delete().eq("id", id);
  if (error) return { success: false, message: "Gagal menghapus foto produk." };

  await logActivity("umkm_products", "delete", "Menghapus foto produk UMKM");
  revalidatePath(`/umkm/${umkmId}`);
  revalidatePath(`/dashboard/umkm/${umkmId}/produk`);
  return { success: true, message: "Foto produk berhasil dihapus." };
}
