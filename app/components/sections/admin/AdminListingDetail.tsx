'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Listing } from '@/lib/types/listing';
import {
  FURNISHED_STATUS_LABELS,
  BUILDING_AMENITY_LABELS,
  UNIT_AMENITY_LABELS,
  mergeBuildingAmenities,
  mergeFees,
  mergeUnitAmenities,
} from '@/lib/listing-defaults';
import {
  collectAmenityLabels,
  formatBedsBaths,
  formatFeeAmount,
  formatPrice,
  isPdfUrl,
  toUsDateDisplay,
} from '@/lib/listings-format';
import { cn } from '@/lib/utils';
import ChevronLeft from '../../common/ChevronLeft';
import ListingBadges from '../../common/ListingBadges';
import ListingGallery from '../../common/ListingGallery';
import {
  adminPrimaryBtnClassName,
  adminSecondaryBtnClassName,
} from './admin-ui';
import AdminFormTabs from './listing-form/AdminFormTabs';

interface AdminListingDetailProps {
  listing: Listing;
}

type DetailTabId =
  | 'overview'
  | 'costs'
  | 'amenities'
  | 'building'
  | 'media';

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-700/60 py-3 first:pt-0 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent">
        {label}
      </dt>
      <dd className="mt-1.5 text-base text-[var(--color-almost-white)] leading-relaxed whitespace-pre-line">
        {value || <span className="text-gray-500">—</span>}
      </dd>
    </div>
  );
}

function AmenityChips({ labels }: { labels: string[] }) {
  if (!labels.length) {
    return <p className="text-sm text-gray-500">None listed.</p>;
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

export default function AdminListingDetail({
  listing,
}: AdminListingDetailProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const images = listing.images?.length ? listing.images : [];
  const beds = listing.rooms?.legalBeds ?? listing.bedrooms ?? 0;
  const baths =
    listing.rooms != null
      ? listing.rooms.fullBaths + listing.rooms.halfBaths * 0.5
      : listing.bathrooms;
  const sqft = listing.rooms?.totalSqft ?? listing.sqft;
  const description =
    listing.rooms?.unitDescription || listing.description || '';
  const fees = mergeFees(listing.fees);
  const buildingLabels = collectAmenityLabels(
    mergeBuildingAmenities(listing.buildingAmenities) as unknown as Record<
      string,
      unknown
    >,
    BUILDING_AMENITY_LABELS
  );
  const unitLabels = collectAmenityLabels(
    mergeUnitAmenities(listing.unitAmenities) as unknown as Record<
      string,
      unknown
    >,
    UNIT_AMENITY_LABELS
  );
  const facts = listing.buildingFacts;
  const videos = (listing.videos || []).filter(Boolean);
  const floorPlans = listing.floorPlans || [];
  const feeRows = [
    fees.application,
    fees.securityDeposit,
    ...fees.other.filter((fee) => fee.name.trim()),
  ];
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
    const items: { id: DetailTabId; label: string }[] = [
      { id: 'overview', label: 'Overview' },
      { id: 'costs', label: 'Costs & fees' },
    ];
    if (unitLabels.length || buildingLabels.length) {
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
    buildingLabels.length,
    floorPlans.length,
    hasBuildingFacts,
    unitLabels.length,
    videos.length,
  ]);

  const [activeTab, setActiveTab] = useState<DetailTabId>('overview');
  const currentTab =
    tabs.find((tab) => tab.id === activeTab)?.id || tabs[0]?.id || 'overview';

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
            <Field
              label="Type"
              value={listing.type === 'rent' ? 'Rent' : 'Sale'}
            />
            <Field label="Status" value={listing.status} />
            <Field
              label="Price"
              value={formatPrice(listing.price, listing.type)}
            />
            <Field label="Borough" value={listing.borough} />
            <Field label="Neighborhood" value={listing.neighborhood} />
            <Field
              label="Bedrooms / Bathrooms"
              value={formatBedsBaths(beds, baths)}
            />
            <Field
              label="Square feet"
              value={sqft != null ? Number(sqft).toLocaleString() : null}
            />
            <Field
              label="Available"
              value={toUsDateDisplay(listing.rentInfo?.dateAvailable)}
            />
            <Field
              label="Furnished"
              value={
                listing.furnishedStatus
                  ? FURNISHED_STATUS_LABELS[listing.furnishedStatus]
                  : null
              }
            />
            <Field
              label="Concession"
              value={listing.hasConcession ? 'Yes' : 'No'}
            />
          </dl>
        </div>
      </div>

      <div className="mt-10 border border-gray-700/80 rounded-lg bg-gray-800/40 px-5 py-6 sm:px-8 sm:py-8">
        <AdminFormTabs
          tabs={tabs}
          activeTab={currentTab}
          onChange={setActiveTab}
          aria-label="Listing details"
          className="mb-6"
        />

        {currentTab === 'overview' && (
          <Field label="Description" value={description || null} />
        )}

        {currentTab === 'costs' && (
          <ul className="space-y-3 list-none">
            {feeRows.map((fee) => (
              <li
                key={`${fee.name}-${fee.id || fee.amount}`}
                className="flex justify-between gap-4 border-b border-gray-700/50 pb-3 text-[var(--color-almost-white)]"
              >
                <span>{fee.name}</span>
                <span className="text-brand-accent">
                  {formatFeeAmount(fee.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {currentTab === 'amenities' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-3">
                Unit
              </h3>
              <AmenityChips labels={unitLabels} />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-3">
                Building
              </h3>
              <AmenityChips labels={buildingLabels} />
            </div>
          </div>
        )}

        {currentTab === 'building' && facts && (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm list-none">
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
          <div className="space-y-6">
            {floorPlans.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-3">
                  Floor plans
                </h3>
                <ul className="space-y-2 list-none">
                  {floorPlans.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-accent underline"
                      >
                        {isPdfUrl(url) ? 'PDF floor plan' : 'Floor plan image'}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {videos.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-accent mb-3">
                  Videos
                </h3>
                <ul className="space-y-2 list-none">
                  {videos.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-accent underline break-all"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
