import type { Metadata } from 'next';
import AdminShell from '../../components/sections/admin/AdminShell';
import AdminListingsTable from '../../components/sections/admin/AdminListingsTable';
import { requireAdminPageSession } from '@/lib/api/admin-guard';
import { fetchAdminListings } from '@/lib/api/waterstone';

export const metadata: Metadata = {
  title: 'Manage Listings | Waterstone Admin',
  robots: { index: false, follow: false },
};

export default async function AdminListingsPage() {
  const token = await requireAdminPageSession();
  const listings = await fetchAdminListings(token);

  return (
    <AdminShell>
      <AdminListingsTable listings={listings} />
    </AdminShell>
  );
}
