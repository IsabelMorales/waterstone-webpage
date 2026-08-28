'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';
import ListingMedia from '../../common/ListingMedia';
import ListingTabs from '../../common/ListingTabs';
import type { Listing, ListingType } from '@/lib/types/listing';
import {
  formatBedsBaths,
  formatPrice,
  listingCover,
} from '@/lib/listings-format';

interface ListingsGridProps {
  listings: Listing[];
}

const TABS: { id: ListingType; label: string }[] = [
  { id: 'rent', label: 'For rent' },
  { id: 'sale', label: 'For sale' },
];

export default function ListingsGrid({ listings }: ListingsGridProps) {
  const [activeTab, setActiveTab] = useState<ListingType>('rent');

  const filtered = useMemo(
    () => listings.filter((listing) => listing.type === activeTab),
    [listings, activeTab]
  );

  const tabItems = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        count: listings.filter((l) => l.type === tab.id).length,
      })),
    [listings]
  );

  const emptyCopy =
    activeTab === 'rent'
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

        <ListingTabs
          className="mb-10"
          tabs={tabItems}
          activeTab={activeTab}
          onChange={setActiveTab}
          buttonClassName="text-sm md:text-base"
        />

        <AnimatedOnScroll>
          <div
            key={activeTab}
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
                      {emptyCopy}
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
                {filtered.map((listing, index) => {
                  const cover = listingCover(listing.images);
                  return (
                    <li key={listing.id}>
                      <Link
                        href={`/listings/${listing.slug}`}
                        className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
                      >
                        <article
                          aria-labelledby={`listing-title-${listing.id}`}
                        >
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
                            {cover ? (
                              <ListingMedia
                                src={cover}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                priority={index < 3}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                No photo
                              </div>
                            )}
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
                                {formatBedsBaths(
                                  listing.bedrooms,
                                  listing.bathrooms
                                )}
                              </p>
                              <p className="mt-1 text-base font-medium text-[var(--color-almost-white)]">
                                {formatPrice(listing.price, listing.type)}
                              </p>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </AnimatedOnScroll>
      </div>
    </section>
  );
}
