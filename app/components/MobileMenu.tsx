'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const waterstoneGroupItems = [
  { href: '/waterstone-management', label: 'Waterstone Management' },
  { href: '/waterstone-staffing', label: 'Waterstone Staffing' },
  { href: '/waterstone-financing', label: 'Waterstone Financing' },
  { href: '/waterstone-brokerage', label: 'Waterstone Brokerage' },
  { href: '/waterstone-consulting', label: 'Waterstone Consulting' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [isWaterstoneGroupOpen, setIsWaterstoneGroupOpen] = useState(false);

  const menuItems = [
    { href: '/services', label: 'Services' },
    { href: '/properties', label: 'Properties' },
    { href: '/listings', label: 'Listings' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact-us', label: 'Contact Us' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[var(--color-almost-black)]/50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[var(--color-almost-white)] shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header del panel móvil */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-brand-dark">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg p-2"
              aria-label="Close menu"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1 px-6">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block px-4 py-3 text-base font-semibold text-brand-dark hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {/* Waterstone Group con submenú */}
              <li>
                <button
                  onClick={() => setIsWaterstoneGroupOpen(!isWaterstoneGroupOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-brand-dark hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-colors"
                >
                  <span>The Waterstone Group</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isWaterstoneGroupOpen ? 'rotate-180' : ''
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
                {isWaterstoneGroupOpen && (
                  <ul className="mt-1 space-y-1 pl-4">
                    {waterstoneGroupItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block px-4 py-2 text-sm text-brand-dark hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          {/* Botón CTA en el panel */}
          <div className="p-6 border-t border-gray-200">
            <Link
              href="/contact-us"
              onClick={onClose}
              className="block w-full text-center px-6 py-3 bg-brand-primary text-[var(--color-almost-white)] font-medium rounded-lg hover:bg-brand-dark transition-all shadow-md hover:shadow-lg"
            >
              TENANT LOGIN
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

