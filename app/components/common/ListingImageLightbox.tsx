'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ListingMedia from './ListingMedia';

interface ListingImageLightboxProps {
  src: string;
  alt?: string;
  open: boolean;
  onClose: () => void;
  images?: string[];
  activeIndex?: number;
  onNavigate?: (index: number) => void;
}

export default function ListingImageLightbox({
  src,
  alt = '',
  open,
  onClose,
  images,
  activeIndex = 0,
  onNavigate,
}: ListingImageLightboxProps) {
  const hasNav =
    Boolean(images && images.length > 1 && onNavigate);

  const goPrev = useCallback(() => {
    if (!hasNav || !images || !onNavigate) return;
    onNavigate((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, hasNav, images, onNavigate]);

  const goNext = useCallback(() => {
    if (!hasNav || !images || !onNavigate) return;
    onNavigate((activeIndex + 1) % images.length);
  }, [activeIndex, hasNav, images, onNavigate]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open) return null;

  const navButtonClass = cn(
    'absolute top-1/2 z-20 -translate-y-1/2 rounded-full p-2.5 sm:p-3',
    'bg-white/10 text-white backdrop-blur-md',
    'transition-colors duration-200 hover:bg-white/20',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
  );

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/95"
        aria-label="Close image preview"
        onClick={onClose}
      />

      <button
        type="button"
        onClick={onClose}
        className={cn(
          'absolute top-4 right-4 z-20 rounded-full p-2.5 sm:p-3',
          'bg-white/10 text-white backdrop-blur-md',
          'transition-colors duration-200 hover:bg-white/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
        )}
        aria-label="Close"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
      </button>

      {hasNav && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className={cn(navButtonClass, 'left-3 sm:left-5')}
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className={cn(navButtonClass, 'right-3 sm:right-5')}
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
          </button>
        </>
      )}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-8">
        <div
          className="pointer-events-auto relative flex max-h-full max-w-full items-center justify-center"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          role="presentation"
        >
          <ListingMedia
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            priority
            className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] h-auto w-auto select-none object-contain sm:max-h-[calc(100dvh-4rem)] sm:max-w-[calc(100vw-4rem)]"
          />
        </div>
      </div>
    </div>
  );
}
