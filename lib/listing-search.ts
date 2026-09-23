import type { Listing } from '@/lib/types/listing';
import {
  listingStatusLabel,
  listingTypeLabel,
} from '@/lib/listing-options';
import { formatBedsBaths, formatPrice } from '@/lib/listings-format';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** Build a searchable string from fields shown on listing cards (plus labels). */
export function listingSearchHaystack(listing: Listing): string {
  const parts = [
    listing.title,
    listing.address,
    listing.borough,
    listing.neighborhood ?? '',
    String(listing.price ?? ''),
    formatPrice(listing.price, listing.type),
    formatBedsBaths(listing.bedrooms, listing.bathrooms),
    listingTypeLabel(listing.type),
    listingStatusLabel(listing.status),
    listing.type,
    listing.status,
  ];

  return normalize(parts.filter(Boolean).join(' '));
}

/**
 * Match a listing against a free-text query.
 * Empty query matches everything; multi-word queries require every token.
 */
export function matchesListingSearch(
  listing: Listing,
  query: string
): boolean {
  const q = normalize(query);
  if (!q) return true;

  const haystack = listingSearchHaystack(listing);
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}
