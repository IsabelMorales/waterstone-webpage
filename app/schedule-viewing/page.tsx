import type { Metadata } from 'next';
import ViewingHero from '../components/sections/viewing/ViewingHero';
import ViewingRequestForm from '../components/sections/viewing/ViewingRequestForm';

export const metadata: Metadata = {
  title: 'Schedule a Viewing | Waterstone - Property Management',
  description:
    'Request a preferred date and time to tour a WaterStone Group listing. Our team will confirm your appointment.',
  robots: {
    index: false,
    follow: false,
  },
};

interface ScheduleViewingPageProps {
  searchParams: Promise<{
    title?: string;
    address?: string;
    slug?: string;
  }>;
}

export default async function ScheduleViewingPage({
  searchParams,
}: ScheduleViewingPageProps) {
  const params = await searchParams;
  const listingTitle =
    typeof params.title === 'string' ? params.title.trim() : '';
  const listingAddress =
    typeof params.address === 'string' ? params.address.trim() : '';
  const listingSlug =
    typeof params.slug === 'string' ? params.slug.trim() : '';

  return (
    <div className="min-h-screen bg-brand-dark">
      <ViewingHero />
      <section className="w-full py-12 md:py-16 bg-brand-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Tell us when you&apos;d like to see the property. We&apos;ll review
              your request and confirm a time that works for everyone. Viewing
              requests are welcomed from all prospective residents in accordance
              with Equal Housing Opportunity principles.
            </p>
          </div>
          <ViewingRequestForm
            listingTitle={listingTitle}
            listingAddress={listingAddress}
            listingSlug={listingSlug}
          />
        </div>
      </section>
    </div>
  );
}
