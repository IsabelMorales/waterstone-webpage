'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const dropdownItems = [
  { href: '/waterstone-management', label: 'Waterstone Management' },
  { href: '/waterstone-staffing', label: 'Waterstone Staffing' },
  { href: '/waterstone-financing', label: 'Waterstone Financing' },
  { href: '/waterstone-brokerage', label: 'Waterstone Brokerage' },
  { href: '/waterstone-consulting', label: 'Waterstone Consulting' },
];

export default function WaterstoneGroupDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-semibold text-brand-dark hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary flex items-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        The Waterstone Group
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 bg-almost-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {dropdownItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-brand-dark hover:bg-brand-primary/10 hover:text-brand-primary transition-colors outline-none"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

