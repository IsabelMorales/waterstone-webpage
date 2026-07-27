import type { Metadata } from 'next';
import ListingsHero from '../components/sections/listings/ListingsHero';
import AppFolioListingsEmbed from '../components/sections/listings/AppFolioListingsEmbed';
import { APPFOLIO_LISTINGS_URL } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Listings | Waterstone - Property Management',
  description:
    'Browse current rental listings managed by WaterStone Group. Available units updated in real time via AppFolio.',
};

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <ListingsHero />
      <section className="w-full py-12 md:py-16 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl mb-4">
            Explore our currently available rentals below. Listings are powered by
            AppFolio and update automatically as units become available.
          </p>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl mb-8">
            If there are no open units at the moment, AppFolio will show a short notice
            in the panel below. Check back soon or open the full listings portal for the
            latest updates.
          </p>
          <AppFolioListingsEmbed />
          <p className="mt-6 text-sm text-gray-400 text-center">
            Having trouble viewing listings?{' '}
            <a
              href={APPFOLIO_LISTINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:underline"
            >
              Open them on AppFolio
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
