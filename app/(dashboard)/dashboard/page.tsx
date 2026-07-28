import { Newspaper, Store, Image as ImageIcon, Users, MapPinned, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatWidget } from "@/components/dashboard/stat-widget";
import { EmptyState } from "@/components/ui/empty-state";
import { getDashboardStats, getRecentActivity } from "@/lib/data/admins";
import { formatDate } from "@/lib/utils";

const ACTION_LABEL: Record<string, string> = {
  create: "Menambahkan",
  update: "Memperbarui",
  delete: "Menghapus",
};

export default async function DashboardHomePage() {
  const [stats, activity] = await Promise.all([getDashboardStats(), getRecentActivity(10)]);

  return (
    <div>
      <PageHeader title="Dashboard" description="Ringkasan aktivitas dan konten Sistem Informasi Desa Kampung Yaman." />

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatWidget icon={Newspaper} label="Total Berita" value={stats.totalNews} />
        <StatWidget icon={Store} label="Total UMKM" value={stats.totalUmkm} />
        <StatWidget icon={ImageIcon} label="Total Galeri" value={stats.totalGallery} />
        <StatWidget icon={UserCheck} label="Perangkat Desa" value={stats.totalOfficials} />
        <StatWidget icon={MapPinned} label="Jumlah Dusun" value={stats.totalHamlets} />
        <StatWidget icon={Users} label="Jumlah Penduduk" value={stats.totalPopulation} />
      </div>

      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6">
        <h2 className="mb-4 font-display text-lg text-[var(--color-primary-dark)]">Aktivitas Terakhir</h2>
        {activity.length > 0 ? (
          <ul className="divide-y divide-[var(--color-border)]">
            {activity.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span>
                  {ACTION_LABEL[log.action]} {log.module.replace(/_/g, " ")}
                  {log.description ? ` — ${log.description}` : ""}
                </span>
                <span className="shrink-0 text-xs text-[var(--color-muted)]">{formatDate(log.created_at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Belum ada aktivitas" description="Aktivitas admin akan tercatat di sini." />
        )}
      </div>
    </div>
  );
}
