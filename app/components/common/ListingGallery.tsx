'use client';

import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { isPdfUrl } from '@/lib/listings-format';
import ListingMedia from './ListingMedia';
import ListingImageLightbox from './ListingImageLightbox';
import ListingPdfLightbox from './ListingPdfLightbox';

interface ListingGalleryProps {
  images: string[];
  className?: string;
  /** Larger main frame for public detail */
  size?: 'default' | 'large';
}

/**
 * Real-estate style gallery: full-width hero with overlay arrows + thumbnail strip.
 * Supports image URLs and PDF floor plans in the same sequence.
 */
export default function ListingGallery({
  images,
  className,
  size = 'default',
}: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [thumbFade, setThumbFade] = useState({ left: false, right: false });
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const activeImage = images[activeIndex] || null;
  const activeIsPdf = Boolean(activeImage && isPdfUrl(activeImage));
  const isLarge = size === 'large';
  const hasMultiple = images.length > 1;
  const imageOnly = images.filter((url) => !isPdfUrl(url));

  const goTo = useCallback(
    (index: number) => {
      if (!images.length) return;
      const next = (index + images.length) % images.length;
      setActiveIndex(next);
    },
    [images.length]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const updateThumbFade = useCallback(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const { scrollLeft, clientWidth, scrollWidth } = strip;
    setThumbFade({
      left: scrollLeft > 4,
      right: scrollLeft + clientWidth < scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;

    const activeThumb = strip.querySelector<HTMLElement>(
      `[data-thumb-index="${activeIndex}"]`
    );
    activeThumb?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeIndex]);

  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip || !hasMultiple) return;

    updateThumbFade();

    strip.addEventListener('scroll', updateThumbFade, { passive: true });
    window.addEventListener('resize', updateThumbFade);

    return () => {
      strip.removeEventListener('scroll', updateThumbFade);
      window.removeEventListener('resize', updateThumbFade);
    };
  }, [hasMultiple, images.length, updateThumbFade]);

  if (!images.length) {
    return (
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-lg border border-gray-700/80 bg-gray-800',
          className
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No photo available
        </div>
      </div>
    );
  }

  const overlayArrowClass = cn(
    'absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-2',
    'bg-[var(--color-almost-black)]/50 text-[var(--color-almost-white)] backdrop-blur-sm',
    'transition-colors duration-200 hover:bg-[var(--color-almost-black)]/70 hover:text-brand-accent',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
  );

  const thumbWidthClass = isLarge ? 'w-36 sm:w-40' : 'w-32 sm:w-36';

  function openActive() {
    if (activeIsPdf) setPdfOpen(true);
    else setLightboxOpen(true);
  }

  return (
    <div className={className}>
      <div className="relative w-full">
        <button
          type="button"
          onClick={openActive}
          className={cn(
            'relative aspect-video w-full overflow-hidden rounded-lg border border-gray-700/80 bg-gray-800 text-left',
            'cursor-zoom-in',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
            isLarge && 'min-h-[16rem] sm:min-h-[20rem] lg:min-h-[24rem]'
          )}
          aria-label={
            activeIsPdf ? 'Open floor plan PDF' : 'Open photo at full size'
          }
        >
          {activeIsPdf ? (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-gray-800/90 to-gray-900 px-6 text-center">
              <FileText
                className="h-12 w-12 text-brand-accent"
                aria-hidden
              />
              <span className="text-base font-semibold text-[var(--color-almost-white)]">
                Floor plan PDF
              </span>
              <span className="text-sm text-brand-accent underline">
                View PDF
              </span>
            </span>
          ) : (
            <ListingMedia
              src={activeImage!}
              fill
              priority
              className="object-cover"
              sizes={
                isLarge
                  ? '(max-width: 1024px) 100vw, 55vw'
                  : '(max-width: 1024px) 100vw, 50vw'
              }
            />
          )}
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goPrev();
              }}
              className={cn(overlayArrowClass, 'left-2 sm:left-3')}
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
              className={cn(overlayArrowClass, 'right-2 sm:right-3')}
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
            </button>
            <div
              className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-[var(--color-almost-black)]/60 px-3 py-1 text-xs font-medium text-[var(--color-almost-white)] backdrop-blur-sm"
              aria-live="polite"
            >
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="relative mt-4">
          {thumbFade.left && (
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-brand-dark to-transparent"
              aria-hidden
            />
          )}
          {thumbFade.right && (
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-brand-dark to-transparent"
              aria-hidden
            />
          )}

          <div
            ref={thumbStripRef}
            className={cn(
              'flex gap-3 overflow-x-auto scroll-smooth py-1',
              '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              'cursor-grab active:cursor-grabbing'
            )}
            role="tablist"
            aria-label="Listing photos"
          >
            {images.map((src, index) => {
              const pdf = isPdfUrl(src);
              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  role="tab"
                  data-thumb-index={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'relative aspect-video flex-shrink-0 overflow-hidden rounded-lg border-4 transition-colors duration-200',
                    thumbWidthClass,
                    index === activeIndex
                      ? 'border-brand-accent'
                      : 'border-transparent hover:border-brand-accent'
                  )}
                  aria-label={
                    pdf
                      ? `Show floor plan PDF ${index + 1}`
                      : `Show photo ${index + 1}`
                  }
                  aria-selected={index === activeIndex}
                >
                  {pdf ? (
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gray-900/90 px-2">
                      <FileText
                        className="h-5 w-5 text-brand-accent"
                        aria-hidden
                      />
                      <span className="text-[10px] font-medium text-gray-300">
                        PDF
                      </span>
                    </span>
                  ) : (
                    <ListingMedia
                      src={src}
                      fill
                      className="object-cover pointer-events-none"
                      sizes="160px"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <ListingImageLightbox
        src={activeIsPdf ? imageOnly[0] || '' : activeImage!}
        open={lightboxOpen && !activeIsPdf}
        onClose={() => setLightboxOpen(false)}
        images={imageOnly}
        activeIndex={Math.max(
          0,
          imageOnly.indexOf(activeImage || '')
        )}
        onNavigate={(nextIndex) => {
          const url = imageOnly[nextIndex];
          if (!url) return;
          setActiveIndex(images.indexOf(url));
        }}
      />
      <ListingPdfLightbox
        src={activeIsPdf ? activeImage || '' : ''}
        open={pdfOpen && activeIsPdf}
        onClose={() => setPdfOpen(false)}
        title="Floor plan PDF"
      />
    </div>
  );
}
