import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingDetail from '../../components/sections/listings/ListingDetail';
import {
  fetchListingBySlug,
  WaterstoneApiError,
} from '@/lib/api/waterstone';
import type { Listing } from '@/lib/types/listing';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const listing = await fetchListingBySlug(slug);
    return {
      title: `${listing.title} | Waterstone Listings`,
      description:
        listing.description?.slice(0, 160) ||
        `${listing.title} — ${listing.address}`,
    };
  } catch {
    return {
      title: 'Listing | Waterstone',
      description: 'WaterStone Group listing detail.',
    };
  }
}

async function loadListing(slug: string): Promise<Listing> {
  try {
    return await fetchListingBySlug(slug);
  } catch (err) {
    if (err instanceof WaterstoneApiError && err.status === 404) {
      notFound();
    }
    console.error('[listings.slug]', err);
    notFound();
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const listing = await loadListing(slug);

  return (
    <div className="min-h-screen bg-brand-dark">
      <ListingDetail listing={listing} />
    </div>
  );
}
