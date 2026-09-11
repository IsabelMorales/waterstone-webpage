'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';
import ListingCardHoverGallery from '../../common/ListingCardHoverGallery';
import ListingTabs from '../../common/ListingTabs';
import type { Listing, ListingType } from '@/lib/types/listing';
import { formatBedsBaths, formatPrice } from '@/lib/listings-format';

interface ListingsGridProps {
  listings: Listing[];
}

const TABS: { id: ListingType; label: string }[] = [
  { id: 'rent', label: 'For rent' },
  { id: 'sale', label: 'For sale' },
];

function ListingCard({
  listing,
  priority,
}: {
  listing: Listing;
  priority?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const images = listing.images?.filter(Boolean) || [];

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <article aria-labelledby={`listing-title-${listing.id}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
          <ListingCardHoverGallery
            images={images}
            hovered={hovered}
            priority={priority}
          />
        </div>
        <div className="mt-3 flex items-start gap-3">
          <div
            className="w-0.5 h-10 flex-shrink-0 rounded-full mt-1"
            style={{
              backgroundColor: 'var(--color-brand-accent)',
            }}
            aria-hidden
          />
          <div>
            <h2
              id={`listing-title-${listing.id}`}
              className="text-lg md:text-xl font-semibold text-[var(--color-almost-white)] leading-snug group-hover:text-brand-accent transition-colors"
            >
              {listing.title}
            </h2>
            <p className="mt-1 text-sm text-gray-300 leading-snug">
              {listing.address}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {formatBedsBaths(listing.bedrooms, listing.bathrooms)}
            </p>
            <p className="mt-1 text-base font-medium text-[var(--color-almost-white)]">
              {formatPrice(listing.price, listing.type)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  const tabItems = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        count: listings.filter((l) => l.type === tab.id).length,
      })).filter((tab) => tab.count > 0),
    [listings]
  );

  const [activeTab, setActiveTab] = useState<ListingType>(
    () => tabItems[0]?.id || 'rent'
  );

  const resolvedTab =
    tabItems.find((tab) => tab.id === activeTab)?.id ||
    tabItems[0]?.id ||
    activeTab;

  const filtered = useMemo(
    () => listings.filter((listing) => listing.type === resolvedTab),
    [listings, resolvedTab]
  );

  const emptyCopy =
    resolvedTab === 'rent'
      ? 'No rentals available right now'
      : 'No sales available right now';

  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl mb-8 md:mb-10">
            Explore our currently available listings below. Properties are
            managed by WaterStone Group and updated as units become available.
          </p>
        </AnimatedOnScroll>

        {tabItems.length > 0 && (
          <ListingTabs
            className="mb-10"
            tabs={tabItems}
            activeTab={resolvedTab}
            onChange={setActiveTab}
            buttonClassName="text-sm md:text-base"
          />
        )}

        <AnimatedOnScroll>
          <div
            key={resolvedTab}
            className="tab-panel-enter"
            role="tabpanel"
            aria-live="polite"
          >
            {!filtered.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                <div className="sm:col-span-2 lg:col-span-3">
                  <div className="relative w-full min-h-[14rem] sm:min-h-[16rem] md:min-h-[18rem] bg-gray-800/60 flex flex-col items-start justify-center px-6 py-10 md:px-10 rounded-lg">
                    <div
                      className="w-0.5 h-10 rounded-full mb-4"
                      style={{ backgroundColor: 'var(--color-brand-accent)' }}
                      aria-hidden
                    />
                    <p className="text-lg md:text-xl font-semibold text-[var(--color-almost-white)]">
                      {listings.length === 0
                        ? 'No listings available right now'
                        : emptyCopy}
                    </p>
                    <p className="mt-2 text-sm md:text-base text-gray-400 max-w-xl leading-relaxed">
                      New options will appear here as units become available.
                      Feel free to{' '}
                      <Link
                        href="/contact-us"
                        className="text-brand-accent hover:underline"
                      >
                        contact us
                      </Link>{' '}
                      if you would like to hear about upcoming opportunities.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 list-none">
                {filtered.map((listing, index) => (
                  <li key={listing.id}>
                    <ListingCard listing={listing} priority={index < 3} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AnimatedOnScroll>
      </div>
    </section>
  );
}
