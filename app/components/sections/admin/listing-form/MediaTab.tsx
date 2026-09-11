'use client';

import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
} from 'react';
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isPdfUrl } from '@/lib/listings-format';
import ListingImageLightbox from '../../../common/ListingImageLightbox';
import ListingMedia from '../../../common/ListingMedia';
import {
  adminInputClassName,
  adminLabelClassName,
  adminSectionTitleClassName,
} from '../admin-ui';

interface PreviewItem {
  key: string;
  url: string;
  name: string;
}

interface MediaTabProps {
  mode: 'create' | 'edit';
  existingImages: string[];
  removeImages: string[];
  onToggleRemoveImage: (url: string) => void;
  onMoveExistingImage: (fromIndex: number, toIndex: number) => void;
  newImageFiles: File[];
  onImageFilesChange: (files: FileList | null) => void;
  onRemoveNewImage: (index: number) => void;
  onMoveNewImage: (fromIndex: number, toIndex: number) => void;
  imageInputKey: number;
  existingFloorPlans: string[];
  removeFloorPlans: string[];
  onToggleRemoveFloorPlan: (url: string) => void;
  newFloorPlanFiles: File[];
  onFloorPlanFilesChange: (files: FileList | null) => void;
  onRemoveNewFloorPlan: (index: number) => void;
  floorPlanInputKey: number;
  floorPlanError?: string;
  videos: string[];
  onVideosChange: (videos: string[]) => void;
}

