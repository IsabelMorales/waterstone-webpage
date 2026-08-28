export function formatPrice(price: number, type: 'rent' | 'sale'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price || 0);

  return type === 'rent' ? `${formatted}/mo` : formatted;
}

export function formatBedsBaths(bedrooms: number, bathrooms: number): string {
  const beds =
    bedrooms === 0 ? 'Studio' : `${bedrooms} bed${bedrooms === 1 ? '' : 's'}`;
  const baths = `${bathrooms} bath${bathrooms === 1 ? '' : 's'}`;
  return `${beds} · ${baths}`;
}

export function listingCover(images: string[]): string | null {
  return images?.[0] || null;
}
