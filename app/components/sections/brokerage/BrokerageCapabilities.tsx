import AnimatedOnScroll from '../../common/AnimatedOnScroll';
import { MapPin, Tag, KeyRound, Handshake } from 'lucide-react';

type LucideIcon = typeof MapPin;

interface BrokerageCapability {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const capabilities: BrokerageCapability[] = [
  {
    title: 'Acquisitions & Investments',
    description:
      'Identifying target properties—both on and off-market—that align with your portfolio strategy, backed by thorough market valuation and risk analysis.',
    Icon: MapPin,
  },
  {
    title: 'Asset Sales & Positioning',
    description:
      "Structuring tailored sales strategies to showcase your property's full value, reaching qualified buyers and negotiating competitive terms to optimize your return.",
    Icon: Tag,
  },
  {
    title: 'Commercial & Residential Leasing',
    description:
      'Connecting landlords with stable, high-caliber tenants while helping businesses find spaces that support their operational needs and growth plans.',
    Icon: KeyRound,
  },
  {
    title: 'Negotiation & Deal Management',
    description:
      'Managing counteroffers, contract details, and due diligence with clear communication, ensuring transactions proceed smoothly from letter of intent to closing.',
    Icon: Handshake,
  },
];

export default function BrokerageCapabilities() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-almost-white)] mb-10 md:mb-12 text-center">
            End-to-End Representation Across Every Deal
          </h2>
        </AnimatedOnScroll>

        <AnimatedOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {capabilities.map((capability) => (
              <div
                key={capability.title}
                className="border border-gray-700 rounded-lg bg-gray-800/50 px-6 py-6 transition-colors hover:border-gray-600"
              >
                <capability.Icon
                  className="text-brand-accent mb-4"
                  size={36}
                  strokeWidth={1.5}
                  aria-hidden
                />
                <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-almost-white)] mb-3">
                  {capability.title}
                </h3>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedOnScroll>
      </div>
    </section>
  );
}
