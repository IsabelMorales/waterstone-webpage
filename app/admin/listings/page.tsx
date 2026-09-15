import type { Metadata } from 'next';
import AdminShell from '../../components/sections/admin/AdminShell';
import AdminListingsTable from '../../components/sections/admin/AdminListingsTable';
import { requireAdminPageSession } from '@/lib/api/admin-guard';
import {
  fetchAdminListings,
  fetchListingOptions,
} from '@/lib/api/waterstone';
import { FALLBACK_LISTING_OPTIONS } from '@/lib/listing-options';

export const metadata: Metadata = {
  title: 'Manage Listings | Waterstone Admin',
  robots: { index: false, follow: false },
};

export default async function AdminListingsPage() {
  const token = await requireAdminPageSession();
  const [listings, options] = await Promise.all([
    fetchAdminListings(token),
    fetchListingOptions().catch(() => FALLBACK_LISTING_OPTIONS),
  ]);

  return (
    <AdminShell>
      <AdminListingsTable listings={listings} options={options} />
    </AdminShell>
  );
}
