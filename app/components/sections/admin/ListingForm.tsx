'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Listing, ListingStatus, ListingType } from '@/lib/types/listing';
import ChevronLeft from '../../common/ChevronLeft';
import ListingImageLightbox from '../../common/ListingImageLightbox';
import ListingMedia from '../../common/ListingMedia';
import SelectChevron from './SelectChevron';
import {
  adminCardClassName,
  adminInputClassName,
  adminLabelClassName,
  adminNumberClassName,
  adminPrimaryBtnClassName,
  adminSecondaryBtnClassName,
  adminSectionTitleClassName,
  adminSelectClassName,
} from './admin-ui';

interface ListingFormProps {
  mode: 'create' | 'edit';
  listing?: Listing;
}

interface FormState {
  type: ListingType;
  title: string;
  address: string;
  borough: string;
  neighborhood: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  description: string;
  status: ListingStatus;
}

interface PreviewItem {
  key: string;
  url: string;
  name: string;
}

function statusesForType(type: ListingType): ListingStatus[] {
  return type === 'rent'
    ? ['available', 'pending', 'rented']
    : ['available', 'pending', 'sold'];
}

function toFormState(listing?: Listing): FormState {
  return {
    type: listing?.type || 'rent',
    title: listing?.title || '',
    address: listing?.address || '',
    borough: listing?.borough || '',
    neighborhood: listing?.neighborhood || '',
    price: listing?.price != null ? String(listing.price) : '',
    bedrooms: listing?.bedrooms != null ? String(listing.bedrooms) : '0',
    bathrooms: listing?.bathrooms != null ? String(listing.bathrooms) : '1',
    sqft: listing?.sqft != null ? String(listing.sqft) : '',
    description: listing?.description || '',
    status: listing?.status || 'available',
  };
}

