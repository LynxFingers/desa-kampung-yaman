import { getVillageProfile } from "@/lib/data/settings";
import { ProfilDesaForm } from "@/components/dashboard/profil-desa-form";
import { BackLink } from "@/components/dashboard/back-link";

export default async function DashboardProfilDesaPage() {
  const profile = await getVillageProfile();

  return (
    <div>
      <BackLink href="/dashboard" label="Kembali ke Dashboard" />
      {profile ? (
        <ProfilDesaForm profile={profile} />
      ) : (
        <p className="text-sm text-[var(--color-muted)]">Data profil desa belum tersedia. Jalankan migrasi database terlebih dahulu.</p>
      )}
    </div>
  );
}
