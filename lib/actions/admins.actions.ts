"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { adminSchema } from "@/lib/validations/schemas";
import { logActivity, getCurrentAdmin } from "@/lib/data/admins";
import { checkLoginRateLimit, getClientIp, recordLoginAttempt } from "@/lib/security/rate-limit";
import type { ActionResult } from "@/types/database";

export async function signIn(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { success: false, message: "Email dan password wajib diisi." };
  }

  const ip = await getClientIp();

  const rateLimit = await checkLoginRateLimit(email, ip);
  if (rateLimit.blocked) {
    return {
      success: false,
      message: `Terlalu banyak percobaan login gagal. Coba lagi dalam ${rateLimit.retryAfterMinutes} menit.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  await recordLoginAttempt(email, ip, !error);

  if (error) {
    return { success: false, message: "Email atau password salah." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createAdmin(formData: FormData): Promise<ActionResult> {
  const actor = await getCurrentAdmin();
  if (actor?.role !== "super_admin") {
    return { success: false, message: "Hanya Super Admin yang dapat menambahkan admin baru." };
  }

  const parsed = adminSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };
  if (!parsed.data.password) return { success: false, message: "Password wajib diisi untuk admin baru." };

  const serviceClient = createServiceClient();
  const { data: authUser, error: authError } = await serviceClient.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });

  if (authError || !authUser?.user) {
    return { success: false, message: authError?.message ?? "Gagal membuat akun autentikasi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("admins").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role,
  });

  if (error) return { success: false, message: "Akun dibuat, namun gagal menyimpan data admin." };

  await logActivity("admins", "create", `Menambahkan admin "${parsed.data.name}"`);
  revalidatePath("/dashboard/admin");
  return { success: true, message: "Admin baru berhasil ditambahkan." };
}

export async function deleteAdmin(id: string, name: string): Promise<ActionResult> {
  const actor = await getCurrentAdmin();
  if (actor?.role !== "super_admin") {
    return { success: false, message: "Hanya Super Admin yang dapat menghapus admin." };
  }
  if (actor.id === id) {
    return { success: false, message: "Anda tidak dapat menghapus akun sendiri." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) return { success: false, message: "Gagal menghapus admin." };

  await logActivity("admins", "delete", `Menghapus admin "${name}"`);
  revalidatePath("/dashboard/admin");
  return { success: true, message: "Admin berhasil dihapus." };
}
