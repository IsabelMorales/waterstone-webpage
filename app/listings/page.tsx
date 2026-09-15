import type { Metadata } from 'next';
import ListingsHero from '../components/sections/listings/ListingsHero';
import ListingsGrid from '../components/sections/listings/ListingsGrid';
import {
  fetchListingOptions,
  fetchListings,
  WaterstoneApiError,
} from '@/lib/api/waterstone';
import { FALLBACK_LISTING_OPTIONS } from '@/lib/listing-options';
import type { Listing, ListingCatalogOptions } from '@/lib/types/listing';

export const metadata: Metadata = {
  title: 'Listings | Waterstone - Property Management',
  description:
    'Browse current rental, sale, and commercial listings managed by WaterStone Group across New York City.',
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

async function loadOptions(): Promise<ListingCatalogOptions> {
  try {
    return await fetchListingOptions();
  } catch (err) {
    console.error('[listings.page.options]', err);
    return FALLBACK_LISTING_OPTIONS;
  }
}

export default async function ListingsPage() {
  const [listings, options] = await Promise.all([
    loadAvailableListings(),
    loadOptions(),
  ]);

  return (
    <div className="min-h-screen bg-brand-dark">
      <ListingsHero />
      <ListingsGrid listings={listings} options={options} />
    </div>
  );
}
