import { cn } from '@/lib/utils';

export function formatFeeAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

/** Human-readable fee flags for public/admin detail. */
export function formatFeeMeta(fee: {
  oneTime?: boolean;
  required?: boolean;
  refundable?: boolean;
}): string {
  const parts: string[] = [];
  parts.push(fee.oneTime ? 'One-time' : 'Recurring');
  parts.push(fee.required ? 'Required' : 'Optional');
  parts.push(fee.refundable ? 'Refundable' : 'Non-refundable');
  return parts.join(' · ');
}

export function formatPrice(
  price: number,
  type: 'rent' | 'sale' | 'commercial' | string
): string {
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

/** Convert API ISO `YYYY-MM-DD` (or similar) to US `MM/DD/YYYY` for display/edit. */
export function toUsDateDisplay(value: string | null | undefined): string {
  if (!value) return '';
  const trimmed = value.trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (iso) return `${iso[2]}/${iso[3]}/${iso[1]}`;
  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (us) {
    return `${us[1].padStart(2, '0')}/${us[2].padStart(2, '0')}/${us[3]}`;
  }
  return trimmed;
}

/** Parse US `MM/DD/YYYY` (or ISO) to `YYYY-MM-DD` for the API. Empty → null. */
export function toIsoDateValue(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (us) {
    const month = Number(us[1]);
    const day = Number(us[2]);
    const year = Number(us[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return trimmed;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return trimmed;
}

/** Soft mask while typing toward MM/DD/YYYY. */
export function maskUsDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

type ToggleLike = { enabled?: boolean; details?: string | null };

function isToggle(value: unknown): value is ToggleLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'enabled' in value &&
    typeof (value as ToggleLike).enabled === 'boolean'
  );
}

/** Collect enabled amenity labels from a nested boolean / toggle object. */
export function collectAmenityLabels(
  group: Record<string, unknown> | null | undefined,
  labels: Record<string, string>
): string[] {
  if (!group) return [];
  const result: string[] = [];

  Object.entries(group).forEach(([key, value]) => {
    if (typeof value === 'boolean' && value) {
      result.push(labels[key] || key);
      return;
    }
    if (isToggle(value) && value.enabled) {
      const base = labels[key] || key;
      result.push(value.details ? `${base} (${value.details})` : base);
      return;
    }
    if (value && typeof value === 'object' && !isToggle(value)) {
      result.push(
        ...collectAmenityLabels(value as Record<string, unknown>, labels)
      );
    }
  });

  return result;
}

export function youtubeOrVimeoEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = parsed.pathname.split('/');
      const embedIdx = parts.indexOf('embed');
      if (embedIdx >= 0 && parts[embedIdx + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIdx + 1]}`;
      }
    }
    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function isPdfUrl(url: string): boolean {
  return /\.pdf(\?|$)/i.test(url);
}

export function cnAmenityGrid(...classes: string[]) {
  return cn('grid grid-cols-1 sm:grid-cols-2 gap-2', ...classes);
}
