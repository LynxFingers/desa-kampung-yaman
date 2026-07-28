import { getSiteSettings } from "@/lib/data/settings";
import { PengaturanForm } from "@/components/dashboard/pengaturan-form";
import { BackLink } from "@/components/dashboard/back-link";

export default async function PengaturanPage() {
  const settings = await getSiteSettings();
  return (
    <div>
      <BackLink href="/dashboard" label="Kembali ke Dashboard" />
      <PengaturanForm settings={settings} />
    </div>
  );
}
