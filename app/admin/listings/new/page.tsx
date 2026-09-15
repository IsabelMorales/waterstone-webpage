import type { Metadata } from 'next';
import AdminShell from '../../../components/sections/admin/AdminShell';
import ListingForm from '../../../components/sections/admin/ListingForm';
import { requireAdminPageSession } from '@/lib/api/admin-guard';
import { fetchListingOptions } from '@/lib/api/waterstone';
import { FALLBACK_LISTING_OPTIONS } from '@/lib/listing-options';

export const metadata: Metadata = {
  title: 'New Listing | Waterstone Admin',
  robots: { index: false, follow: false },
};

export default async function AdminNewListingPage() {
  await requireAdminPageSession();
  const options = await fetchListingOptions().catch(
    () => FALLBACK_LISTING_OPTIONS
  );

  return (
    <AdminShell>
      <ListingForm mode="create" options={options} />
    </AdminShell>
  );
}
