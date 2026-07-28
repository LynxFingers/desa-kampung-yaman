import Image from "next/image";
import { UserRound, Plus, Pencil } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { getOfficials } from "@/lib/data/officials";
import { deleteOfficial } from "@/lib/actions/officials.actions";

export default async function DashboardPemerintahanPage() {
  const officials = await getOfficials();

  return (
    <div>
      <PageHeader
        title="Pemerintahan Desa"
        description="Kelola data perangkat desa beserta urutan tampil pada halaman publik."
        action={<Button href="/dashboard/pemerintahan/baru"><Plus className="h-4 w-4" /> Tambah Perangkat</Button>}
      />

      {officials.length > 0 ? (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-primary-light)]/40 text-xs uppercase text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3">Foto</th>
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Jabatan</th>
                <th className="px-5 py-3">Masa Jabatan</th>
                <th className="px-5 py-3">No. HP</th>
                <th className="px-5 py-3">Urutan</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {officials.map((official) => (
                <tr key={official.id}>
                  <td className="px-5 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[var(--color-primary-light)]">
                      {official.photo_url ? (
                        <Image src={official.photo_url} alt={official.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--color-primary)]">
                          <UserRound className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium">{official.name}</td>
                  <td className="px-5 py-3">{official.position}</td>
                  <td className="px-5 py-3">{official.term_period ?? "-"}</td>
                  <td className="px-5 py-3">{official.phone ?? "-"}</td>
                  <td className="px-5 py-3">{official.display_order}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Button href={`/dashboard/pemerintahan/${official.id}`} variant="outline" size="sm">
                        <Pencil className="h-3.5 w-3.5" /> Ubah
                      </Button>
                      <DeleteButton
                        action={deleteOfficial.bind(null, official.id, official.name)}
                        confirmMessage={`Hapus data perangkat desa "${official.name}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Belum ada data perangkat desa" description="Klik tombol Tambah Perangkat untuk mulai menambahkan data." />
      )}
    </div>
  );
}
