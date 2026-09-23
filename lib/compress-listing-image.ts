import imageCompression from 'browser-image-compression';
import { MAX_IMAGE_BYTES } from '@/lib/listing-media-limits';

const COMPRESS_OPTIONS = {
  /** Target compressed size — quality stays high for listing photos. */
  maxSizeMB: 1.5,
  /** Keep detail for gallery / lightbox. */
  maxWidthOrHeight: 2560,
  useWebWorker: true,
  initialQuality: 0.82,
} as const;

function isCompressibleImage(file: File): boolean {
  const type = (file.type || '').toLowerCase();
  return (
    type === 'image/jpeg' ||
    type === 'image/png' ||
    type === 'image/webp' ||
    type === 'image/jpg'
  );
}

/**
 * Compress a listing photo for upload without heavy quality loss.
 * GIFs are left as-is (animation). Already-small files may stay unchanged.
 */
export async function compressListingImage(file: File): Promise<File> {
  if (!isCompressibleImage(file)) {
    return file;
  }

  // Skip work when already under a comfortable size.
  if (file.size <= 900 * 1024) {
    return file;
  }

  try {
    const compressed = await imageCompression(file, {
      ...COMPRESS_OPTIONS,
      // Prefer JPEG for photos; keep PNG when source is PNG with alpha needs.
      fileType:
        file.type === 'image/png' || file.type === 'image/webp'
          ? file.type
          : 'image/jpeg',
    });

    const name =
      compressed.name ||
      file.name.replace(/\.\w+$/i, '') +
        (compressed.type === 'image/png'
          ? '.png'
          : compressed.type === 'image/webp'
            ? '.webp'
            : '.jpg');

    const next = new File([compressed], name, {
      type: compressed.type || file.type,
      lastModified: Date.now(),
    });

    // Prefer compressed only when it actually helps (or fits the soft cap).
    if (next.size < file.size || next.size <= MAX_IMAGE_BYTES) {
      return next.size <= file.size ? next : file.size <= MAX_IMAGE_BYTES ? file : next;
    }
    return file.size <= next.size ? file : next;
  } catch {
    return file;
  }
}

export async function compressListingImages(files: File[]): Promise<File[]> {
  const out: File[] = [];
  for (const file of files) {
    out.push(await compressListingImage(file));
  }
  return out;
}
