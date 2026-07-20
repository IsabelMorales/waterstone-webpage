"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  { src: "/hero-1.webp", alt: "Waterstone Hero First" },
  { src: "/hero-2.jpg", alt: "Waterstone Hero Second" },
  { src: "/hero-3.jpg", alt: "Waterstone Hero Third" },
  { src: "/hero-4.jpg", alt: "Waterstone Hero Fourth" },
] as const;

const ROTATION_INTERVAL_MS = 3000;
const TRANSITION_DURATION_MS = 800;

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[90vh] min-h-[37.5rem] max-h-[50rem] overflow-hidden">
      {/* Background Images - Carrusel con transición */}
      <div className="absolute inset-0 w-full h-full">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={img.src}
            className="absolute inset-0 w-full h-full transition-opacity ease-in-out"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transitionDuration: `${TRANSITION_DURATION_MS}ms`,
            }}
            aria-hidden={index !== currentIndex}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              className="object-cover"
              quality={90}
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay with Brand Color */}
      <div className="absolute inset-0 bg-[var(--color-almost-black)]/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[var(--color-almost-white)] mb-6 leading-tight">
             Real Estate <br/> Realized Opportunities
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-almost-white)]/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              In one of the toughest real estate markets in the world, the biggest 
              players are not necessarily the best ones; definitely not for everyone. 
              <br/> While there are some players in New York that are bigger than us, 
              we may still be the management company that is just the right size for <strong>YOU</strong>.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact-us"
                className="px-8 py-4 bg-brand-primary text-[var(--color-almost-white)] text-lg font-medium rounded-lg hover:bg-brand-dark transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-transparent"
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
