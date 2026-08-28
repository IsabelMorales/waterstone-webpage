import type { Metadata } from 'next';
import AdminShell from '../../components/sections/admin/AdminShell';
import AdminAdminsTable from '../../components/sections/admin/AdminAdminsTable';
import { requireAdminPageSession } from '@/lib/api/admin-guard';
import { fetchAdmins } from '@/lib/api/waterstone';

export const metadata: Metadata = {
  title: 'Admin Users | Waterstone Admin',
  robots: { index: false, follow: false },
};

export default async function AdminAdminsPage() {
  const token = await requireAdminPageSession();
  const admins = await fetchAdmins(token);

  return (
    <AdminShell>
      <AdminAdminsTable admins={admins} />
    </AdminShell>
  );
}
