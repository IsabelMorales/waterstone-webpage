import type { Metadata } from 'next';

const FALLBACK_SITE_URL = 'https://www.waterstoneusa.com';

/** Absolute site origin for Open Graph / canonical URLs. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return FALLBACK_SITE_URL;
}

export const DEFAULT_OG_IMAGE = {
  url: '/preview.jpg',
  width: 1200,
  height: 630,
  alt: 'WaterStone Group — property management in New York, New Jersey, and Florida',
} as const;

export const siteMetadataBase = new URL(getSiteUrl());

export const defaultOpenGraph: NonNullable<Metadata['openGraph']> = {
  type: 'website',
  locale: 'en_US',
  siteName: 'WaterStone Group',
  title: 'Waterstone - Property Management',
  description:
    'Professional property management services in New York, New Jersey, and Florida',
  images: [DEFAULT_OG_IMAGE],
};

export const defaultTwitter: NonNullable<Metadata['twitter']> = {
  card: 'summary_large_image',
  title: 'Waterstone - Property Management',
  description:
    'Professional property management services in New York, New Jersey, and Florida',
  images: [DEFAULT_OG_IMAGE.url],
};
