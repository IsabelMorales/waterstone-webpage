'use client';

import Link from 'next/link';
import { Bath, BedDouble, Maximize2 } from 'lucide-react';
import type { Listing } from '@/lib/types/listing';
import { formatPrice } from '@/lib/listings-format';
import ChevronLeft from '../../common/ChevronLeft';
import ListingBadges from '../../common/ListingBadges';
import ListingGallery from '../../common/ListingGallery';

interface ListingDetailProps {
  listing: Listing;
}

export default function ListingDetail({ listing }: ListingDetailProps) {
  const images = listing.images?.length ? listing.images : [];
  const bedsLabel =
    listing.bedrooms === 0
      ? 'Studio'
      : `${listing.bedrooms} bed${listing.bedrooms === 1 ? '' : 's'}`;
  const bathsLabel = `${listing.bathrooms} bath${
    listing.bathrooms === 1 ? '' : 's'
  }`;

  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="mb-8">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-base md:text-lg font-medium text-[var(--color-almost-white)] hover:text-brand-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to listings
          </Link>
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12 lg:items-start">
          <ListingGallery images={images} size="large" />

          <div>
            <ListingBadges type={listing.type} status={listing.status} />
            <h1 className="mt-4 text-3xl sm:text-4xl font-light uppercase tracking-[0.08em] text-[var(--color-almost-white)] leading-snug">
              {listing.title}
            </h1>
            <p className="mt-3 text-base text-gray-300">{listing.address}</p>
            {listing.neighborhood && (
              <p className="mt-1 text-sm text-gray-400">
                {listing.neighborhood}
              </p>
            )}

            <p className="mt-6 text-2xl md:text-3xl font-semibold text-[var(--color-almost-white)]">
              {formatPrice(listing.price, listing.type)}
            </p>

            <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 list-none text-gray-300">
              <li className="inline-flex items-center gap-2">
                <BedDouble
                  className="h-5 w-5 text-brand-accent flex-shrink-0"
                  aria-hidden
                />
                <span>{bedsLabel}</span>
              </li>
              <li className="inline-flex items-center gap-2">
                <Bath
                  className="h-5 w-5 text-brand-accent flex-shrink-0"
                  aria-hidden
                />
                <span>{bathsLabel}</span>
              </li>
              {listing.sqft != null && (
                <li className="inline-flex items-center gap-2">
                  <Maximize2
                    className="h-5 w-5 text-brand-accent flex-shrink-0"
                    aria-hidden
                  />
                  <span>{listing.sqft.toLocaleString()} sqft</span>
                </li>
              )}
            </ul>

            {listing.description && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-[var(--color-almost-white)] mb-3">
                  Description
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            )}

            {listing.homeFeatures?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-[var(--color-almost-white)] mb-3">
                  Features
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
                  {listing.homeFeatures.map((feature) => (
                    <li key={feature.label}>· {feature.label}</li>
                  ))}
                </ul>
              </div>
            )}

            {listing.policies?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-[var(--color-almost-white)] mb-3">
                  Policies
                </h2>
                <ul className="space-y-1 text-gray-300">
                  {listing.policies.map((policy) => (
                    <li key={policy}>· {policy}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-[var(--color-almost-white)] font-semibold rounded-lg hover:bg-brand-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Inquire about this listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
