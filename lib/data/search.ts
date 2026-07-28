import { createClient } from "@/lib/supabase/server";
import { escapePostgrestFilterValue } from "@/lib/utils";

export type SearchCategory = "berita" | "umkm" | "produk" | "galeri" | "aparatur";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  href: string;
}

export interface SearchResults {
  berita: SearchResultItem[];
  umkm: SearchResultItem[];
  produk: SearchResultItem[];
  galeri: SearchResultItem[];
  aparatur: SearchResultItem[];
  total: number;
}

const EMPTY: SearchResults = { berita: [], umkm: [], produk: [], galeri: [], aparatur: [], total: 0 };

/**
 * Searches across every public module of the village site so a query like
 * "warung" surfaces matching UMKM, produk, berita, galeri, and aparatur —
 * instead of always landing on Berita.
 */
export async function searchAll(query: string, category?: SearchCategory | "semua"): Promise<SearchResults> {
  const q = query.trim();
  if (!q) return EMPTY;
  // Escape special PostgREST filter characters so a search term can never
  // break out of the intended ilike/or clause (see escapePostgrestFilterValue).
  const safeQ = escapePostgrestFilterValue(q);

  try {
    const supabase = await createClient();
    const wantsAll = !category || category === "semua";
    const limit = 8;

    const [newsRes, umkmRes, productsRes, galleryRes, officialsRes] = await Promise.all([
      wantsAll || category === "berita"
        ? supabase
            .from("news")
            .select("id, title, slug, summary, thumbnail_url")
            .or(`title.ilike.%${safeQ}%,summary.ilike.%${safeQ}%`)
            .limit(limit)
        : Promise.resolve({ data: [] }),
      wantsAll || category === "umkm"
        ? supabase
            .from("umkm")
            .select("id, name, owner, photo_url, description")
            .or(`name.ilike.%${safeQ}%,owner.ilike.%${safeQ}%,description.ilike.%${safeQ}%`)
            .limit(limit)
        : Promise.resolve({ data: [] }),
      wantsAll || category === "produk"
        ? supabase
            .from("umkm_products")
            .select("id, name, caption, photo_url, price, umkm_id, umkm:umkm_id(id, name)")
            .or(`name.ilike.%${safeQ}%,caption.ilike.%${safeQ}%`)
            .limit(limit)
        : Promise.resolve({ data: [] }),
      wantsAll || category === "galeri"
        ? supabase.from("gallery").select("id, title, photo_url").ilike("title", `%${safeQ}%`).limit(limit)
        : Promise.resolve({ data: [] }),
      wantsAll || category === "aparatur"
        ? supabase
            .from("village_officials")
            .select("id, name, position, photo_url")
            .or(`name.ilike.%${safeQ}%,position.ilike.%${safeQ}%`)
            .limit(limit)
        : Promise.resolve({ data: [] }),
    ]);

    type NewsRow = { id: string; title: string; slug: string; summary: string; thumbnail_url: string | null };
    type UmkmRow = { id: string; name: string; owner: string; photo_url: string | null; description: string | null };
    type ProductRow = {
      id: string;
      name: string | null;
      caption: string | null;
      photo_url: string;
      price: number | null;
      umkm_id: string;
      umkm: { id: string; name: string } | { id: string; name: string }[] | null;
    };
    type GalleryRow = { id: string; title: string; photo_url: string };
    type OfficialRow = { id: string; name: string; position: string; photo_url: string | null };

    const berita: SearchResultItem[] = ((newsRes.data as NewsRow[] | null) ?? []).map((n) => ({
      id: n.id,
      title: n.title,
      subtitle: n.summary,
      image: n.thumbnail_url,
      href: `/berita/${n.slug}`,
    }));

    const umkm: SearchResultItem[] = ((umkmRes.data as UmkmRow[] | null) ?? []).map((u) => ({
      id: u.id,
      title: u.name,
      subtitle: `Pemilik: ${u.owner}`,
      image: u.photo_url,
      href: `/umkm/${u.id}`,
    }));

    const produk: SearchResultItem[] = ((productsRes.data as ProductRow[] | null) ?? []).map((p) => {
      const parent = Array.isArray(p.umkm) ? p.umkm[0] : p.umkm;
      return {
        id: p.id,
        title: p.name ?? "Produk",
        subtitle: parent?.name ? `UMKM: ${parent.name}` : undefined,
        image: p.photo_url,
        href: `/umkm/${parent?.id ?? p.umkm_id}/produk/${p.id}`,
      };
    });

    const galeri: SearchResultItem[] = ((galleryRes.data as GalleryRow[] | null) ?? []).map((g) => ({
      id: g.id,
      title: g.title,
      image: g.photo_url,
      href: `/galeri`,
    }));

    const aparatur: SearchResultItem[] = ((officialsRes.data as OfficialRow[] | null) ?? []).map((o) => ({
      id: o.id,
      title: o.name,
      subtitle: o.position,
      image: o.photo_url,
      href: `/pemerintahan`,
    }));

    return {
      berita,
      umkm,
      produk,
      galeri,
      aparatur,
      total: berita.length + umkm.length + produk.length + galeri.length + aparatur.length,
    };
  } catch {
    return EMPTY;
  }
}
