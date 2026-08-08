// Hand-written types mirroring supabase/migrations/0001_init.sql
// If you prefer generated types, run: supabase gen types typescript --linked

export type AdminRole = "super_admin" | "operator";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  village_name: string;
  logo_url: string | null;
  hero_image_url: string | null;
  motto: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  maps_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
}

export interface VillageProfile {
  id: string;
  history: string | null;
  vision: string | null;
  mission: string | null;
  potency: string | null;
  photo_url: string | null;
}

export interface VillageOfficial {
  id: string;
  admin_id: string | null;
  photo_url: string | null;
  name: string;
  position: string;
  term_period: string | null;
  phone: string | null;
  display_order: number;
  welcome_speech: string | null;
  created_at: string;
}

export interface VillageStatistics {
  id: string;
  population: number;
  total_families: number;
  total_hamlets: number;
  total_rt: number;
  total_rw: number;
  male_count: number;
  female_count: number;
  area_size: number | null;
  updated_at: string;
}

export interface News {
  id: string;
  admin_id: string | null;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail_url: string | null;
  published_at: string;
  created_at: string;
}

export interface UmkmCategory {
  id: string;
  name: string;
}

export interface Umkm {
  id: string;
  category_id: string | null;
  admin_id: string | null;
  name: string;
  owner: string;
  address: string | null;
  whatsapp: string;
  description: string | null;
  photo_url: string | null;
  dusun: number | null;
  created_at: string;
  umkm_categories?: UmkmCategory | null;
}

export interface GalleryItem {
  id: string;
  admin_id: string | null;
  photo_url: string;
  title: string;
  taken_at: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  admin_id: string | null;
  module: string;
  action: "create" | "update" | "delete";
  description: string | null;
  created_at: string;
}

export interface UmkmProduct {
  id: string;
  umkm_id: string;
  photo_url: string;
  name: string | null;
  price: number | null;
  variant: string | null;
  type: string | null;
  caption: string | null;
  stock: number | null;
  display_order: number;
  created_at: string;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}
