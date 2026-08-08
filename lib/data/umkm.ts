import { createClient } from "@/lib/supabase/server";
import { PAGE_SIZE } from "@/lib/utils";
import type { Umkm, UmkmCategory, UmkmProduct } from "@/types/database";

export interface UmkmListParams {
  search?: string;
  categoryId?: string;
  dusun?: number;
  page?: number;
  pageSize?: number;
}

export async function getUmkmList({ search, categoryId, dusun, page = 1, pageSize = PAGE_SIZE }: UmkmListParams = {}) {
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
    if (dusun) query = query.eq("dusun", dusun);

    const { data, count } = await query;
    return { items: (data as Umkm[]) ?? [], total: count ?? 0 };
  } catch {
    return { items: [] as Umkm[], total: 0 };
  }
}

export async function getFeaturedUmkm(limit = 5): Promise<Umkm[]> {
  const { items } = await getUmkmList({ page: 1, pageSize: limit });
  return items;
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

export interface UmkmDusunCount {
  dusun: number;
  total: number;
}

/**
 * Rincian jumlah UMKM per Dusun (1-5), dipakai untuk filter direktori
 * UMKM publik dan ringkasan pada dashboard admin. UMKM lama yang belum
 * memiliki dusun (dusun = null) tidak dihitung pada rincian ini, tetapi
 * tetap ikut dalam `total` keseluruhan (lihat getUmkmCategoryCounts).
 */
export async function getUmkmDusunCounts(): Promise<{ unassigned: number; dusun: UmkmDusunCount[] }> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("umkm").select("dusun");
    const rows = (data as { dusun: number | null }[]) ?? [];

    const counts = new Map<number, number>();
    let unassigned = 0;
    for (const row of rows) {
      if (!row.dusun) {
        unassigned += 1;
        continue;
      }
      counts.set(row.dusun, (counts.get(row.dusun) ?? 0) + 1);
    }

    const dusun: UmkmDusunCount[] = [1, 2, 3, 4, 5].map((d) => ({ dusun: d, total: counts.get(d) ?? 0 }));
    return { unassigned, dusun };
  } catch {
    return { unassigned: 0, dusun: [] };
  }
}
