'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface ListingMediaCarouselProps {
  itemCount: number;
  ariaLabel: string;
  className?: string;
  /** Frame size: large for video, compact for floor plans / PDFs */
  size?: 'default' | 'large' | 'compact';
  renderSlide: (index: number) => React.ReactNode;
}

/**
 * Simple one-at-a-time carousel with overlay arrows + counter.
 */
export default function ListingMediaCarousel({
  itemCount,
  ariaLabel,
  className,
  size = 'large',
  renderSlide,
}: ListingMediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = itemCount > 1;
  const isLarge = size === 'large';
  const isCompact = size === 'compact';

  const goTo = useCallback(
    (index: number) => {
      if (itemCount <= 0) return;
      setActiveIndex((index + itemCount) % itemCount);
    },
    [itemCount]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  if (itemCount <= 0) return null;

  const overlayArrowClass = cn(
    'absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-2',
    'bg-[var(--color-almost-black)]/50 text-[var(--color-almost-white)] backdrop-blur-sm',
    'transition-colors duration-200 hover:bg-[var(--color-almost-black)]/70 hover:text-brand-accent',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
    isCompact && 'p-1.5'
  );

  return (
    <div
      className={cn(
        'relative w-full',
        isCompact ? 'max-w-xs sm:max-w-sm' : 'max-w-3xl',
        className
      )}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-lg border border-gray-700/80 bg-gray-900/50',
          isCompact
            ? 'aspect-[4/3] max-h-44'
            : 'aspect-video',
          isLarge && 'min-h-[14rem] sm:min-h-[18rem]'
        )}
      >
        {renderSlide(activeIndex)}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className={cn(overlayArrowClass, 'left-2 sm:left-3')}
              aria-label="Previous"
            >
              <ChevronLeft
                className={cn(
                  isCompact ? 'h-5 w-5' : 'h-6 w-6 sm:h-7 sm:w-7'
                )}
                strokeWidth={2}
              />
            </button>
            <button
              type="button"
              onClick={goNext}
              className={cn(overlayArrowClass, 'right-2 sm:right-3')}
              aria-label="Next"
            >
              <ChevronRight
                className={cn(
                  isCompact ? 'h-5 w-5' : 'h-6 w-6 sm:h-7 sm:w-7'
                )}
                strokeWidth={2}
              />
            </button>
            <div
              className="pointer-events-none absolute bottom-2 right-2 z-10 rounded-full bg-[var(--color-almost-black)]/60 px-2.5 py-0.5 text-xs font-medium text-[var(--color-almost-white)] backdrop-blur-sm"
              aria-live="polite"
            >
              {activeIndex + 1} / {itemCount}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div
          className="mt-3 flex justify-center gap-2"
          role="tablist"
          aria-label={`${ariaLabel} indicators`}
        >
          {Array.from({ length: itemCount }, (_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show item ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                index === activeIndex
                  ? 'bg-brand-accent'
                  : 'bg-gray-600 hover:bg-gray-400'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
