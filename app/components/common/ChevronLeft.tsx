import { cn } from '@/lib/utils';

interface ChevronLeftProps {
  className?: string;
}

export default function ChevronLeft({ className }: ChevronLeftProps) {
  return (
    <svg
      className={cn('h-4 w-4 flex-shrink-0', className)}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M12.5 5L7.5 10L12.5 15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
