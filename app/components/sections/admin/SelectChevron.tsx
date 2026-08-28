import { cn } from '@/lib/utils';

interface SelectChevronProps {
  className?: string;
}

export default function SelectChevron({ className }: SelectChevronProps) {
  return (
    <svg
      className={cn(
        'pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400',
        className
      )}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
