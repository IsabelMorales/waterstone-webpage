'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useRef, useState } from 'react';
import type { Listing, ListingCatalogOptions } from '@/lib/types/listing';
import { FALLBACK_LISTING_OPTIONS } from '@/lib/listing-options';
import { compressListingImages } from '@/lib/compress-listing-image';
import {
  MAX_FLOOR_PLAN_BYTES,
  MAX_FLOOR_PLANS_SOFT,
  MAX_IMAGE_BYTES,
  MAX_IMAGES_SOFT,
  MAX_UPLOAD_BATCH_BYTES,
  formatFileSize,
  sumFileSizes,
} from '@/lib/listing-media-limits';
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
  options?: ListingCatalogOptions;
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function mergeFiles(prev: File[], incoming: File[]): File[] {
  const map = new Map(prev.map((file) => [fileKey(file), file]));
  incoming.forEach((file) => {
    map.set(fileKey(file), file);
  });
  return Array.from(map.values());
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

function describeSaveError(err: unknown, response?: Response): string {
  if (response) {
    if (response.status === 413) {
      return `Upload is too large for the server (HTTP 413). Keep new files under ${formatFileSize(MAX_UPLOAD_BATCH_BYTES)} total per save.`;
    }
    if (response.status >= 500) {
      return `Server error while saving (HTTP ${response.status}). If you added many photos, try a smaller batch under ${formatFileSize(MAX_UPLOAD_BATCH_BYTES)}.`;
    }
  }

  if (err instanceof SyntaxError) {
    return `The server returned an unexpected response. The upload may have exceeded the size limit (${formatFileSize(MAX_UPLOAD_BATCH_BYTES)} total for new files).`;
  }

  if (err instanceof TypeError) {
    return `Network error while saving. Check your connection, or reduce the upload size (max ${formatFileSize(MAX_UPLOAD_BATCH_BYTES)} for new files per save).`;
  }

  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }

  return `Could not save the listing. If you uploaded media, keep new files under ${formatFileSize(MAX_UPLOAD_BATCH_BYTES)} total.`;
}

