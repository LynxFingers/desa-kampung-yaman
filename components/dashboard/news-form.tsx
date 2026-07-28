"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { ImageUploadField } from "@/components/dashboard/image-upload-field";
import { createNews, updateNews } from "@/lib/actions/news.actions";
import type { ActionResult, News } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export function NewsForm({ news }: { news?: News }) {
  const action = news
    ? (_prev: ActionResult, formData: FormData) => updateNews(news.id, formData)
    : (_prev: ActionResult, formData: FormData) => createNews(formData);

  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6">
      {state.message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${state.success ? "bg-green-50 text-[var(--color-success)]" : "bg-red-50 text-[var(--color-error)]"}`}>
          {state.message}
        </div>
      )}
      <div>
        <Label htmlFor="title">Judul Berita</Label>
        <Input id="title" name="title" defaultValue={news?.title ?? ""} required />
      </div>
      <ImageUploadField
        name="thumbnail_url"
        label="Thumbnail Berita"
        defaultValue={news?.thumbnail_url}
        folder="news"
      />
      <div>
        <Label htmlFor="summary">Ringkasan</Label>
        <Textarea id="summary" name="summary" rows={2} defaultValue={news?.summary ?? ""} required maxLength={300} />
      </div>
      <div>
        <Label htmlFor="content">Isi Berita</Label>
        <Textarea id="content" name="content" rows={10} defaultValue={news?.content ?? ""} required />
      </div>
      <SubmitButton>{news ? "Simpan Perubahan" : "Publikasikan Berita"}</SubmitButton>
    </form>
  );
}
