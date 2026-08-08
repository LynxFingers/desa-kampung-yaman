import { createClient } from "@/lib/supabase/server";
import { PAGE_SIZE, hasUmkmProfile } from "@/lib/utils";
import type { Umkm, UmkmCategory, UmkmProduct } from "@/types/database";

export interface UmkmListParams {
  search?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export async function getUmkmList({ search, categoryId, page = 1, pageSize = PAGE_SIZE }: UmkmListParams = {}) {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("umkm")
      .select("*, umkm_categories(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) query = query.ilike("name", `%${search}%`);
    if (categoryId) query = query.eq("category_id", categoryId);

    const { data, count } = await query;
    return { items: (data as Umkm[]) ?? [], total: count ?? 0 };
  } catch {
    return { items: [] as Umkm[], total: 0 };
  }
}

export async function getFeaturedUmkm(limit = 5): Promise<Umkm[]> {
  // Fetch a larger pool and filter to UMKM that actually have a name, so
  // the homepage "featured" section never shows a card-less/empty entry.
  const { items } = await getUmkmList({ page: 1, pageSize: limit * 3 });
  return items.filter(hasUmkmProfile).slice(0, limit);
}

export async function getUmkmById(id: string): Promise<Umkm | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("umkm").select("*, umkm_categories(*)").eq("id", id).single();
    return data as Umkm;
  } catch {
    return null;
  }
}

export async function getUmkmCategories(): Promise<UmkmCategory[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("umkm_categories").select("*").order("name");
    return (data as UmkmCategory[]) ?? [];
  } catch {
    return [];
  }
}

export async function getUmkmProducts(umkmId: string): Promise<UmkmProduct[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("umkm_products")
      .select("*")
      .eq("umkm_id", umkmId)
      .order("display_order", { ascending: true });
    return (data as UmkmProduct[]) ?? [];
  } catch {
    return [];
  }
}

export async function getUmkmProductById(productId: string): Promise<UmkmProduct | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("umkm_products").select("*").eq("id", productId).single();
    return data as UmkmProduct;
  } catch {
    return null;
  }
}

export interface UmkmCategoryCount {
  id: string;
  name: string;
  total: number;
}

export interface UmkmDusunCount {
  dusun: string;
  total: number;
}

/**
 * Groups UMKM by their (free-text) dusun field, for the "Rincian per Dusun"
 * dashboard widget. UMKM without a dusun set are returned separately as
 * `unassigned` rather than grouped under a fake label.
 */
export async function getUmkmDusunCounts(): Promise<{ dusun: UmkmDusunCount[]; unassigned: number }> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("umkm").select("dusun");
    const rows = (data as { dusun: string | null }[]) ?? [];

    const counts = new Map<string, number>();
    let unassigned = 0;
    for (const row of rows) {
      const value = row.dusun?.trim();
      if (!value) {
        unassigned += 1;
        continue;
      }
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    const dusun = Array.from(counts.entries())
      .map(([name, total]) => ({ dusun: name, total }))
      .sort((a, b) => a.dusun.localeCompare(b.dusun));

    return { dusun, unassigned };
  } catch {
    return { dusun: [], unassigned: 0 };
  }
}

/**
 * Total UMKM overall, plus a per-category breakdown (FR-DASH-02 style
 * summary used on the dashboard and as category counts on the public
 * UMKM directory).
 */
export async function getUmkmCategoryCounts(): Promise<{ total: number; categories: UmkmCategoryCount[] }> {
  try {
    const supabase = await createClient();
    const [categoriesRes, umkmRes] = await Promise.all([
      supabase.from("umkm_categories").select("id, name").order("name"),
      supabase.from("umkm").select("category_id"),
    ]);

    const categories = (categoriesRes.data as { id: string; name: string }[]) ?? [];
    const rows = (umkmRes.data as { category_id: string | null }[]) ?? [];

    const counts = new Map<string, number>();
    for (const row of rows) {
      if (!row.category_id) continue;
      counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
    }

    return {
      total: rows.length,
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        total: counts.get(cat.id) ?? 0,
      })),
    };
  } catch {
    return { total: 0, categories: [] };
  }
}
