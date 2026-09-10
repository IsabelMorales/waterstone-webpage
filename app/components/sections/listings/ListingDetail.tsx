'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bath, BedDouble, FileText, Maximize2 } from 'lucide-react';
import type { Listing } from '@/lib/types/listing';
import {
  BUILDING_AMENITY_LABELS,
  FURNISHED_STATUS_LABELS,
  UNIT_AMENITY_LABELS,
  mergeBuildingAmenities,
  mergeFees,
  mergeUnitAmenities,
} from '@/lib/listing-defaults';
import {
  collectAmenityLabels,
  formatFeeAmount,
  formatPrice,
  isPdfUrl,
  toUsDateDisplay,
  youtubeOrVimeoEmbed,
} from '@/lib/listings-format';
import ChevronLeft from '../../common/ChevronLeft';
import ListingBadges from '../../common/ListingBadges';
import ListingGallery from '../../common/ListingGallery';
import ListingImageLightbox from '../../common/ListingImageLightbox';
import ListingMedia from '../../common/ListingMedia';
import ListingMediaCarousel from '../../common/ListingMediaCarousel';
import ListingPdfLightbox from '../../common/ListingPdfLightbox';
import AdminFormTabs from '../admin/listing-form/AdminFormTabs';

interface ListingDetailProps {
  listing: Listing;
}

type DetailTabId =
  | 'overview'
  | 'costs'
  | 'amenities'
  | 'building'
  | 'media';

