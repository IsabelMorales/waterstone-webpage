import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminShell from '../../../../components/sections/admin/AdminShell';
import AdminForm from '../../../../components/sections/admin/AdminForm';
import { requireAdminPageSession } from '@/lib/api/admin-guard';
import { fetchAdminById, WaterstoneApiError } from '@/lib/api/waterstone';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Edit Admin | Waterstone Admin',
  robots: { index: false, follow: false },
};

export default async function AdminEditAdminPage({ params }: PageProps) {
  const token = await requireAdminPageSession();

  const { id } = await params;

  try {
    const admin = await fetchAdminById(token, id);
    return (
      <AdminShell>
        <AdminForm mode="edit" admin={admin} />
      </AdminShell>
    );
  } catch (err) {
    if (err instanceof WaterstoneApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
