import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(200),
  summary: z.string().min(10, "Ringkasan minimal 10 karakter").max(300),
  content: z.string().min(20, "Isi berita minimal 20 karakter"),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
});

export const umkmSchema = z.object({
  name: z.string().min(3, "Nama usaha minimal 3 karakter").max(150),
  owner: z.string().min(3, "Nama pemilik minimal 3 karakter").max(100),
  category_id: z.string().uuid("Kategori wajib dipilih"),
  address: z.string().optional().or(z.literal("")),
  whatsapp: z
    .string()
    .min(9, "Nomor WhatsApp tidak valid")
    .regex(/^[0-9+\-\s]+$/, "Nomor WhatsApp hanya boleh berisi angka"),
  description: z.string().optional().or(z.literal("")),
  photo_url: z.string().url().optional().or(z.literal("")),
});

export const umkmCategorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter").max(50),
});

export const gallerySchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(150),
  photo_url: z.string().min(1, "Foto wajib diunggah"),
  taken_at: z.string().optional().or(z.literal("")),
});

export const officialSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(100),
  position: z.string().min(2, "Jabatan wajib diisi").max(100),
  term_period: z.string().optional().or(z.literal("")),
  photo_url: z.string().optional().or(z.literal("")),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^[0-9+\-\s]+$/.test(val), "Nomor HP hanya boleh berisi angka"),
  display_order: z.coerce.number().int().min(0).default(0),
  welcome_speech: z.string().optional().or(z.literal("")),
});

export const statisticsSchema = z.object({
  population: z.coerce.number().int().min(0),
  total_families: z.coerce.number().int().min(0),
  total_hamlets: z.coerce.number().int().min(0),
  total_rt: z.coerce.number().int().min(0),
  total_rw: z.coerce.number().int().min(0),
  male_count: z.coerce.number().int().min(0),
  female_count: z.coerce.number().int().min(0),
  area_size: z.coerce.number().min(0),
});

export const profileSchema = z.object({
  history: z.string().optional().or(z.literal("")),
  vision: z.string().optional().or(z.literal("")),
  mission: z.string().optional().or(z.literal("")),
  potency: z.string().optional().or(z.literal("")),
  photo_url: z.string().optional().or(z.literal("")),
});

export const umkmProductSchema = z.object({
  photo_url: z.string().min(1, "Foto produk wajib diunggah"),
  name: z.string().max(150).optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif").default(0),
  variant: z.string().max(100).optional().or(z.literal("")),
  type: z.string().max(100).optional().or(z.literal("")),
  caption: z.string().max(150).optional().or(z.literal("")),
  stock: z.coerce.number().int("Stok harus berupa angka bulat").min(0, "Stok tidak boleh negatif").optional(),
});

export const settingsSchema = z.object({
  village_name: z.string().min(3, "Nama desa wajib diisi"),
  motto: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  maps_url: z.string().optional().or(z.literal("")),
  facebook_url: z.string().optional().or(z.literal("")),
  instagram_url: z.string().optional().or(z.literal("")),
  logo_url: z.string().optional().or(z.literal("")),
  hero_image_url: z.string().optional().or(z.literal("")),
});

export const adminSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
  role: z.enum(["super_admin", "operator"]),
});