function AmenityChips({ labels }: { labels: string[] }) {
  if (!labels.length) {
    return <p className="text-sm text-gray-500">No amenities listed.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2 list-none">
      {labels.map((label) => (
        <li
          key={label}
          className="rounded-md border border-gray-600/80 bg-gray-900/40 px-3 py-1.5 text-sm text-gray-200"
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

export default function ListingDetail({ listing }: ListingDetailProps) {
  const [floorPlanLightbox, setFloorPlanLightbox] = useState<string | null>(
    null
  );
  const [pdfLightbox, setPdfLightbox] = useState<string | null>(null);
  const images = listing.images?.length ? listing.images : [];
  const beds = listing.rooms?.legalBeds ?? listing.bedrooms ?? 0;
  const baths =
    listing.rooms != null
      ? listing.rooms.fullBaths + listing.rooms.halfBaths * 0.5
      : listing.bathrooms;
  const sqft = listing.rooms?.totalSqft ?? listing.sqft;
  const description =
    listing.rooms?.unitDescription || listing.description || '';

  const bedsLabel =
    beds === 0 ? 'Studio' : `${beds} bed${beds === 1 ? '' : 's'}`;
  const bathsLabel = `${baths} bath${baths === 1 ? '' : 's'}`;

  const fees = mergeFees(listing.fees);
  const buildingAmenityLabels = collectAmenityLabels(
    mergeBuildingAmenities(listing.buildingAmenities) as unknown as Record<
      string,
      unknown
    >,
    BUILDING_AMENITY_LABELS
  );
  const unitAmenityLabels = collectAmenityLabels(
    mergeUnitAmenities(listing.unitAmenities) as unknown as Record<
      string,
      unknown
    >,
    UNIT_AMENITY_LABELS
  );
  const featureFallback =
    unitAmenityLabels.length === 0
      ? (listing.homeFeatures || []).map((f) => f.label)
      : [];
  const amenityLabels = [...unitAmenityLabels, ...featureFallback];
  const facts = listing.buildingFacts;
  const feeRows = [
    fees.application.amount > 0 ? fees.application : null,
    fees.securityDeposit.amount > 0 ? fees.securityDeposit : null,
    ...fees.other.filter((fee) => fee.name.trim()),
  ].filter(Boolean);
  const videos = (listing.videos || []).filter(Boolean);
  const floorPlans = listing.floorPlans || [];
  const policies = listing.policies || [];

  const hasBuildingFacts = Boolean(
    facts &&
      (facts.yearBuilt != null ||
        facts.stories != null ||
        facts.buildingType ||
        facts.buildingClass ||
        facts.period ||
        facts.unitCount != null)
  );

  const tabs = useMemo(() => {
    const items: { id: DetailTabId; label: string }[] = [];
    if (description || policies.length) {
      items.push({ id: 'overview', label: 'Overview' });
    }
    if (feeRows.length) {
      items.push({ id: 'costs', label: 'Costs & fees' });
    }
    if (amenityLabels.length || buildingAmenityLabels.length) {
      items.push({ id: 'amenities', label: 'Amenities' });
    }
    if (hasBuildingFacts) {
      items.push({ id: 'building', label: 'Building' });
    }
    if (videos.length || floorPlans.length) {
      items.push({ id: 'media', label: 'Media' });
    }
    return items;
  }, [
    amenityLabels.length,
    buildingAmenityLabels.length,
    description,
    feeRows.length,
    floorPlans.length,
    hasBuildingFacts,
    policies.length,
    videos.length,
  ]);

  const [activeTab, setActiveTab] = useState<DetailTabId | null>(null);
  const currentTab =
    (activeTab && tabs.some((tab) => tab.id === activeTab)
      ? activeTab
      : tabs[0]?.id) || null;

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
              {sqft != null && (
                <li className="inline-flex items-center gap-2">
                  <Maximize2
                    className="h-5 w-5 text-brand-accent flex-shrink-0"
                    aria-hidden
                  />
                  <span>{Number(sqft).toLocaleString()} sqft</span>
                </li>
              )}
            </ul>

            <ul className="mt-4 space-y-1 text-sm text-gray-400 list-none">
              {listing.rentInfo?.dateAvailable && (
                <li>
                  Available:{' '}
                  <span className="text-gray-300">
                    {toUsDateDisplay(listing.rentInfo.dateAvailable)}
                  </span>
                </li>
              )}
              {listing.furnishedStatus && (
                <li>
                  Furnished:{' '}
                  <span className="text-gray-300">
                    {FURNISHED_STATUS_LABELS[listing.furnishedStatus] ||
                      listing.furnishedStatus}
                  </span>
                </li>
              )}
              {listing.hasConcession && (
                <li className="text-brand-accent">Concession available</li>
              )}
            </ul>

            <div className="mt-8">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-[var(--color-almost-white)] font-semibold rounded-lg hover:bg-brand-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Inquire about this listing
              </Link>
            </div>
          </div>
        </div>

        {tabs.length > 0 && currentTab && (
          <div className="mt-12 md:mt-14 border border-gray-700/80 rounded-lg bg-gray-800/30 px-5 py-6 sm:px-8 sm:py-8">
            <AdminFormTabs
              tabs={tabs}
              activeTab={currentTab}
              onChange={setActiveTab}
              aria-label="Listing details"
              className="mb-6"
            />

            {currentTab === 'overview' && (
              <div className="space-y-8">
                {description && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-3">
                      Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {description}
                    </p>
                  </div>
                )}
                {policies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-3">
                      Policies
                    </h3>
                    <ul className="space-y-1 text-gray-300 list-none">
                      {policies.map((policy) => (
                        <li key={policy}>· {policy}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {currentTab === 'costs' && (
              <ul className="space-y-3 text-gray-300 list-none max-w-lg">
                {feeRows.map((fee) =>
                  fee ? (
                    <li
                      key={`${fee.name}-${fee.amount}`}
                      className="flex justify-between gap-4 border-b border-gray-700/50 pb-3"
                    >
                      <span>{fee.name}</span>
                      <span className="text-[var(--color-almost-white)] font-medium">
                        {formatFeeAmount(fee.amount)}
                      </span>
                    </li>
                  ) : null
                )}
              </ul>
            )}

            {currentTab === 'amenities' && (
              <div className="space-y-8">
                {(amenityLabels.length > 0 || featureFallback.length > 0) && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-3">
                      Unit
                    </h3>
                    <AmenityChips labels={amenityLabels} />
                  </div>
                )}
                {buildingAmenityLabels.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-3">
                      Building
                    </h3>
                    <AmenityChips labels={buildingAmenityLabels} />
                  </div>
                )}
              </div>
            )}

            {currentTab === 'building' && facts && (
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300 list-none">
                {facts.yearBuilt != null && (
                  <li>
                    <span className="block text-xs uppercase tracking-[0.12em] text-brand-accent mb-1">
                      Year built
                    </span>
                    <span className="text-[var(--color-almost-white)]">
                      {facts.yearBuilt}
                    </span>
                  </li>
                )}
                {facts.period && (
                  <li>
                    <span className="block text-xs uppercase tracking-[0.12em] text-brand-accent mb-1">
                      Period
                    </span>
                    <span className="text-[var(--color-almost-white)]">
                      {facts.period}
                    </span>
                  </li>
                )}
                {facts.buildingType && (
                  <li>
                    <span className="block text-xs uppercase tracking-[0.12em] text-brand-accent mb-1">
                      Type
                    </span>
                    <span className="text-[var(--color-almost-white)]">
                      {facts.buildingType}
                    </span>
                  </li>
                )}
                {facts.buildingClass && (
                  <li>
                    <span className="block text-xs uppercase tracking-[0.12em] text-brand-accent mb-1">
                      Class
                    </span>
                    <span className="text-[var(--color-almost-white)]">
                      {facts.buildingClass}
                    </span>
                  </li>
                )}
                {facts.stories != null && (
                  <li>
                    <span className="block text-xs uppercase tracking-[0.12em] text-brand-accent mb-1">
                      Stories
                    </span>
                    <span className="text-[var(--color-almost-white)]">
                      {facts.stories}
                    </span>
                  </li>
                )}
                {facts.unitCount != null && (
                  <li>
                    <span className="block text-xs uppercase tracking-[0.12em] text-brand-accent mb-1">
                      Units
                    </span>
                    <span className="text-[var(--color-almost-white)]">
                      {facts.unitCount}
                    </span>
                  </li>
                )}
              </ul>
            )}

            {currentTab === 'media' && (
              <div className="space-y-10">
                {videos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-4">
                      Videos
                    </h3>
                    <ListingMediaCarousel
                      itemCount={videos.length}
                      ariaLabel="Listing videos"
                      renderSlide={(index) => {
                        const url = videos[index];
                        const embed = youtubeOrVimeoEmbed(url);
                        if (!embed) {
                          return (
                            <div className="absolute inset-0 flex items-center justify-center px-6">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-accent underline text-sm break-all text-center"
                              >
                                {url}
                              </a>
                            </div>
                          );
                        }
                        return (
                          <iframe
                            key={url}
                            src={embed}
                            title={`Listing video ${index + 1}`}
                            className="absolute inset-0 h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        );
                      }}
                    />
                  </div>
                )}

                {floorPlans.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-4">
                      Floor plans
                    </h3>
                    <ListingMediaCarousel
                      itemCount={floorPlans.length}
                      ariaLabel="Floor plans"
                      size="compact"
                      renderSlide={(index) => {
                        const url = floorPlans[index];
                        if (isPdfUrl(url)) {
                          return (
                            <button
                              type="button"
                              onClick={() => setPdfLightbox(url)}
                              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-gray-800/80 to-gray-900/90 px-4 text-center transition-colors hover:from-gray-800 hover:to-gray-900"
                            >
                              <FileText
                                className="h-8 w-8 text-brand-accent"
                                aria-hidden
                              />
                              <span className="text-sm font-semibold text-[var(--color-almost-white)]">
                                Floor plan {index + 1}
                              </span>
                              <span className="text-xs text-brand-accent underline">
                                View PDF
                              </span>
                            </button>
                          );
                        }
                        return (
                          <button
                            type="button"
                            onClick={() => setFloorPlanLightbox(url)}
                            className="absolute inset-0 cursor-zoom-in bg-[var(--color-almost-white)]/95"
                            aria-label={`Open floor plan ${index + 1}`}
                          >
                            <ListingMedia
                              src={url}
                              fill
                              className="object-contain p-2 sm:p-3"
                              sizes="20rem"
                            />
                          </button>
                        );
                      }}
                    />
                    <ListingImageLightbox
                      src={floorPlanLightbox || ''}
                      open={Boolean(floorPlanLightbox)}
                      onClose={() => setFloorPlanLightbox(null)}
                      images={floorPlans.filter((url) => !isPdfUrl(url))}
                      activeIndex={Math.max(
                        0,
                        floorPlans
                          .filter((url) => !isPdfUrl(url))
                          .indexOf(floorPlanLightbox || '')
                      )}
                      onNavigate={(nextIndex) => {
                        const imagePlans = floorPlans.filter(
                          (url) => !isPdfUrl(url)
                        );
                        setFloorPlanLightbox(imagePlans[nextIndex] || null);
                      }}
                    />
                    <ListingPdfLightbox
                      src={pdfLightbox || ''}
                      open={Boolean(pdfLightbox)}
                      onClose={() => setPdfLightbox(null)}
                      title="Floor plan PDF"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
