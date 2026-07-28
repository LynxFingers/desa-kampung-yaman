import { createClient } from "@/lib/supabase/server";
import type { Admin, ActivityLog } from "@/types/database";

export async function getAdmins(): Promise<Admin[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("admins").select("*").order("created_at");
    return (data as Admin[]) ?? [];
  } catch {
    return [];
  }
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;
    const { data } = await supabase.from("admins").select("*").eq("email", user.email).single();
    return data as Admin;
  } catch {
    return null;
  }
}

export async function getRecentActivity(limit = 10): Promise<ActivityLog[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data as ActivityLog[]) ?? [];
  } catch {
    return [];
  }
}

export async function logActivity(
  module: string,
  action: "create" | "update" | "delete",
  description: string
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let adminId: string | null = null;
    if (user?.email) {
      const { data: admin } = await supabase.from("admins").select("id").eq("email", user.email).single();
      adminId = admin?.id ?? null;
    }
    await supabase.from("activity_logs").insert({ admin_id: adminId, module, action, description });
  } catch {
    // Logging failures should never block the primary action.
  }
}

export async function getDashboardStats() {
  try {
    const supabase = await createClient();
    const [news, umkm, gallery, officials, statistics] = await Promise.all([
      supabase.from("news").select("*", { count: "exact", head: true }),
      supabase.from("umkm").select("*", { count: "exact", head: true }),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
      supabase.from("village_officials").select("*", { count: "exact", head: true }),
      supabase.from("village_statistics").select("total_hamlets, population").limit(1).single(),
    ]);

    return {
      totalNews: news.count ?? 0,
      totalUmkm: umkm.count ?? 0,
      totalGallery: gallery.count ?? 0,
      totalOfficials: officials.count ?? 0,
      totalHamlets: statistics.data?.total_hamlets ?? 0,
      totalPopulation: statistics.data?.population ?? 0,
    };
  } catch {
    return {
      totalNews: 0,
      totalUmkm: 0,
      totalGallery: 0,
      totalOfficials: 0,
      totalHamlets: 0,
      totalPopulation: 0,
    };
  }
}