/** Blob preview URLs derived from files; revoke previous set on change. */
function useObjectPreviews(files: File[]) {
  const previews = useMemo<PreviewItem[]>(
    () =>
      files.map((file, index) => ({
        key: `${file.name}-${file.size}-${file.lastModified}-${index}`,
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  return previews;
}

function DropZone({
  id,
  label,
  hint,
  accept,
  count,
  inputKey,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  accept: string;
  count: number;
  inputKey: number;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 cursor-pointer transition-colors',
        count > 0
          ? 'border-brand-accent bg-brand-primary/10'
          : 'border-gray-600 bg-gray-900/30 hover:border-gray-500'
      )}
    >
      <span className="text-sm font-semibold text-[var(--color-almost-white)]">
        {count > 0
          ? `${count} file${count === 1 ? '' : 's'} selected`
          : label}
      </span>
      <span className="text-xs text-gray-500 text-center">{hint}</span>
      <input
        key={inputKey}
        id={id}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => onChange(e.target.files)}
        className="sr-only"
      />
    </label>
  );
}

function ReorderControls({
  index,
  total,
  onMove,
  label,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="rounded p-1 text-gray-400 hover:text-brand-accent disabled:opacity-30 disabled:hover:text-gray-400"
        aria-label={`Move ${label} up`}
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={index >= total - 1}
        onClick={() => onMove(index, index + 1)}
        className="rounded p-1 text-gray-400 hover:text-brand-accent disabled:opacity-30 disabled:hover:text-gray-400"
        aria-label={`Move ${label} down`}
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function MediaTab({
  mode,
  existingImages,
  removeImages,
  onToggleRemoveImage,
  onMoveExistingImage,
  newImageFiles,
  onImageFilesChange,
  onRemoveNewImage,
  onMoveNewImage,
  imageInputKey,
  existingFloorPlans,
  removeFloorPlans,
  onToggleRemoveFloorPlan,
  newFloorPlanFiles,
  onFloorPlanFilesChange,
  onRemoveNewFloorPlan,
  floorPlanInputKey,
  floorPlanError = '',
  videos,
  onVideosChange,
}: MediaTabProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragKind, setDragKind] = useState<'existing' | 'new' | null>(null);
  const imagePreviews = useObjectPreviews(newImageFiles);
  const floorPlanPreviews = useObjectPreviews(newFloorPlanFiles);

  function updateVideo(index: number, value: string) {
    const next = [...videos];
    next[index] = value;
    onVideosChange(next);
  }

  function addVideoField() {
    onVideosChange([...videos, '']);
  }

  function removeVideoField(index: number) {
    const next = videos.filter((_, i) => i !== index);
    onVideosChange(next.length ? next : ['']);
  }

  function handleDragStart(kind: 'existing' | 'new', index: number) {
    setDragKind(kind);
    setDragIndex(index);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDrop(kind: 'existing' | 'new', toIndex: number) {
    if (dragKind !== kind || dragIndex == null || dragIndex === toIndex) {
      setDragKind(null);
      setDragIndex(null);
      return;
    }
    if (kind === 'existing') onMoveExistingImage(dragIndex, toIndex);
    else onMoveNewImage(dragIndex, toIndex);
    setDragKind(null);
    setDragIndex(null);
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className={adminSectionTitleClassName}>Photos</h2>
        <p className="text-xs text-gray-500 mb-4">
          Drag photos or use the arrows to set display order (first photo is the
          cover).
        </p>

        {mode === 'edit' && existingImages.length > 0 && (
          <div className="mb-6">
            <p className={adminLabelClassName}>Current photos</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none">
              {existingImages.map((url, index) => {
                const marked = removeImages.includes(url);
                return (
                  <li
                    key={url}
                    draggable={!marked}
                    onDragStart={() => handleDragStart('existing', index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop('existing', index)}
                    className={cn(
                      !marked && 'cursor-grab active:cursor-grabbing'
                    )}
                  >
                    <div
                      className={cn(
                        'relative aspect-video overflow-hidden rounded-lg border bg-gray-900/50',
                        marked
                          ? 'border-red-500/70 opacity-40'
                          : 'border-gray-700',
                        dragKind === 'existing' &&
                          dragIndex === index &&
                          'ring-2 ring-brand-accent'
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
                      {!marked && (
                        <span className="pointer-events-none absolute left-1.5 top-1.5 rounded bg-black/60 p-0.5 text-gray-300">
                          <GripVertical className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleRemoveImage(url)}
                        className={cn(
                          'text-xs transition-colors',
                          marked
                            ? 'text-gray-400 hover:text-brand-accent'
                            : 'text-red-400 hover:text-red-300'
                        )}
                      >
                        {marked ? 'Undo remove' : 'Remove'}
                      </button>
                      {!marked && existingImages.length > 1 && (
                        <ReorderControls
                          index={index}
                          total={existingImages.length}
                          onMove={onMoveExistingImage}
                          label={`photo ${index + 1}`}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <DropZone
          id="listing-images"
          label="Drag and drop photos or browse files"
          hint="JPG, JPEG, GIF, PNG or WebP · up to 10 · 5 MB each"
          accept="image/jpeg,image/png,image/webp,image/gif"
          count={newImageFiles.length}
          inputKey={imageInputKey}
          onChange={onImageFilesChange}
        />

        {imagePreviews.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 list-none">
            {imagePreviews.map((preview, index) => (
              <li
                key={preview.key}
                draggable
                onDragStart={() => handleDragStart('new', index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop('new', index)}
                className="cursor-grab active:cursor-grabbing"
              >
                <button
                  type="button"
                  onClick={() => setLightboxSrc(preview.url)}
                  className={cn(
                    'relative aspect-video w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-900/50',
                    dragKind === 'new' &&
                      dragIndex === index &&
                      'ring-2 ring-brand-accent'
                  )}
                  aria-label={`Preview ${preview.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="pointer-events-none absolute left-1.5 top-1.5 rounded bg-black/60 p-0.5 text-gray-300">
                    <GripVertical className="h-3.5 w-3.5" />
                  </span>
                </button>
                <div className="mt-2 flex items-start justify-between gap-2">
                  <p className="text-xs text-gray-500 truncate min-w-0">
                    {preview.name}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {imagePreviews.length > 1 && (
                      <ReorderControls
                        index={index}
                        total={imagePreviews.length}
                        onMove={onMoveNewImage}
                        label={preview.name}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveNewImage(index)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className={adminSectionTitleClassName}>Floor plans</h2>

        {mode === 'edit' && existingFloorPlans.length > 0 && (
          <div className="mb-6">
            <p className={adminLabelClassName}>Current floor plans</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none">
              {existingFloorPlans.map((url) => {
                const marked = removeFloorPlans.includes(url);
                const pdf = isPdfUrl(url);
                return (
                  <li key={url}>
                    <div
                      className={cn(
                        'relative aspect-video overflow-hidden rounded-lg border bg-gray-900/50 flex items-center justify-center',
                        marked
                          ? 'border-red-500/70 opacity-40'
                          : 'border-gray-700'
                      )}
                    >
                      {pdf ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-brand-accent underline px-4 text-center"
                        >
                          View PDF floor plan
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setLightboxSrc(url)}
                          className="absolute inset-0"
                          aria-label="Open floor plan"
                        >
                          <ListingMedia
                            src={url}
                            fill
                            className="object-contain"
                            sizes="240px"
                          />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleRemoveFloorPlan(url)}
                      className="mt-2 text-xs text-gray-400 hover:text-brand-accent transition-colors"
                    >
                      {marked ? 'Undo remove' : 'Remove'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <DropZone
          id="listing-floor-plans"
          label="Drag and drop floor plans or browse files"
          hint="JPG, JPEG, GIF, PNG or PDF · up to 10 · 10 MB each"
          accept="image/jpeg,image/png,image/gif,application/pdf"
          count={newFloorPlanFiles.length}
          inputKey={floorPlanInputKey}
          onChange={onFloorPlanFilesChange}
        />

        {floorPlanError && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {floorPlanError}
          </p>
        )}

        {floorPlanPreviews.length > 0 && (
          <ul className="mt-4 space-y-2 list-none">
            {floorPlanPreviews.map((preview, index) => (
              <li
                key={preview.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-700 px-4 py-3"
              >
                <p className="text-sm text-gray-300 truncate">{preview.name}</p>
                <button
                  type="button"
                  onClick={() => onRemoveNewFloorPlan(index)}
                  className="text-xs text-gray-400 hover:text-brand-accent transition-colors flex-shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className={adminSectionTitleClassName}>Video</h2>
        <p className="text-xs text-gray-500 mb-4">
          YouTube or Vimeo links only.
        </p>
        <div className="space-y-3">
          {videos.map((video, index) => (
            <div key={`video-${index}`} className="flex gap-2">
              <input
                value={video}
                onChange={(e) => updateVideo(index, e.target.value)}
                className={adminInputClassName}
                placeholder="Enter video link"
              />
              {videos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVideoField(index)}
                  className="px-3 text-sm text-gray-400 hover:text-brand-accent"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addVideoField}
          className="mt-3 text-sm font-medium text-brand-accent hover:text-[var(--color-almost-white)] transition-colors"
        >
          + Add another video
        </button>
      </section>

      <ListingImageLightbox
        src={lightboxSrc || ''}
        open={Boolean(lightboxSrc)}
        onClose={() => setLightboxSrc(null)}
      />
    </div>
  );
}
