'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimeSlot {
  value: string;
  label: string;
}

export function buildViewingTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 17; hour += 1) {
    const value = `${String(hour).padStart(2, '0')}:00`;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    slots.push({
      value,
      label: `${hour12}:00 ${suffix}`,
    });
  }
  return slots;
}

const TIME_SLOTS = buildViewingTimeSlots();

interface ViewingTimeSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ViewingTimeSelect({
  id,
  value,
  onChange,
  className,
}: ViewingTimeSelectProps) {
  const autoId = useId();
  const triggerId = id || autoId;
  const listboxId = `${triggerId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selected = TIME_SLOTS.find((slot) => slot.value === value);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function selectSlot(slotValue: string) {
    onChange(slotValue);
    setOpen(false);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-left',
          'text-[var(--color-almost-white)] transition-colors',
          'hover:border-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
          open && 'border-brand-accent/70 ring-2 ring-brand-primary'
        )}
      >
        <span className={cn(!selected && 'text-gray-500')}>
          {selected?.label || 'Select a time'}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 flex-shrink-0 text-gray-400 transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className={cn(
            'absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-600',
            'bg-gray-900 py-1 shadow-lg shadow-black/40'
          )}
        >
          {TIME_SLOTS.map((slot) => {
            const isSelected = slot.value === value;
            return (
              <li key={slot.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => selectSlot(slot.value)}
                  className={cn(
                    'flex w-full px-4 py-2.5 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-brand-primary/30 text-[var(--color-almost-white)]'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-[var(--color-almost-white)]'
                  )}
                >
                  {slot.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <input
        type="text"
        name="preferredTime"
        value={value}
        required
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={() => undefined}
      />
    </div>
  );
}
