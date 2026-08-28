'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ListingMediaProps {
  src: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function isEmulatorStorageUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return (
      (url.hostname === '127.0.0.1' || url.hostname === 'localhost') &&
      (url.port === '9199' || url.pathname.includes('/v0/b/'))
    );
  } catch {
    return false;
  }
}

function shouldUsePlainImg(src: string): boolean {
  return src.startsWith('blob:') || isEmulatorStorageUrl(src);
}

/**
 * Renders listing photos with next/image when possible.
 * Emulator Storage / blob preview URLs fall back to a plain img.
 */
export default function ListingMedia({
  src,
  alt = '',
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
}: ListingMediaProps) {
  const [failed, setFailed] = useState(false);
  const usePlainImg = failed || shouldUsePlainImg(src);

  if (usePlainImg) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn('absolute inset-0 h-full w-full object-cover', className)}
          onError={() => setFailed(true)}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
