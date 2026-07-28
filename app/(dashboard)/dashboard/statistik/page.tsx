import { getVillageStatistics } from "@/lib/data/settings";
import { StatistikForm } from "@/components/dashboard/statistik-form";
import { BackLink } from "@/components/dashboard/back-link";

export default async function DashboardStatistikPage() {
  const statistics = await getVillageStatistics();
  return (
    <div>
      <BackLink href="/dashboard" label="Kembali ke Dashboard" />
      <StatistikForm statistics={statistics} />
    </div>
  );
}
