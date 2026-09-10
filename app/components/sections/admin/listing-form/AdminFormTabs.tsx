'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

export type AdminFormTabItem<T extends string> = {
  id: T;
  label: string;
};

interface AdminFormTabsProps<T extends string> {
  tabs: AdminFormTabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
  'aria-label'?: string;
}

export default function AdminFormTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
  'aria-label': ariaLabel = 'Listing form sections',
}: AdminFormTabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

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

  useEffect(() => {
    const btn = btnRefs.current.get(activeTab);
    btn?.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'nearest',
    });
  }, [activeTab]);

  return (
    <div
      ref={listRef}
      className={cn(
        'relative flex flex-nowrap gap-1 overflow-x-auto border-b border-gray-700/80 scrollbar-thin',
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
              'relative z-10 flex-shrink-0 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ease-out whitespace-nowrap',
              selected
                ? 'text-[var(--color-almost-white)]'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {tab.label}
          </button>
        );
      })}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-brand-accent',
          indicator.ready
            ? 'transition-[left,width] duration-300 ease-out'
            : 'opacity-0'
        )}
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}
