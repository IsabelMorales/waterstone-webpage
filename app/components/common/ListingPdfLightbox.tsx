'use client';

import { ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ListingPdfLightboxProps {
  src: string;
  open: boolean;
  onClose: () => void;
  title?: string;
}

/**
 * In-page PDF viewer (iframe) so users can preview without forcing a download.
 */
export default function ListingPdfLightbox({
  src,
  open,
  onClose,
  title = 'Floor plan PDF',
}: ListingPdfLightboxProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !src) return null;

  // Hint browsers to open the viewer UI rather than download when possible.
  const viewerSrc = src.includes('#') ? src : `${src}#view=FitH`;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/95"
        aria-label="Close PDF preview"
        onClick={onClose}
      />

      <div className="absolute inset-0 z-10 flex flex-col p-3 sm:p-6 pointer-events-none">
        <div className="mb-3 flex flex-shrink-0 items-center justify-between gap-3 pointer-events-auto">
          <p className="truncate text-sm font-medium text-[var(--color-almost-white)]">
            {title}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm',
                'bg-white/10 text-white backdrop-blur-md',
                'transition-colors hover:bg-white/20'
              )}
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Open in new tab
            </a>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'rounded-full p-2.5',
                'bg-white/10 text-white backdrop-blur-md',
                'transition-colors hover:bg-white/20',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
              )}
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div
          className="pointer-events-auto min-h-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          role="presentation"
        >
          <iframe
            src={viewerSrc}
            title={title}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
