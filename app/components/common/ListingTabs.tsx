'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

export type ListingTabItem<T extends string> = {
  id: T;
  label: string;
  count: number;
};

interface ListingTabsProps<T extends string> {
  tabs: ListingTabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
  buttonClassName?: string;
  'aria-label'?: string;
}

export default function ListingTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
  buttonClassName,
  'aria-label': ariaLabel = 'Listing type',
}: ListingTabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    const btn = btnRefs.current.get(activeTab);
    if (!list || !btn) return;

    setIndicator({
      left: btn.offsetLeft,
      width: btn.offsetWidth,
      ready: true,
    });
  }, [activeTab]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, tabs]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  return (
    <div
      ref={listRef}
      className={cn(
        'relative flex flex-wrap gap-2 border-b border-gray-700/80',
        className
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const selected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            ref={(node) => {
              if (node) btnRefs.current.set(tab.id, node);
              else btnRefs.current.delete(tab.id);
            }}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 px-4 py-2.5 font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ease-out',
              selected
                ? 'text-[var(--color-almost-white)]'
                : 'text-gray-500 hover:text-gray-300',
              buttonClassName
            )}
          >
            {tab.label}
            <span
              className={cn(
                'ml-2 font-normal normal-case tracking-normal',
                selected ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              ({tab.count})
            </span>
          </button>
        );
      })}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-brand-accent',
          'tab-indicator-slide',
          indicator.ready
            ? 'transition-[left,width] duration-300 ease-out'
            : 'opacity-0'
        )}
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}
