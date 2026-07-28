import { PageHeader } from "@/components/dashboard/page-header";
import { BackLink } from "@/components/dashboard/back-link";
import { OfficialForm } from "@/components/dashboard/official-form";

export default function TambahPerangkatPage() {
  return (
    <div>
      <BackLink href="/dashboard/pemerintahan" label="Kembali ke Daftar Pemerintahan Desa" />
      <PageHeader title="Tambah Perangkat Desa" description="Isi data perangkat desa baru." />
      <OfficialForm />
    </div>
  );
}
