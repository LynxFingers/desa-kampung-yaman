"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gallerySchema } from "@/lib/validations/schemas";
import { logActivity } from "@/lib/data/admins";
import { extractStoragePath } from "@/lib/utils";
import type { ActionResult } from "@/types/database";

export async function createGalleryItem(formData: FormData): Promise<ActionResult> {
  const parsed = gallerySchema.safeParse({
    title: formData.get("title"),
    photo_url: formData.get("photo_url"),
    taken_at: formData.get("taken_at") ?? "",
  });
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("gallery").insert({
    title: parsed.data.title,
    photo_url: parsed.data.photo_url,
    taken_at: parsed.data.taken_at || null,
  });

  if (error) return { success: false, message: "Gagal menyimpan foto galeri." };

  await logActivity("gallery", "create", `Menambahkan foto galeri "${parsed.data.title}"`);
  revalidatePath("/galeri");
  revalidatePath("/dashboard/galeri");
  revalidatePath("/");
  return { success: true, message: "Foto berhasil ditambahkan ke galeri." };
}

export async function deleteGalleryItem(id: string, title: string, photoUrl: string): Promise<ActionResult> {
  const supabase = await createClient();

  // Attempt to remove the stored object as well (best-effort).
  try {
    const path = extractStoragePath(photoUrl, "uploads");
    if (path) await supabase.storage.from("uploads").remove([path]);
  } catch {
    // Non-fatal: continue with metadata deletion even if storage cleanup fails.
  }

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { success: false, message: "Gagal menghapus foto galeri." };

  await logActivity("gallery", "delete", `Menghapus foto galeri "${title}"`);
  revalidatePath("/galeri");
  revalidatePath("/dashboard/galeri");
  revalidatePath("/");
  return { success: true, message: "Foto berhasil dihapus." };
}
