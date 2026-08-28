'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Listing } from '@/lib/types/listing';
import {
  formatBedsBaths,
  formatPrice,
} from '@/lib/listings-format';
import { cn } from '@/lib/utils';
import ChevronLeft from '../../common/ChevronLeft';
import ListingBadges from '../../common/ListingBadges';
import ListingGallery from '../../common/ListingGallery';
import {
  adminPrimaryBtnClassName,
  adminSecondaryBtnClassName,
} from './admin-ui';

interface AdminListingDetailProps {
  listing: Listing;
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-700/60 py-4 first:pt-0 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent">
        {label}
      </dt>
      <dd className="mt-2 text-base text-[var(--color-almost-white)] leading-relaxed whitespace-pre-line">
        {value || <span className="text-gray-500">—</span>}
      </dd>
    </div>
  );
}

export default function AdminListingDetail({ listing }: AdminListingDetailProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const images = listing.images?.length ? listing.images : [];

  async function handleDelete() {
    if (!window.confirm(`Delete “${listing.title}”? This cannot be undone.`)) {
      return;
    }
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'DELETE',
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message || 'Delete failed.');
        setBusy(false);
        return;
      }
      window.location.assign('/admin/listings');
    } catch {
      setError('Unable to delete listing.');
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Link
        href="/admin/listings"
        className="inline-flex items-center gap-2 text-base md:text-lg font-medium text-[var(--color-almost-white)] hover:text-brand-accent transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to listings
      </Link>

      <div className="mt-5 mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="mt-1.5 h-10 w-0.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: 'var(--color-brand-accent)' }}
            aria-hidden
          />
          <div className="min-w-0">
            <ListingBadges type={listing.type} status={listing.status} />
            <h1 className="mt-3 text-2xl md:text-3xl font-light uppercase tracking-[0.08em] text-[var(--color-almost-white)] leading-snug">
              {listing.title}
            </h1>
            <p className="mt-2 text-sm text-gray-400">{listing.address}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/listings/${listing.id}/edit`}
            className={adminPrimaryBtnClassName}
          >
            Edit listing
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className={cn(
              adminSecondaryBtnClassName,
              'border-red-500/40 text-red-300 hover:border-red-400 hover:text-red-200'
            )}
          >
            {busy ? 'Deleting…' : 'Delete'}
          </button>
          <Link
            href={`/listings/${listing.slug}`}
            className={adminSecondaryBtnClassName}
          >
            Preview public page
          </Link>
        </div>
      </div>

      {error && (
        <p className="mb-6 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <ListingGallery images={images} />

        <div className="border border-gray-700/80 rounded-lg bg-gray-800/40 px-6 py-6 md:px-8">
          <dl>
            <Field label="Title" value={listing.title} />
            <Field label="Type" value={listing.type === 'rent' ? 'Rent' : 'Sale'} />
            <Field label="Status" value={listing.status} />
            <Field
              label="Price"
              value={formatPrice(listing.price, listing.type)}
            />
            <Field label="Address" value={listing.address} />
            <Field label="Borough" value={listing.borough} />
            <Field label="Neighborhood" value={listing.neighborhood} />
            <Field
              label="Bedrooms / Bathrooms"
              value={formatBedsBaths(listing.bedrooms, listing.bathrooms)}
            />
            <Field
              label="Square feet"
              value={
                listing.sqft != null ? listing.sqft.toLocaleString() : null
              }
            />
            <Field label="Description" value={listing.description} />
          </dl>
        </div>
      </div>
    </div>
  );
}
