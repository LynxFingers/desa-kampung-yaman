import { createClient } from "@/lib/supabase/server";
import type { VillageOfficial } from "@/types/database";

export async function getOfficials(limit?: number): Promise<VillageOfficial[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("village_officials")
      .select("*")
      .order("display_order", { ascending: true });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data as VillageOfficial[]) ?? [];
  } catch {
    return [];
  }
}

export async function getHeadOfVillage(officials?: VillageOfficial[]): Promise<VillageOfficial | null> {
  const list = officials ?? (await getOfficials());
  return (
    list.find((o) => o.position.toLowerCase().includes("kepala desa")) ?? list[0] ?? null
  );
}

export async function getOfficialById(id: string): Promise<VillageOfficial | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("village_officials").select("*").eq("id", id).single();
    return data as VillageOfficial;
  } catch {
    return null;
  }
}
