import { createClient } from "@/lib/supabase/server";
import { PAGE_SIZE } from "@/lib/utils";
import type { News } from "@/types/database";

export interface NewsListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getNewsList({ search, page = 1, pageSize = PAGE_SIZE }: NewsListParams = {}) {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("news")
      .select("*", { count: "exact" })
      .order("published_at", { ascending: false })
      .range(from, to);

    if (search) query = query.ilike("title", `%${search}%`);

    const { data, count } = await query;
    return { items: (data as News[]) ?? [], total: count ?? 0 };
  } catch {
    return { items: [] as News[], total: 0 };
  }
}

export async function getLatestNews(limit = 5): Promise<News[]> {
  const { items } = await getNewsList({ page: 1, pageSize: limit });
  return items;
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("news").select("*").eq("slug", slug).single();
    return data as News;
  } catch {
    return null;
  }
}

export async function getNewsById(id: string): Promise<News | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("news").select("*").eq("id", id).single();
    return data as News;
  } catch {
    return null;
  }
}
