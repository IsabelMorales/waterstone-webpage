'use client';

import { useEffect, useRef } from 'react';
import { APPFOLIO_LISTINGS_HOST } from '@/lib/links';

interface AppfolioListingOptions {
  hostUrl: string;
  themeColor?: string;
  height?: string;
  width?: string;
  propertyGroup?: string;
  defaultOrder?: string;
}

declare global {
  interface Window {
    Appfolio?: {
      Listing: (options: AppfolioListingOptions) => void;
    };
  }
}

const SCRIPT_SRC = `https://${APPFOLIO_LISTINGS_HOST}/javascripts/listing.js`;
const BRAND_THEME_COLOR = '#006089';

function loadAppfolioScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    if (existing && window.Appfolio?.Listing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load AppFolio listings script'));
    document.body.appendChild(script);
  });
}

export default function AppFolioListingsEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    async function init() {
      try {
        await loadAppfolioScript();
        if (cancelled || !containerRef.current || !window.Appfolio?.Listing) return;

        containerRef.current.innerHTML = '';

        // AppFolio.Listing uses document.write; redirect output into our container.
        const originalWrite = document.write.bind(document);
        document.write = (markup: string) => {
          containerRef.current?.insertAdjacentHTML('beforeend', markup);
        };

        try {
          window.Appfolio.Listing({
            hostUrl: APPFOLIO_LISTINGS_HOST,
            themeColor: BRAND_THEME_COLOR,
            height: '480px',
            width: '100%',
          });
        } finally {
          document.write = originalWrite;
        }
      } catch (error) {
        console.error(error);
        if (containerRef.current) {
          containerRef.current.innerHTML =
            '<p class="text-center text-gray-300 py-8">Unable to load listings right now. Please try again later.</p>';
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[20rem] overflow-hidden rounded-lg bg-gray-800/30"
      aria-label="Available rental listings"
    />
  );
}