export default function ListingForm({ mode, listing }: ListingFormProps) {
  const [fields, setFields] = useState<FormState>(() => toFormState(listing));
  const [existingImages] = useState<string[]>(listing?.images || []);
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<PreviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const statusOptions = useMemo(
    () => statusesForType(fields.type),
    [fields.type]
  );

  const visibleImages = existingImages.filter(
    (url) => !removeImages.includes(url)
  );

  useEffect(() => {
    const items = newFiles.map((file, index) => ({
      key: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setNewPreviews(items);
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [newFiles]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFields((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'type') {
        const allowed = statusesForType(value as ListingType);
        if (!allowed.includes(next.status)) {
          next.status = 'available';
        }
      }
      return next;
    });
  }

  function toggleRemoveImage(url: string) {
    setRemoveImages((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  }

  function fileKey(file: File) {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }

  function handleFilesChange(fileList: FileList | null) {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    setNewFiles((prev) => {
      const map = new Map(prev.map((file) => [fileKey(file), file]));
      incoming.forEach((file) => {
        map.set(fileKey(file), file);
      });
      return Array.from(map.values()).slice(0, 10);
    });
    setFileInputKey((key) => key + 1);
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setFileInputKey((key) => key + 1);
  }

  function buildPayload() {
    return {
      type: fields.type,
      title: fields.title.trim(),
      address: fields.address.trim(),
      borough: fields.borough.trim(),
      neighborhood: fields.neighborhood.trim() || null,
      price: Number(fields.price) || 0,
      bedrooms: Number(fields.bedrooms) || 0,
      bathrooms: Number(fields.bathrooms) || 0,
      sqft: fields.sqft !== '' ? Number(fields.sqft) : null,
      description: fields.description,
      status: fields.status,
      ...(mode === 'edit' && removeImages.length
        ? { removeImages, imageMode: 'add' as const }
        : newFiles.length && mode === 'edit'
          ? { imageMode: 'add' as const }
          : {}),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = buildPayload();
      const hasFiles = newFiles.length > 0;
      const needsMultipart =
        hasFiles || (mode === 'edit' && removeImages.length > 0);

      let response: Response;

      if (needsMultipart) {
        const form = new FormData();
        form.append('listing', JSON.stringify(payload));
        newFiles.forEach((file) => form.append('images', file));

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
            body: JSON.stringify(payload),
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

  return (
    <div className="mx-auto w-full max-w-3xl">
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

      <div className="mt-5 mb-8 flex items-start gap-3">
        <div
          className="mt-1.5 h-10 w-0.5 flex-shrink-0 rounded-full"
          style={{ backgroundColor: 'var(--color-brand-accent)' }}
          aria-hidden
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.1em] text-[var(--color-almost-white)]">
            {mode === 'create' ? 'New listing' : 'Edit listing'}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {mode === 'create'
              ? 'Add a unit to the public listings catalog.'
              : 'Update details, status, or photos for this listing.'}
          </p>
        </div>
      </div>

      <div className={adminCardClassName}>
        <form onSubmit={handleSubmit} className="space-y-10" noValidate>
          <section>
            <h2 className={adminSectionTitleClassName}>Basics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="listing-type" className={adminLabelClassName}>
                  Type
                </label>
                <div className="relative">
                  <select
                    id="listing-type"
                    value={fields.type}
                    onChange={(e) =>
                      updateField('type', e.target.value as ListingType)
                    }
                    className={adminSelectClassName}
                  >
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                  <SelectChevron />
                </div>
              </div>
              <div>
                <label htmlFor="listing-status" className={adminLabelClassName}>
                  Status
                </label>
                <div className="relative">
                  <select
                    id="listing-status"
                    value={fields.status}
                    onChange={(e) =>
                      updateField('status', e.target.value as ListingStatus)
                    }
                    className={adminSelectClassName}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="listing-title" className={adminLabelClassName}>
                  Title
                </label>
                <input
                  id="listing-title"
                  required
                  value={fields.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className={adminInputClassName}
                  placeholder="e.g. Bright 2BR in East Village"
                />
              </div>
              <div>
                <label htmlFor="listing-address" className={adminLabelClassName}>
                  Address
                </label>
                <input
                  id="listing-address"
                  required
                  value={fields.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className={adminInputClassName}
                  placeholder="Street address, city, state"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="listing-borough"
                    className={adminLabelClassName}
                  >
                    Borough
                  </label>
                  <input
                    id="listing-borough"
                    required
                    value={fields.borough}
                    onChange={(e) => updateField('borough', e.target.value)}
                    className={adminInputClassName}
                  />
                </div>
                <div>
                  <label
                    htmlFor="listing-neighborhood"
                    className={adminLabelClassName}
                  >
                    Neighborhood
                  </label>
                  <input
                    id="listing-neighborhood"
                    value={fields.neighborhood}
                    onChange={(e) =>
                      updateField('neighborhood', e.target.value)
                    }
                    className={adminInputClassName}
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className={adminSectionTitleClassName}>Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label htmlFor="listing-price" className={adminLabelClassName}>
                  Price
                </label>
                <input
                  id="listing-price"
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={fields.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  className={adminNumberClassName}
                />
              </div>
              <div>
                <label
                  htmlFor="listing-bedrooms"
                  className={adminLabelClassName}
                >
                  Bedrooms
                </label>
                <input
                  id="listing-bedrooms"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={fields.bedrooms}
                  onChange={(e) => updateField('bedrooms', e.target.value)}
                  className={adminNumberClassName}
                />
              </div>
              <div>
                <label
                  htmlFor="listing-bathrooms"
                  className={adminLabelClassName}
                >
                  Bathrooms
                </label>
                <input
                  id="listing-bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  inputMode="decimal"
                  value={fields.bathrooms}
                  onChange={(e) => updateField('bathrooms', e.target.value)}
                  className={adminNumberClassName}
                />
              </div>
              <div>
                <label htmlFor="listing-sqft" className={adminLabelClassName}>
                  Sqft
                </label>
                <input
                  id="listing-sqft"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={fields.sqft}
                  onChange={(e) => updateField('sqft', e.target.value)}
                  className={adminNumberClassName}
                />
              </div>
            </div>
            <div className="mt-6">
              <label
                htmlFor="listing-description"
                className={adminLabelClassName}
              >
                Description
              </label>
              <textarea
                id="listing-description"
                rows={5}
                value={fields.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={cn(adminInputClassName, 'resize-y min-h-[8rem]')}
                placeholder="Highlight layout, light, amenities, and neighborhood."
              />
            </div>
          </section>

          <section>
            <h2 className={adminSectionTitleClassName}>Photos</h2>

            {mode === 'edit' && existingImages.length > 0 && (
              <div className="mb-6">
                <p className={adminLabelClassName}>Current photos</p>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none">
                  {existingImages.map((url) => {
                    const marked = removeImages.includes(url);
                    return (
                      <li key={url}>
                        <div
                          className={cn(
                            'relative aspect-video overflow-hidden rounded-lg border bg-gray-900/50',
                            marked
                              ? 'border-red-500/70 opacity-40'
                              : 'border-gray-700'
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setLightboxSrc(url)}
                            className="absolute inset-0"
                            aria-label="Open photo at full size"
                          >
                            <ListingMedia
                              src={url}
                              fill
                              className="object-cover"
                              sizes="160px"
                            />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleRemoveImage(url)}
                          className="mt-2 text-xs text-gray-400 hover:text-brand-accent transition-colors"
                        >
                          {marked ? 'Undo remove' : 'Remove'}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {visibleImages.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    All current photos marked for removal.
                  </p>
                )}
              </div>
            )}

            <p className={adminLabelClassName}>
              {mode === 'create' ? 'Upload photos' : 'Add photos'}
            </p>
            <label
              htmlFor="listing-images"
              className={cn(
                'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 cursor-pointer transition-colors',
                newFiles.length > 0
                  ? 'border-brand-accent bg-brand-primary/10'
                  : 'border-gray-600 bg-gray-900/30 hover:border-gray-500'
              )}
            >
              <span className="text-sm font-semibold text-[var(--color-almost-white)]">
                {newFiles.length > 0
                  ? `${newFiles.length} photo${newFiles.length === 1 ? '' : 's'} selected`
                  : 'Choose images'}
              </span>
              <span className="text-xs text-gray-500 text-center">
                Select multiple files at once · JPEG, PNG, WebP or GIF · up to 10
                · 5 MB each
              </span>
              <input
                key={fileInputKey}
                id="listing-images"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={(e) => handleFilesChange(e.target.files)}
                className="sr-only"
              />
            </label>

            {newPreviews.length > 0 && (
              <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 list-none">
                {newPreviews.map((preview, index) => (
                  <li key={preview.key}>
                    <button
                      type="button"
                      onClick={() => setLightboxSrc(preview.url)}
                      className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-900/50"
                      aria-label={`Preview ${preview.name}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                    <div className="mt-2 flex items-start justify-between gap-2">
                      <p className="text-xs text-gray-500 truncate">
                        {preview.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeNewFile(index)}
                        className="text-xs text-gray-400 hover:text-brand-accent transition-colors flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <ListingImageLightbox
              src={lightboxSrc || ''}
              open={Boolean(lightboxSrc)}
              onClose={() => setLightboxSrc(null)}
            />
          </section>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-700/80 pt-8">
            <button
              type="submit"
              disabled={loading}
              className={adminPrimaryBtnClassName}
            >
              {loading
                ? 'Saving…'
                : mode === 'create'
                  ? 'Create listing'
                  : 'Save changes'}
            </button>
            <Link
              href={
                mode === 'edit' && listing?.id
                  ? `/admin/listings/${listing.id}`
                  : '/admin/listings'
              }
              className={adminSecondaryBtnClassName}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