export default function ListingForm({
  mode,
  listing,
  options = FALLBACK_LISTING_OPTIONS,
}: ListingFormProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [fields, setFields] = useState<ListingFormState>(() =>
    toFormState(listing, options)
  );
  const [activeTab, setActiveTab] = useState<ListingFormTabId>('basics');
  const [existingImages, setExistingImages] = useState<string[]>(
    listing?.images || []
  );
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [imageError, setImageError] = useState('');
  const [imagesCompressing, setImagesCompressing] = useState(false);
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

  const mediaBatchBytes = useMemo(
    () => sumFileSizes(newImageFiles) + sumFileSizes(newFloorPlanFiles),
    [newImageFiles, newFloorPlanFiles]
  );

  const imagesBatchLabel =
    newImageFiles.length || newFloorPlanFiles.length
      ? `New media for this save: ${formatFileSize(mediaBatchBytes)} / ${formatFileSize(MAX_UPLOAD_BATCH_BYTES)}`
      : '';

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
        const allowed = statusesForType(
          value as ListingFormState['type'],
          options
        );
        if (!allowed.includes(next.status)) {
          next.status = options.defaults.status || 'available';
        }
      }
      return next;
    });
  }

  function goTab(direction: -1 | 1) {
    const next = LISTING_FORM_TABS[tabIndex + direction];
    if (next) selectTab(next.id);
  }

  function validateMediaBatch(
    images: File[],
    floorPlans: File[]
  ): string | null {
    const total = sumFileSizes(images) + sumFileSizes(floorPlans);
    if (total > MAX_UPLOAD_BATCH_BYTES) {
      return `New files total ${formatFileSize(total)}, but the limit per save is ${formatFileSize(MAX_UPLOAD_BATCH_BYTES)}. Remove some photos or floor plans.`;
    }
    if (images.length > MAX_IMAGES_SOFT) {
      return `Too many new photos (${images.length}). Split into smaller saves (soft limit ${MAX_IMAGES_SOFT}).`;
    }
    if (floorPlans.length > MAX_FLOOR_PLANS_SOFT) {
      return `Too many new floor plans (${floorPlans.length}). Soft limit is ${MAX_FLOOR_PLANS_SOFT} per save.`;
    }
    const oversizedImage = images.find((file) => file.size > MAX_IMAGE_BYTES);
    if (oversizedImage) {
      return `“${oversizedImage.name}” is ${formatFileSize(oversizedImage.size)} after compression (max ${formatFileSize(MAX_IMAGE_BYTES)} per photo).`;
    }
    const oversizedFloor = floorPlans.find(
      (file) => file.size > MAX_FLOOR_PLAN_BYTES
    );
    if (oversizedFloor) {
      return `“${oversizedFloor.name}” exceeds ${formatFileSize(MAX_FLOOR_PLAN_BYTES)}.`;
    }
    return null;
  }

  async function handleImageFilesChange(fileList: FileList | null) {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    setImagesCompressing(true);
    setImageError('');
    setError('');

    try {
      const compressed = await compressListingImages(incoming);
      const stillTooLarge = compressed.filter(
        (file) => file.size > MAX_IMAGE_BYTES
      );
      const accepted = compressed.filter((file) => file.size <= MAX_IMAGE_BYTES);

      if (stillTooLarge.length) {
        const names = stillTooLarge.map((file) => file.name).join(', ');
        setImageError(
          stillTooLarge.length === 1
            ? `“${names}” is still over ${formatFileSize(MAX_IMAGE_BYTES)} after compression and was not added.`
            : `These files stayed over ${formatFileSize(MAX_IMAGE_BYTES)} after compression and were not added: ${names}`
        );
      }

      if (!accepted.length) {
        setImageInputKey((key) => key + 1);
        return;
      }

      setNewImageFiles((prev) => {
        const merged = mergeFiles(prev, accepted);
        const batchError = validateMediaBatch(merged, newFloorPlanFiles);
        if (batchError) {
          const room =
            MAX_UPLOAD_BATCH_BYTES -
            sumFileSizes(prev) -
            sumFileSizes(newFloorPlanFiles);
          if (room <= 0) {
            setImageError(batchError);
            return prev;
          }
          const fitting: File[] = [];
          let used = 0;
          for (const file of accepted) {
            if (prev.some((p) => fileKey(p) === fileKey(file))) continue;
            if (used + file.size > room) continue;
            fitting.push(file);
            used += file.size;
          }
          if (!fitting.length) {
            setImageError(batchError);
            return prev;
          }
          setImageError(
            `Some photos were skipped to stay under ${formatFileSize(MAX_UPLOAD_BATCH_BYTES)} for this save.`
          );
          return mergeFiles(prev, fitting);
        }
        return merged;
      });
    } catch {
      setImageError(
        'Could not process one or more photos. Try different files or fewer images.'
      );
    } finally {
      setImagesCompressing(false);
      setImageInputKey((key) => key + 1);
    }
  }

  async function persistListing() {
    setLoading(true);
    setError('');

    const mediaError = validateMediaBatch(newImageFiles, newFloorPlanFiles);
    if (mediaError) {
      setError(mediaError);
      setImageError(mediaError);
      setLoading(false);
      selectTab('media');
      return;
    }

    try {
      const payload = buildWritePayload(fields, options);
      const hasImageFiles = newImageFiles.length > 0;
      const hasFloorPlanFiles = newFloorPlanFiles.length > 0;
      const keptImages = existingImages.filter(
        (url) => !removeImages.includes(url)
      );
      const originalImages = listing?.images || [];
      const imagesTouched =
        mode === 'edit' &&
        (hasImageFiles ||
          removeImages.length > 0 ||
          existingImages.join('\0') !== originalImages.join('\0'));

      const needsMultipart =
        hasImageFiles ||
        hasFloorPlanFiles ||
        (mode === 'edit' && removeFloorPlans.length > 0);

      const writeBody = {
        ...payload,
        ...(imagesTouched
          ? {
              imageMode: 'replace' as const,
              images: keptImages,
            }
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

      let data: { message?: string } = {};
      try {
        data = (await response.json()) as { message?: string };
      } catch (parseErr) {
        setError(describeSaveError(parseErr, response));
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(
          data.message ||
            describeSaveError(
              new Error(`Save failed (HTTP ${response.status})`),
              response
            )
        );
        setLoading(false);
        return;
      }

      window.location.assign(
        mode === 'edit' && listing?.id
          ? `/admin/listings/${listing.id}`
          : '/admin/listings'
      );
    } catch (err) {
      setError(describeSaveError(err));
      setLoading(false);
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLastTab) {
      goTab(1);
    }
  }

  function handleNextClick() {
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
          disabled={loading || imagesCompressing}
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

        <form onSubmit={handleFormSubmit} className="space-y-8" noValidate>
          {activeTab === 'basics' && (
            <BasicsTab
              fields={fields}
              options={options}
              onChange={updateField}
            />
          )}
          {activeTab === 'building' && (
            <BuildingTab
              fields={fields}
              onAmenitiesChange={(buildingAmenities) =>
                updateField('buildingAmenities', buildingAmenities)
              }
            />
          )}
          {activeTab === 'unit' && (
            <UnitTab
              fields={fields}
              options={options}
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
              options={options}
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
              onMoveExistingImage={(from, to) =>
                setExistingImages((prev) => moveItem(prev, from, to))
              }
              newImageFiles={newImageFiles}
              onImageFilesChange={(fileList) => {
                void handleImageFilesChange(fileList);
              }}
              onRemoveNewImage={(index) => {
                setNewImageFiles((prev) =>
                  prev.filter((_, i) => i !== index)
                );
                setImageError('');
                setImageInputKey((key) => key + 1);
              }}
              onMoveNewImage={(from, to) =>
                setNewImageFiles((prev) => moveItem(prev, from, to))
              }
              imageInputKey={imageInputKey}
              imageError={imageError}
              imagesCompressing={imagesCompressing}
              imagesBatchLabel={imagesBatchLabel}
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
                  (file) => file.size > MAX_FLOOR_PLAN_BYTES
                );
                const accepted = incoming.filter(
                  (file) => file.size <= MAX_FLOOR_PLAN_BYTES
                );

                if (tooLarge.length) {
                  const names = tooLarge.map((file) => file.name).join(', ');
                  setFloorPlanError(
                    tooLarge.length === 1
                      ? `“${names}” exceeds ${formatFileSize(MAX_FLOOR_PLAN_BYTES)}. Choose a smaller floor plan.`
                      : `These files exceed ${formatFileSize(MAX_FLOOR_PLAN_BYTES)} and were not added: ${names}`
                  );
                } else {
                  setFloorPlanError('');
                }

                if (accepted.length) {
                  setNewFloorPlanFiles((prev) => {
                    const merged = mergeFiles(prev, accepted);
                    const batchError = validateMediaBatch(
                      newImageFiles,
                      merged
                    );
                    if (batchError) {
                      const room =
                        MAX_UPLOAD_BATCH_BYTES -
                        sumFileSizes(newImageFiles) -
                        sumFileSizes(prev);
                      if (room <= 0) {
                        setFloorPlanError(batchError);
                        return prev;
                      }
                      const fitting: File[] = [];
                      let used = 0;
                      for (const file of accepted) {
                        if (prev.some((p) => fileKey(p) === fileKey(file))) {
                          continue;
                        }
                        if (used + file.size > room) continue;
                        fitting.push(file);
                        used += file.size;
                      }
                      if (!fitting.length) {
                        setFloorPlanError(batchError);
                        return prev;
                      }
                      setFloorPlanError(
                        `Some floor plans were skipped to stay under ${formatFileSize(MAX_UPLOAD_BATCH_BYTES)} for this save.`
                      );
                      return mergeFiles(prev, fitting);
                    }
                    return merged.slice(0, MAX_FLOOR_PLANS_SOFT);
                  });
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
                disabled={loading || imagesCompressing}
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
