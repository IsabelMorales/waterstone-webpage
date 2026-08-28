import type { Metadata } from 'next';
import AdminShell from '../../../components/sections/admin/AdminShell';
import AdminForm from '../../../components/sections/admin/AdminForm';
import { requireAdminPageSession } from '@/lib/api/admin-guard';

export const metadata: Metadata = {
  title: 'New Admin | Waterstone Admin',
  robots: { index: false, follow: false },
};

export default async function AdminNewAdminPage() {
  await requireAdminPageSession();

  return (
    <AdminShell>
      <AdminForm mode="create" />
    </AdminShell>
  );
}
