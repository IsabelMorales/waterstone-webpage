import type {
  FurnishedStatus,
  ListingCatalogOptions,
  ListingStatus,
  ListingType,
} from '@/lib/types/listing';

/** Used when the options endpoint is unreachable. */
export const FALLBACK_LISTING_OPTIONS: ListingCatalogOptions = {
  types: ['rent', 'sale', 'commercial'],
  statusesByType: {
    rent: ['available', 'pending', 'rented'],
    sale: ['available', 'pending', 'sold'],
    commercial: ['available', 'pending', 'rented', 'sold'],
  },
  furnishedStatuses: ['furnished', 'not_furnished', 'offered_as_either'],
  marketAs: ['Commercial', 'Rental'],
  defaults: {
    status: 'available',
    furnishedStatus: 'not_furnished',
    marketAs: 'Rental',
    hasConcession: false,
  },
};

const TYPE_LABELS: Record<string, string> = {
  rent: 'For rent',
  sale: 'For sale',
  commercial: 'Commercial',
};

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  pending: 'Pending',
  rented: 'Rented',
  sold: 'Sold',
};

const FURNISHED_LABELS: Record<string, string> = {
  furnished: 'Furnished',
  not_furnished: 'Not furnished',
  offered_as_either: 'Offered as either',
};

export function listingTypeLabel(type: string): string {
  return TYPE_LABELS[type] || type;
}

export function listingStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}

export function furnishedStatusLabel(status: string): string {
  return FURNISHED_LABELS[status] || status;
}

export function statusesForType(
  type: ListingType | string,
  options: ListingCatalogOptions = FALLBACK_LISTING_OPTIONS
): ListingStatus[] {
  const list = options.statusesByType[type];
  if (list?.length) return list;
  return options.statusesByType.rent || FALLBACK_LISTING_OPTIONS.statusesByType.rent;
}

export function furnishedStatusOptions(
  options: ListingCatalogOptions = FALLBACK_LISTING_OPTIONS
): { value: FurnishedStatus; label: string }[] {
  return options.furnishedStatuses.map((value) => ({
    value,
    label: furnishedStatusLabel(value),
  }));
}

export function priceUsesMonthlySuffix(type: ListingType | string): boolean {
  return type === 'rent';
}
