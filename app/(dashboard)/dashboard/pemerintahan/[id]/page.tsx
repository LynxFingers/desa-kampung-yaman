import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { BackLink } from "@/components/dashboard/back-link";
import { OfficialForm } from "@/components/dashboard/official-form";
import { getOfficialById } from "@/lib/data/officials";

export default async function EditPerangkatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const official = await getOfficialById(id);
  if (!official) notFound();

  return (
    <div>
      <BackLink href="/dashboard/pemerintahan" label="Kembali ke Daftar Pemerintahan Desa" />
      <PageHeader title="Ubah Perangkat Desa" description={`Perbarui data untuk ${official.name}.`} />
      <OfficialForm official={official} />
    </div>
  );
}
