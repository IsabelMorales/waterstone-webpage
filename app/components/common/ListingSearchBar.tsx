'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListingSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  className?: string;
}

export default function ListingSearchBar({
  value,
  onChange,
  id = 'listing-search',
  placeholder = 'Search by title, address, price, beds…',
  className,
}: ListingSearchBarProps) {
  return (
    <div className={cn('relative w-full max-w-xl', className)}>
      <label htmlFor={id} className="sr-only">
        Search listings
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          'w-full rounded-lg border border-gray-600/80 bg-gray-900/40 py-3 pl-10 pr-10',
          'text-[var(--color-almost-white)] placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
          'transition-colors'
        )}
      />
      {value.trim() ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:text-[var(--color-almost-white)] transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
