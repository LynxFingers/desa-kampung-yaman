import { createClient } from "@/lib/supabase/server";
import { PAGE_SIZE } from "@/lib/utils";
import type { GalleryItem } from "@/types/database";

export async function getGalleryList(page = 1, pageSize = PAGE_SIZE) {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, count } = await supabase
      .from("gallery")
      .select("*", { count: "exact" })
      .order("taken_at", { ascending: false })
      .range(from, to);
    return { items: (data as GalleryItem[]) ?? [], total: count ?? 0 };
  } catch {
    return { items: [] as GalleryItem[], total: 0 };
  }
}

export async function getLatestGallery(limit = 5): Promise<GalleryItem[]> {
  const { items } = await getGalleryList(1, limit);
  return items;
}
