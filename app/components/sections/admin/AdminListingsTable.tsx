'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Listing, ListingType } from '@/lib/types/listing';
import {
  formatBedsBaths,
  formatPrice,
  listingCover,
} from '@/lib/listings-format';
import { cn } from '@/lib/utils';
import ListingMedia from '../../common/ListingMedia';
import ListingBadges from '../../common/ListingBadges';
import ListingTabs from '../../common/ListingTabs';
import { adminPrimaryBtnClassName } from './admin-ui';

interface AdminListingsTableProps {
  listings: Listing[];
}

const TABS: { id: ListingType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'rent', label: 'For rent' },
  { id: 'sale', label: 'For sale' },
];

export default function AdminListingsTable({
  listings,
}: AdminListingsTableProps) {
  const [activeTab, setActiveTab] = useState<ListingType | 'all'>('all');

  const filtered = useMemo(
    () =>
      activeTab === 'all'
        ? listings
        : listings.filter((listing) => listing.type === activeTab),
    [listings, activeTab]
  );

  const tabItems = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        count:
          tab.id === 'all'
            ? listings.length
            : listings.filter((l) => l.type === tab.id).length,
      })),
    [listings]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div className="flex items-start gap-3">
          <div
            className="mt-1.5 h-10 w-0.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: 'var(--color-brand-accent)' }}
            aria-hidden
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.1em] text-[var(--color-almost-white)]">
              Listings
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {listings.length} listing{listings.length === 1 ? '' : 's'} in the
              catalog · tap a card to manage
            </p>
          </div>
        </div>
        <Link href="/admin/listings/new" className={adminPrimaryBtnClassName}>
          New listing
        </Link>
      </div>

      <ListingTabs
        tabs={tabItems}
        activeTab={activeTab}
        onChange={setActiveTab}
        buttonClassName="text-sm"
      />

      {!listings.length ? (
        <div className="border border-dashed border-gray-700 rounded-lg bg-gray-900/30 px-6 py-14 text-center">
          <p className="text-[var(--color-almost-white)] font-medium">
            No listings yet
          </p>
          <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
            Create the first listing to populate the public catalog.
          </p>
          <Link
            href="/admin/listings/new"
            className={cn(adminPrimaryBtnClassName, 'mt-6')}
          >
            Create listing
          </Link>
        </div>
      ) : (
        <div
          key={activeTab}
          className="tab-panel-enter"
          role="tabpanel"
          aria-live="polite"
        >
          {!filtered.length ? (
            <p className="text-gray-400 text-sm">No listings in this tab.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
              {filtered.map((listing) => {
                const cover = listingCover(listing.images);
                return (
                  <li key={listing.id}>
                    <Link
                      href={`/admin/listings/${listing.id}`}
                      className="group block border border-gray-700/80 rounded-lg bg-gray-800/40 overflow-hidden transition-colors hover:border-brand-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-900">
                        {cover ? (
                          <ListingMedia
                            src={cover}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                            No photo
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <ListingBadges
                          type={listing.type}
                          status={listing.status}
                        />
                        <h2 className="mt-3 text-lg font-semibold text-[var(--color-almost-white)] leading-snug group-hover:text-brand-accent transition-colors">
                          {listing.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-300 leading-snug">
                          {listing.address}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {formatBedsBaths(
                            listing.bedrooms,
                            listing.bathrooms
                          )}
                        </p>
                        <p className="mt-2 text-base font-medium text-[var(--color-almost-white)]">
                          {formatPrice(listing.price, listing.type)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
