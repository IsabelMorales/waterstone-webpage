import type { Metadata } from 'next';
import ListingsHero from '../components/sections/listings/ListingsHero';
import ListingsGrid from '../components/sections/listings/ListingsGrid';
import { fetchListings, WaterstoneApiError } from '@/lib/api/waterstone';
import type { Listing } from '@/lib/types/listing';

export const metadata: Metadata = {
  title: 'Listings | Waterstone - Property Management',
  description:
    'Browse current rental and sale listings managed by WaterStone Group across New York City.',
};

export const dynamic = 'force-dynamic';

async function loadAvailableListings(): Promise<Listing[]> {
  try {
    return await fetchListings({ status: 'available' });
  } catch (err) {
    if (err instanceof WaterstoneApiError) {
      console.error('[listings.page]', err.message);
    } else {
      console.error('[listings.page]', err);
    }
    return [];
  }
}

export default async function ListingsPage() {
  const listings = await loadAvailableListings();

  return (
    <div className="min-h-screen bg-brand-dark">
      <ListingsHero />
      <ListingsGrid listings={listings} />
    </div>
  );
}
