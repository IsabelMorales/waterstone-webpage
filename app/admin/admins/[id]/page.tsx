import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminShell from '../../../components/sections/admin/AdminShell';
import AdminAdminDetail from '../../../components/sections/admin/AdminAdminDetail';
import { requireAdminPageSession } from '@/lib/api/admin-guard';
import {
  fetchAdminById,
  fetchAdminMe,
  WaterstoneApiError,
} from '@/lib/api/waterstone';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Admin User | Waterstone Admin',
  robots: { index: false, follow: false },
};

export default async function AdminAdminDetailPage({ params }: PageProps) {
  const token = await requireAdminPageSession();
  const currentUser = await fetchAdminMe(token);

  const { id } = await params;

  try {
    const admin = await fetchAdminById(token, id);
    return (
      <AdminShell>
        <AdminAdminDetail admin={admin} currentUserId={currentUser.id} />
      </AdminShell>
    );
  } catch (err) {
    if (err instanceof WaterstoneApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
