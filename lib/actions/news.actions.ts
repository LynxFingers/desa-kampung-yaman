"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { newsSchema } from "@/lib/validations/schemas";
import { generateSlug } from "@/lib/utils";
import { logActivity } from "@/lib/data/admins";
import type { ActionResult } from "@/types/database";

export async function createNews(formData: FormData): Promise<ActionResult> {
  const parsed = newsSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    thumbnail_url: formData.get("thumbnail_url") ?? "",
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const slug = generateSlug(parsed.data.title);

  const { error } = await supabase.from("news").insert({
    title: parsed.data.title,
    summary: parsed.data.summary,
    content: parsed.data.content,
    thumbnail_url: parsed.data.thumbnail_url || null,
    slug,
  });

  if (error) {
    return { success: false, message: "Judul berita sudah digunakan, silakan gunakan judul lain." };
  }

  await logActivity("news", "create", `Menambahkan berita "${parsed.data.title}"`);
  revalidatePath("/berita");
  revalidatePath("/dashboard/berita");
  revalidatePath("/");
  return { success: true, message: "Berita berhasil disimpan." };
}

export async function updateNews(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = newsSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    thumbnail_url: formData.get("thumbnail_url") ?? "",
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const slug = generateSlug(parsed.data.title);

  const { error } = await supabase
    .from("news")
    .update({
      title: parsed.data.title,
      summary: parsed.data.summary,
      content: parsed.data.content,
      thumbnail_url: parsed.data.thumbnail_url || null,
      slug,
    })
    .eq("id", id);

  if (error) {
    return { success: false, message: "Gagal memperbarui berita." };
  }

  await logActivity("news", "update", `Memperbarui berita "${parsed.data.title}"`);
  revalidatePath("/berita");
  revalidatePath("/dashboard/berita");
  revalidatePath("/");
  return { success: true, message: "Berita berhasil diperbarui." };
}

export async function deleteNews(id: string, title: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    return { success: false, message: "Gagal menghapus berita." };
  }

  await logActivity("news", "delete", `Menghapus berita "${title}"`);
  revalidatePath("/berita");
  revalidatePath("/dashboard/berita");
  revalidatePath("/");
  return { success: true, message: "Berita berhasil dihapus." };
}
