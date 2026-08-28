import type { Metadata } from 'next';
import AdminShell from '../../../components/sections/admin/AdminShell';
import ListingForm from '../../../components/sections/admin/ListingForm';
import { requireAdminPageSession } from '@/lib/api/admin-guard';

export const metadata: Metadata = {
  title: 'New Listing | Waterstone Admin',
  robots: { index: false, follow: false },
};

export default async function AdminNewListingPage() {
  await requireAdminPageSession();

  return (
    <AdminShell>
      <ListingForm mode="create" />
    </AdminShell>
  );
}
