'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import ListingMedia from './ListingMedia';

/** Delay before the first photo change on hover. */
const FIRST_SWAP_MS = 350;
/** Interval between subsequent photo changes. */
const CYCLE_MS = 900;

interface ListingCardHoverGalleryProps {
  images: string[];
  hovered: boolean;
  priority?: boolean;
  sizes?: string;
}

/**
 * Cover photo by default; on hover, cross-fades through listing images.
 */
export default function ListingCardHoverGallery({
  images,
  hovered,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: ListingCardHoverGalleryProps) {
  const photos = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const shownIndex = hovered ? index : 0;

  useEffect(() => {
    if (!hovered || photos.length <= 1) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let intervalId: number | undefined;
    const firstId = window.setTimeout(() => {
      setIndex(1 % photos.length);
      intervalId = window.setInterval(() => {
        setIndex((current) => (current + 1) % photos.length);
      }, CYCLE_MS);
    }, FIRST_SWAP_MS);

    return () => {
      window.clearTimeout(firstId);
      if (intervalId != null) window.clearInterval(intervalId);
      setIndex(0);
    };
  }, [hovered, photos.length]);

  if (!photos.length) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
        No photo
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {photos.map((src, i) => {
        const visible = i === shownIndex;
        return (
          <div
            key={`${src}-${i}`}
            className={cn(
              'absolute inset-0 transition-opacity duration-500 ease-in-out',
              visible ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden={!visible}
          >
            <ListingMedia
              src={src}
              fill
              className="object-cover"
              sizes={sizes}
              priority={priority && i === 0}
            />
          </div>
        );
      })}

      {photos.length > 1 && hovered && (
        <div
          className="pointer-events-none absolute bottom-2 right-2 z-10 rounded-full bg-[var(--color-almost-black)]/55 px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-almost-white)] backdrop-blur-sm"
          aria-hidden
        >
          {shownIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
