'use client';

import { cn } from '@/lib/utils';

interface AmenityCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function AmenityCheckbox({
  id,
  label,
  checked,
  onChange,
  className,
}: AmenityCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'group inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-gray-200',
        className
      )}
    >
      <span className="relative h-4 w-4 flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 box-border flex items-center justify-center rounded border-2 transition-colors',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-primary',
            checked
              ? 'border-brand-accent bg-brand-accent'
              : 'border-gray-500 bg-gray-900 group-hover:border-gray-400'
          )}
        >
          <svg
            viewBox="0 0 12 12"
            className={cn(
              'h-3 w-3 text-[var(--color-almost-black)] transition-opacity',
              checked ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden
          >
            <path
              d="M2.5 6.2L4.8 8.5L9.5 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <span
        className={cn(
          'transition-colors',
          checked && 'text-[var(--color-almost-white)]'
        )}
      >
        {label}
      </span>
    </label>
  );
}

interface AmenityRadioProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export function AmenityRadio({
  id,
  name,
  label,
  checked,
  onChange,
  className,
}: AmenityRadioProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'group inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-gray-200',
        className
      )}
    >
      <span className="relative h-[18px] w-[18px] flex-shrink-0">
        <input
          id={id}
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 box-border rounded-full border-2 bg-gray-900 transition-colors',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-primary',
            checked
              ? 'border-brand-accent'
              : 'border-gray-500 group-hover:border-gray-400'
          )}
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent transition-transform',
            checked ? 'scale-100' : 'scale-0'
          )}
        />
      </span>
      <span
        className={cn(
          'transition-colors',
          checked && 'text-[var(--color-almost-white)]'
        )}
      >
        {label}
      </span>
    </label>
  );
}

interface AmenityGroupProps {
  title: string;
  children: React.ReactNode;
}

export function AmenityGroup({ title, children }: AmenityGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--color-almost-white)]">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
        {children}
      </div>
    </div>
  );
}
