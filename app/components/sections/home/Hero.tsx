'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HERO_IMAGES = [
  { src: '/hero-1.webp', alt: 'Waterstone Hero First' },
  { src: '/hero-2.webp', alt: 'Waterstone Hero Second' },
  { src: '/hero-3.webp', alt: 'Waterstone Hero Third' },
  { src: '/hero-4.webp', alt: 'Waterstone Hero Fourth' },
] as const;

/** Start rotating soon after first paint; keep later slides deferred. */
const CAROUSEL_START_DELAY_MS = 800;
const ROTATION_INTERVAL_MS = 3000;
const TRANSITION_DURATION_MS = 800;

/** Full-bleed hero: serve smaller files on phones. */
const HERO_SIZES = '100vw';
const HERO_QUALITY = 70;

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselReady, setCarouselReady] = useState(false);
  /** Only mount slides that are (or were) needed — keeps LCP light. */
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    const startId = window.setTimeout(() => {
      setCarouselReady(true);
      setMounted((prev) => new Set(prev).add(1));
    }, CAROUSEL_START_DELAY_MS);

    return () => window.clearTimeout(startId);
  }, []);

  useEffect(() => {
    if (!carouselReady) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % HERO_IMAGES.length;
        setMounted((seen) => {
          const updated = new Set(seen);
          updated.add(next);
          updated.add((next + 1) % HERO_IMAGES.length);
          return updated;
        });
        return next;
      });
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [carouselReady]);

  return (
    <section className="relative w-full h-[90vh] min-h-[37.5rem] max-h-[50rem] overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gray-900">
        {HERO_IMAGES.map((img, index) => {
          if (!mounted.has(index)) return null;
          const isActive = index === currentIndex;
          return (
            <div
              key={img.src}
              className="absolute inset-0 w-full h-full transition-opacity ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                transitionDuration: `${TRANSITION_DURATION_MS}ms`,
              }}
              aria-hidden={!isActive}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
                sizes={HERO_SIZES}
                quality={HERO_QUALITY}
                className="object-cover"
              />
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-[var(--color-almost-black)]/50" />

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light uppercase tracking-[0.12em] text-[var(--color-almost-white)] mb-6 leading-snug">
              Real Estate
              <br />
              Realized Opportunities
            </h1>

            <p
              className="text-lg sm:text-xl md:text-2xl font-medium text-[var(--color-almost-white)] mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}
            >
              See how your real estate, with the right management, can perform
              like you never knew it could. We help owners in New York, New
              Jersey, and Florida protect value, stabilize cash flow, and get
              more from every asset.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact-us"
                className="px-8 py-4 bg-brand-primary text-[var(--color-almost-white)] text-lg font-medium rounded-lg hover:bg-brand-accent transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
