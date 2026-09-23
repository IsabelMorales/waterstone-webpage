import type { Metadata } from 'next';
import ContactHero from '../components/sections/contact/ContactHero';
import ContactForm from '../components/sections/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Waterstone - Property Management',
  description:
    'Get in touch with WaterStone Group for property management services in New York, New Jersey, and Florida.',
};

interface ContactUsPageProps {
  searchParams: Promise<{ title?: string }>;
}

export default async function ContactUsPage({
  searchParams,
}: ContactUsPageProps) {
  const params = await searchParams;
  const title = typeof params.title === 'string' ? params.title.trim() : '';

  const initialMessage = title
    ? `I'm interested in the listing “${title}”.\n\n`
    : '';

  return (
    <div className="min-h-screen bg-brand-dark">
      <ContactHero />
      <section className="w-full py-12 md:py-16 bg-brand-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Whether you&apos;re a property owner looking for management support or have
              a question about our services, we&apos;d love to hear from you. Fill out the
              form below and our team will get back to you shortly.
            </p>
          </div>
          <ContactForm initialMessage={initialMessage} />
        </div>
      </section>
    </div>
  );
}
