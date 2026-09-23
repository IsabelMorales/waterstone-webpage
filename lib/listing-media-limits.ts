/** Shared listing media upload limits (front + docs alignment). */

/** Max size of all new files in one save (images + floor plans). */
export const MAX_UPLOAD_BATCH_BYTES = 50 * 1024 * 1024;

/** Soft cap per photo after compression (API also enforces). */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** Soft anti-abuse cap — primary limit is batch weight. */
export const MAX_IMAGES_SOFT = 60;

export const MAX_FLOOR_PLAN_BYTES = 10 * 1024 * 1024;
export const MAX_FLOOR_PLANS_SOFT = 20;

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

export function sumFileSizes(files: File[]): number {
  return files.reduce((total, file) => total + (file.size || 0), 0);
}
