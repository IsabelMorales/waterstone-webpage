'use client';

import Link from 'next/link';
import {
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type MutableRefObject,
} from 'react';
import { GripVertical } from 'lucide-react';
import type { Listing, ListingCatalogOptions, ListingType } from '@/lib/types/listing';
import {
  FALLBACK_LISTING_OPTIONS,
  listingTypeLabel,
} from '@/lib/listing-options';
import { formatBedsBaths, formatPrice } from '@/lib/listings-format';
import { cn } from '@/lib/utils';
import ListingBadges from '../../common/ListingBadges';
import ListingCardHoverGallery from '../../common/ListingCardHoverGallery';
import ListingTabs from '../../common/ListingTabs';
import { adminPrimaryBtnClassName } from './admin-ui';

interface AdminListingsTableProps {
  listings: Listing[];
  options?: ListingCatalogOptions;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function AdminListingCard({
  listing,
  orderLabel,
  canReorder,
  savingOrder,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  didDragRef,
}: {
  listing: Listing;
  orderLabel: number;
  canReorder: boolean;
  savingOrder: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragOver: (event: DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  didDragRef: MutableRefObject<boolean>;
}) {
  const [hovered, setHovered] = useState(false);
  const images = listing.images?.filter(Boolean) || [];

  return (
    <li
      draggable={canReorder && !savingOrder}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        canReorder && 'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-60 ring-2 ring-brand-accent rounded-lg'
      )}
    >
      <div
        className="relative group border border-gray-700/80 rounded-lg bg-gray-800/40 overflow-hidden transition-colors hover:border-brand-accent/60"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {canReorder && (
          <span className="pointer-events-none absolute left-2 top-2 z-10 rounded bg-black/55 p-1 text-gray-300">
            <GripVertical className="h-4 w-4" />
          </span>
        )}
        <Link
          href={`/admin/listings/${listing.id}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          draggable={false}
          onClick={(event) => {
            if (didDragRef.current) {
              event.preventDefault();
              didDragRef.current = false;
            }
          }}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-900">
            <ListingCardHoverGallery images={images} hovered={hovered} />
            {canReorder && (
              <span className="pointer-events-none absolute bottom-2 left-2 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-gray-200">
                #{orderLabel}
              </span>
            )}
          </div>
          <div className="p-5">
            <ListingBadges type={listing.type} status={listing.status} />
            <h2 className="mt-3 text-lg font-semibold text-[var(--color-almost-white)] leading-snug group-hover:text-brand-accent transition-colors">
              {listing.title}
            </h2>
            <p className="mt-1 text-sm text-gray-300 leading-snug">
              {listing.address}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {formatBedsBaths(listing.bedrooms, listing.bathrooms)}
            </p>
            <p className="mt-2 text-base font-medium text-[var(--color-almost-white)]">
              {formatPrice(listing.price, listing.type)}
            </p>
          </div>
        </Link>
      </div>
    </li>
  );
}

export default function AdminListingsTable({
  listings: initialListings,
  options = FALLBACK_LISTING_OPTIONS,
}: AdminListingsTableProps) {
  const typeIds = options.types.length
    ? options.types
    : FALLBACK_LISTING_OPTIONS.types;

  const [listings, setListings] = useState(initialListings);
  const [activeTab, setActiveTab] = useState<ListingType | 'all'>('all');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [orderError, setOrderError] = useState('');
  const didDragRef = useRef(false);

  const canReorder = activeTab === 'all' && listings.length > 1;

  const filtered = useMemo(
    () =>
      activeTab === 'all'
        ? listings
        : listings.filter((listing) => listing.type === activeTab),
    [listings, activeTab]
  );

  const tabItems = useMemo(
    () => [
      {
        id: 'all' as const,
        label: 'All',
        count: listings.length,
      },
      ...typeIds.map((id) => ({
        id,
        label: listingTypeLabel(id),
        count: listings.filter((l) => l.type === id).length,
      })),
    ],
    [listings, typeIds]
  );

  async function persistOrder(nextListings: Listing[]) {
    setSavingOrder(true);
    setOrderError('');
    setOrderMessage('');
    try {
      const response = await fetch('/api/admin/listings/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderedIds: nextListings.map((listing) => listing.id),
        }),
      });
      const data = (await response.json()) as {
        message?: string;
        listings?: Listing[];
      };
      if (!response.ok) {
        setOrderError(data.message || 'Could not save order.');
        setListings(initialListings);
        return;
      }
      if (data.listings) setListings(data.listings);
      setOrderMessage('Display order saved.');
    } catch {
      setOrderError('Could not save order.');
      setListings(initialListings);
    } finally {
      setSavingOrder(false);
    }
  }

  function handleDragStart(index: number) {
    if (!canReorder || savingOrder) return;
    didDragRef.current = false;
    setDragIndex(index);
    setOrderMessage('');
    setOrderError('');
  }

  function handleDragOver(event: DragEvent) {
    if (!canReorder) return;
    event.preventDefault();
  }

  function handleDrop(toIndex: number) {
    if (!canReorder || dragIndex == null) {
      setDragIndex(null);
      return;
    }
    if (dragIndex === toIndex) {
      setDragIndex(null);
      return;
    }
    didDragRef.current = true;
    const next = moveItem(listings, dragIndex, toIndex);
    setDragIndex(null);
    setListings(next);
    void persistOrder(next);
  }

  function handleDragEnd() {
    setDragIndex(null);
    // Clear after the click that often follows a completed/cancelled drag.
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  }

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
            {canReorder && (
              <p className="mt-1 text-xs text-gray-500">
                Drag cards to set the public catalog order
                {savingOrder ? ' · saving…' : ''}.
              </p>
            )}
          </div>
        </div>
        <Link href="/admin/listings/new" className={adminPrimaryBtnClassName}>
          New listing
        </Link>
      </div>

      {(orderMessage || orderError) && (
        <p
          className={cn(
            'text-sm',
            orderError ? 'text-red-400' : 'text-emerald-300'
          )}
          role={orderError ? 'alert' : 'status'}
        >
          {orderError || orderMessage}
        </p>
      )}

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
              {filtered.map((listing, index) => {
                const globalIndex = listings.findIndex(
                  (item) => item.id === listing.id
                );
                return (
                  <AdminListingCard
                    key={listing.id}
                    listing={listing}
                    orderLabel={index + 1}
                    canReorder={canReorder}
                    savingOrder={savingOrder}
                    isDragging={dragIndex === globalIndex}
                    onDragStart={() => handleDragStart(globalIndex)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(globalIndex)}
                    onDragEnd={handleDragEnd}
                    didDragRef={didDragRef}
                  />
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
