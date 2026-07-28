import { PageHeader } from "@/components/dashboard/page-header";
import { BackLink } from "@/components/dashboard/back-link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { AdminForm } from "@/components/dashboard/admin-form";
import { getAdmins, getCurrentAdmin } from "@/lib/data/admins";
import { deleteAdmin } from "@/lib/actions/admins.actions";
import { formatDate } from "@/lib/utils";

export default async function DashboardAdminPage() {
  const [admins, currentAdmin] = await Promise.all([getAdmins(), getCurrentAdmin()]);
  const isSuperAdmin = currentAdmin?.role === "super_admin";

  return (
    <div>
      <BackLink href="/dashboard" label="Kembali ke Dashboard" />
      <PageHeader
        title="Manajemen Admin"
        description={
          isSuperAdmin
            ? "Tambah atau hapus akun admin operator dan super admin."
            : "Hanya Super Admin yang dapat mengelola data admin."
        }
      />

      {isSuperAdmin && <AdminForm />}

      {admins.length > 0 ? (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-primary-light)]/40 text-xs uppercase text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Peran</th>
                <th className="px-5 py-3">Bergabung</th>
                {isSuperAdmin && <th className="px-5 py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-5 py-3 font-medium">{admin.name}</td>
                  <td className="px-5 py-3">{admin.email}</td>
                  <td className="px-5 py-3">
                    <Badge>{admin.role === "super_admin" ? "Super Admin" : "Admin Operator"}</Badge>
                  </td>
                  <td className="px-5 py-3">{formatDate(admin.created_at)}</td>
                  {isSuperAdmin && (
                    <td className="px-5 py-3 text-right">
                      {currentAdmin?.id !== admin.id && (
                        <DeleteButton
                          action={deleteAdmin.bind(null, admin.id, admin.name)}
                          confirmMessage={`Hapus admin "${admin.name}"?`}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Belum ada data admin" />
      )}
    </div>
  );
}
