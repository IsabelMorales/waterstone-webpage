import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminShell from '../../../../components/sections/admin/AdminShell';
import ListingForm from '../../../../components/sections/admin/ListingForm';
import { requireAdminPageSession } from '@/lib/api/admin-guard';
import { fetchListingById, WaterstoneApiError } from '@/lib/api/waterstone';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Edit Listing | Waterstone Admin',
  robots: { index: false, follow: false },
};

export default async function AdminEditListingPage({ params }: PageProps) {
  await requireAdminPageSession();

  const { id } = await params;

  try {
    const listing = await fetchListingById(id);
    return (
      <AdminShell>
        <ListingForm mode="edit" listing={listing} />
      </AdminShell>
    );
  } catch (err) {
    if (err instanceof WaterstoneApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
