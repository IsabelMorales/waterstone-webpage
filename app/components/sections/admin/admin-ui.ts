import { cn } from '@/lib/utils';

export const adminLabelClassName =
  'block text-sm font-medium text-[var(--color-almost-white)] mb-2';

export const adminInputClassName = cn(
  'w-full rounded-lg border border-gray-600/80 bg-gray-900/40 px-4 py-3',
  'text-[var(--color-almost-white)] placeholder:text-gray-500',
  'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
  'transition-colors'
);

export const adminSelectClassName = cn(
  adminInputClassName,
  'appearance-none pr-11 cursor-pointer'
);

export const adminNumberClassName = cn(
  adminInputClassName,
  '[appearance:textfield]',
  '[&::-webkit-outer-spin-button]:appearance-none',
  '[&::-webkit-inner-spin-button]:appearance-none'
);

export const adminCardClassName = cn(
  'border border-gray-700/80 rounded-lg bg-gray-800/40',
  'px-6 py-8 md:px-10 md:py-10'
);

export const adminPrimaryBtnClassName = cn(
  'inline-flex items-center justify-center rounded-lg bg-brand-primary',
  'px-6 py-3 font-semibold text-[var(--color-almost-white)]',
  'hover:bg-brand-accent transition-colors disabled:opacity-60'
);

export const adminSecondaryBtnClassName = cn(
  'inline-flex items-center justify-center rounded-lg border border-gray-600',
  'px-6 py-3 text-[var(--color-almost-white)]',
  'hover:border-brand-accent hover:text-brand-accent transition-colors'
);

export const adminSectionTitleClassName =
  'text-base md:text-md font-bold uppercase tracking-[0.08em] text-brand-accent mb-5';
