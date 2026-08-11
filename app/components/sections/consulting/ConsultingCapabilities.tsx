import AnimatedOnScroll from '../../common/AnimatedOnScroll';
import { ChartColumn, Compass, Shield, DraftingCompass } from 'lucide-react';

type LucideIcon = typeof ChartColumn;

interface ConsultingCapability {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const capabilities: ConsultingCapability[] = [
  {
    title: 'Operational & Financial Optimization',
    description:
      'We audit building expenses, vendor agreements, and operational workflows to eliminate waste, improve net operating income (NOI), and boost overall asset value.',
    Icon: ChartColumn,
  },
  {
    title: 'Portfolio Growth & Acquisition Strategy',
    description:
      'Whether you are looking to scale locally or diversify into new asset classes, we map out clear growth roadmaps that align with your risk tolerance and financial goals.',
    Icon: Compass,
  },
  {
    title: 'Market Risk & Volatility Navigation',
    description:
      'We evaluate market shifts, interest rate environments, and local regulatory changes to help you safeguard existing assets and adjust strategy before problems arise.',
    Icon: Shield,
  },
  {
    title: 'Asset Repositioning & Value-Add Planning',
    description:
      'Transform underperforming properties through targeted upgrades, operational restructurings, and repositioning plans designed to attract premium tenants and higher yields.',
    Icon: DraftingCompass,
  },
];

export default function ConsultingCapabilities() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-almost-white)] mb-10 md:mb-12 text-center">
            Targeted Advisory for Every Phase of Growth
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
