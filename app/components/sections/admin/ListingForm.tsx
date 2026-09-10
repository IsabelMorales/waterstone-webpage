'use client';

import Link from 'next/link';
import { FormEvent, useRef, useState } from 'react';
import type { Listing } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import ChevronLeft from '../../common/ChevronLeft';
import {
  adminCardClassName,
  adminPrimaryBtnClassName,
  adminSecondaryBtnClassName,
} from './admin-ui';
import AdminFormTabs from './listing-form/AdminFormTabs';
import BasicsTab from './listing-form/BasicsTab';
import BuildingTab from './listing-form/BuildingTab';
import CostsTab from './listing-form/CostsTab';
import MediaTab from './listing-form/MediaTab';
import UnitTab from './listing-form/UnitTab';
import {
  LISTING_FORM_TABS,
  buildWritePayload,
  statusesForType,
  toFormState,
  type ListingFormState,
  type ListingFormTabId,
} from './listing-form/form-state';

interface ListingFormProps {
  mode: 'create' | 'edit';
  listing?: Listing;
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function mergeFiles(prev: File[], incoming: File[], max: number) {
  const map = new Map(prev.map((file) => [fileKey(file), file]));
  incoming.forEach((file) => {
    map.set(fileKey(file), file);
  });
  return Array.from(map.values()).slice(0, max);
}

const FLOOR_PLAN_MAX_BYTES = 10 * 1024 * 1024;

export default function ListingForm({ mode, listing }: ListingFormProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [fields, setFields] = useState<ListingFormState>(() =>
    toFormState(listing)
  );
  const [activeTab, setActiveTab] = useState<ListingFormTabId>('basics');
  const [existingImages] = useState<string[]>(listing?.images || []);
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [existingFloorPlans] = useState<string[]>(listing?.floorPlans || []);
  const [removeFloorPlans, setRemoveFloorPlans] = useState<string[]>([]);
  const [newFloorPlanFiles, setNewFloorPlanFiles] = useState<File[]>([]);
  const [floorPlanInputKey, setFloorPlanInputKey] = useState(0);
  const [floorPlanError, setFloorPlanError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tabIndex = LISTING_FORM_TABS.findIndex((tab) => tab.id === activeTab);
  const isFirstTab = tabIndex <= 0;
  const isLastTab = tabIndex >= LISTING_FORM_TABS.length - 1;

  function scrollToTitle() {
    titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function selectTab(id: ListingFormTabId) {
    setError('');
    setActiveTab(id);
    requestAnimationFrame(() => {
      scrollToTitle();
    });
  }

  function updateField<K extends keyof ListingFormState>(
    key: K,
    value: ListingFormState[K]
  ) {
    setFields((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'type') {
        const allowed = statusesForType(value as ListingFormState['type']);
        if (!allowed.includes(next.status)) {
          next.status = 'available';
        }
      }
      return next;
    });
  }

  function goTab(direction: -1 | 1) {
    const next = LISTING_FORM_TABS[tabIndex + direction];
    if (next) selectTab(next.id);
  }

  async function persistListing() {
    setLoading(true);
    setError('');

    try {
      const payload = buildWritePayload(fields);
      const hasImageFiles = newImageFiles.length > 0;
      const hasFloorPlanFiles = newFloorPlanFiles.length > 0;
      const needsMultipart =
        hasImageFiles ||
        hasFloorPlanFiles ||
        (mode === 'edit' &&
          (removeImages.length > 0 || removeFloorPlans.length > 0));

      const writeBody = {
        ...payload,
        ...(mode === 'edit' && removeImages.length
          ? { removeImages, imageMode: 'add' as const }
          : hasImageFiles && mode === 'edit'
            ? { imageMode: 'add' as const }
            : {}),
        ...(mode === 'edit' && removeFloorPlans.length
          ? { removeFloorPlans, floorPlanMode: 'add' as const }
          : hasFloorPlanFiles && mode === 'edit'
            ? { floorPlanMode: 'add' as const }
            : {}),
      };

      let response: Response;

      if (needsMultipart) {
        const form = new FormData();
        form.append('listing', JSON.stringify(writeBody));
        newImageFiles.forEach((file) => form.append('images', file));
        newFloorPlanFiles.forEach((file) => form.append('floorPlans', file));

        response = await fetch(
          mode === 'create'
            ? '/api/admin/listings'
            : `/api/admin/listings/${listing!.id}`,
          {
            method: mode === 'create' ? 'POST' : 'PUT',
            body: form,
          }
        );
      } else {
        response = await fetch(
          mode === 'create'
            ? '/api/admin/listings'
            : `/api/admin/listings/${listing!.id}`,
          {
            method: mode === 'create' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(writeBody),
          }
        );
      }

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message || 'Save failed.');
        setLoading(false);
        return;
      }

      window.location.assign(
        mode === 'edit' && listing?.id
          ? `/admin/listings/${listing.id}`
          : '/admin/listings'
      );
    } catch {
      setError('Unable to save listing. Please try again.');
      setLoading(false);
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Enter in inputs must never persist. Advance tabs until the last one.
    if (!isLastTab) {
      goTab(1);
    }
  }

  function handleNextClick() {
    // Defer tab change so this click cannot land on the Save button that
    // replaces Next in the same spot after re-render.
    window.setTimeout(() => goTab(1), 0);
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href={
          mode === 'edit' && listing?.id
            ? `/admin/listings/${listing.id}`
            : '/admin/listings'
        }
        className="inline-flex items-center gap-2 text-base md:text-lg font-medium text-[var(--color-almost-white)] hover:text-brand-accent transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        {mode === 'edit' ? 'Back to listing' : 'Back to listings'}
      </Link>

      <div className="mt-5 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1
            ref={titleRef}
            className="scroll-mt-24 text-2xl md:text-3xl font-light uppercase tracking-[0.08em] text-[var(--color-almost-white)] leading-snug"
          >
            {fields.title.trim() ||
              (mode === 'create' ? 'New listing' : 'Edit listing')}
          </h1>
          {fields.address.trim() && (
            <p className="mt-2 text-sm text-gray-400 truncate">
              {fields.address}
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void persistListing()}
          className={cn(adminPrimaryBtnClassName, 'py-2.5 px-5 text-sm')}
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className={adminCardClassName}>
        <AdminFormTabs
          tabs={LISTING_FORM_TABS}
          activeTab={activeTab}
          onChange={selectTab}
          className="mb-8 -mx-1"
        />

        <form
          onSubmit={handleFormSubmit}
          className="space-y-8"
          noValidate
        >
          {activeTab === 'basics' && (
            <BasicsTab fields={fields} onChange={updateField} />
          )}
          {activeTab === 'building' && (
            <BuildingTab
              fields={fields}
              onFactsChange={(buildingFacts) =>
                updateField('buildingFacts', buildingFacts)
              }
              onAmenitiesChange={(buildingAmenities) =>
                updateField('buildingAmenities', buildingAmenities)
              }
            />
          )}
          {activeTab === 'unit' && (
            <UnitTab
              fields={fields}
              onRentInfoChange={(rentInfo) => updateField('rentInfo', rentInfo)}
              onRoomsChange={(rooms) => updateField('rooms', rooms)}
              onAmenitiesChange={(unitAmenities) =>
                updateField('unitAmenities', unitAmenities)
              }
            />
          )}
          {activeTab === 'costs' && (
            <CostsTab
              fields={fields}
              onChange={updateField}
              onFeesChange={(fees) => updateField('fees', fees)}
            />
          )}
          {activeTab === 'media' && (
            <MediaTab
              mode={mode}
              existingImages={existingImages}
              removeImages={removeImages}
              onToggleRemoveImage={(url) =>
                setRemoveImages((prev) =>
                  prev.includes(url)
                    ? prev.filter((item) => item !== url)
                    : [...prev, url]
                )
              }
              newImageFiles={newImageFiles}
              onImageFilesChange={(fileList) => {
                const incoming = Array.from(fileList || []);
                if (!incoming.length) return;
                setNewImageFiles((prev) => mergeFiles(prev, incoming, 10));
                setImageInputKey((key) => key + 1);
              }}
              onRemoveNewImage={(index) => {
                setNewImageFiles((prev) =>
                  prev.filter((_, i) => i !== index)
                );
                setImageInputKey((key) => key + 1);
              }}
              imageInputKey={imageInputKey}
              existingFloorPlans={existingFloorPlans}
              removeFloorPlans={removeFloorPlans}
              onToggleRemoveFloorPlan={(url) =>
                setRemoveFloorPlans((prev) =>
                  prev.includes(url)
                    ? prev.filter((item) => item !== url)
                    : [...prev, url]
                )
              }
              newFloorPlanFiles={newFloorPlanFiles}
              onFloorPlanFilesChange={(fileList) => {
                const incoming = Array.from(fileList || []);
                if (!incoming.length) return;

                const tooLarge = incoming.filter(
                  (file) => file.size > FLOOR_PLAN_MAX_BYTES
                );
                const accepted = incoming.filter(
                  (file) => file.size <= FLOOR_PLAN_MAX_BYTES
                );

                if (tooLarge.length) {
                  const names = tooLarge.map((file) => file.name).join(', ');
                  setFloorPlanError(
                    tooLarge.length === 1
                      ? `“${names}” exceeds 10 MB. Choose a smaller floor plan.`
                      : `These files exceed 10 MB and were not added: ${names}`
                  );
                } else {
                  setFloorPlanError('');
                }

                if (accepted.length) {
                  setNewFloorPlanFiles((prev) =>
                    mergeFiles(prev, accepted, 10)
                  );
                }
                setFloorPlanInputKey((key) => key + 1);
              }}
              onRemoveNewFloorPlan={(index) => {
                setNewFloorPlanFiles((prev) =>
                  prev.filter((_, i) => i !== index)
                );
                setFloorPlanError('');
                setFloorPlanInputKey((key) => key + 1);
              }}
              floorPlanInputKey={floorPlanInputKey}
              floorPlanError={floorPlanError}
              videos={fields.videos}
              onVideosChange={(videos) => updateField('videos', videos)}
            />
          )}

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 border-t border-gray-700/80 pt-8">
            <button
              type="button"
              disabled={isFirstTab}
              onClick={() => goTab(-1)}
              className={cn(
                adminSecondaryBtnClassName,
                'sm:mr-auto disabled:opacity-40'
              )}
            >
              ← Go back
            </button>
            {!isLastTab ? (
              <button
                key="listing-next"
                type="button"
                onClick={handleNextClick}
                className={adminPrimaryBtnClassName}
              >
                Next →
              </button>
            ) : (
              <button
                key="listing-save"
                type="button"
                disabled={loading}
                onClick={() => void persistListing()}
                className={adminPrimaryBtnClassName}
              >
                {loading
                  ? 'Saving…'
                  : mode === 'create'
                    ? 'Create listing'
                    : 'Save changes'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
