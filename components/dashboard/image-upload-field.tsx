"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Link as LinkIcon, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const BUCKET = "uploads";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  folder: string;
  helperText?: string;
}

export function ImageUploadField({ name, label, defaultValue, folder, helperText }: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, atau WEBP).");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Gagal mengunggah gambar. Pastikan bucket "${BUCKET}" pada Supabase Storage sudah dibuat dan bersifat publik.`
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <Label htmlFor={`${name}-url`}>{label}</Label>

      {url && (
        <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-primary-light)]">
          <Image src={url} alt="Pratinjau gambar" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            aria-label="Hapus gambar"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-primary-light)]">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          {uploading ? "Mengunggah..." : "Unggah dari Perangkat"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        <span className="text-xs text-[var(--color-muted)]">atau tempel URL</span>
        <div className="flex min-w-[200px] flex-1 items-center gap-2">
          <LinkIcon className="h-4 w-4 shrink-0 text-[var(--color-muted)]" />
          <Input
            id={`${name}-url`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://.../gambar.jpg"
          />
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>}
      {helperText && !error && <p className="mt-2 text-xs text-[var(--color-muted)]">{helperText}</p>}

      <input type="hidden" name={name} value={url} />
    </div>
  );
}
