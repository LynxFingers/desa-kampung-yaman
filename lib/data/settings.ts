import { createClient } from "@/lib/supabase/server";
import type { SiteSettings, VillageProfile, VillageStatistics } from "@/types/database";

// Fallback data so the site still renders a sensible layout
// before Supabase has been configured/seeded.
const FALLBACK_SETTINGS: SiteSettings = {
  id: "fallback",
  village_name: "Desa Kampung Yaman",
  logo_url: null,
  hero_image_url: null,
  motto: "Guyub Rukun, Maju Bersama",
  address: "Jl. Raya Kampung Yaman No. 1, Kecamatan Sukamaju",
  email: "desa.kampungyaman@example.id",
  phone: "0812-3456-7890",
  maps_url: "https://maps.google.com",
  facebook_url: null,
  instagram_url: null,
};

const FALLBACK_STATS: VillageStatistics = {
  id: "fallback",
  population: 0,
  total_families: 0,
  total_hamlets: 0,
  total_rt: 0,
  total_rw: 0,
  male_count: 0,
  female_count: 0,
  area_size: 0,
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*").limit(1).single();
    return (data as SiteSettings) ?? FALLBACK_SETTINGS;
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export async function getVillageProfile(): Promise<VillageProfile | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("village_profile").select("*").limit(1).single();
    return data as VillageProfile;
  } catch {
    return null;
  }
}

export async function getVillageStatistics(): Promise<VillageStatistics> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("village_statistics").select("*").limit(1).single();
    return (data as VillageStatistics) ?? FALLBACK_STATS;
  } catch {
    return FALLBACK_STATS;
  }
}
