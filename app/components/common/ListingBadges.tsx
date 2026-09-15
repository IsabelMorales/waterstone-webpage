import { cn } from '@/lib/utils';
import type { ListingStatus, ListingType } from '@/lib/types/listing';
import {
  listingStatusLabel,
  listingTypeLabel,
} from '@/lib/listing-options';

interface ListingBadgeProps {
  type?: ListingType;
  status?: ListingStatus;
  className?: string;
}

export function ListingTypeBadge({
  type,
  className,
}: {
  type: ListingType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]',
        'bg-brand-primary/20 text-brand-accent',
        className
      )}
    >
      {listingTypeLabel(type)}
    </span>
  );
}

export function ListingStatusBadge({
  status,
  className,
}: {
  status: ListingStatus;
  className?: string;
}) {
  const tone =
    status === 'available'
      ? 'bg-emerald-500/15 text-emerald-300'
      : status === 'pending'
        ? 'bg-amber-500/15 text-amber-300'
        : 'bg-gray-500/20 text-gray-300';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]',
        tone,
        className
      )}
    >
      {listingStatusLabel(status)}
    </span>
  );
}

export default function ListingBadges({
  type,
  status,
  className,
}: ListingBadgeProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {type && <ListingTypeBadge type={type} />}
      {status && <ListingStatusBadge status={status} />}
    </div>
  );
}
