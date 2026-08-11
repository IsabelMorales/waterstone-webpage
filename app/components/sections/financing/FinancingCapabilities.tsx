import AnimatedOnScroll from '../../common/AnimatedOnScroll';
import { Building2, ChartColumn, FileBadge, ArrowLeftRight } from 'lucide-react';

type LucideIcon = typeof Building2;

interface FinancingCapability {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const capabilities: FinancingCapability[] = [
  {
    title: 'Acquisition Loans',
    description:
      'Capital solutions designed to move fast. We help you secure competitive debt packages for new property purchases so you can close with confidence.',
    Icon: Building2,
  },
  {
    title: 'Refinancing & Equity Release',
    description:
      'Optimize existing debt structures to reduce monthly overhead, lower interest rates, or pull out equity to fund your next venture.',
    Icon: ChartColumn,
  },
  {
    title: 'Lender Network Access',
    description:
      'Tap into established relationships with private, institutional, and traditional lenders to find terms that fit your risk profile and holding period.',
    Icon: FileBadge,
  },
  {
    title: 'Deal Structuring & Advisory',
    description:
      'Beyond just securing a rate, we analyze debt coverage and terms to ensure your financial obligations support long-term property performance.',
    Icon: ArrowLeftRight,
  },
];

export default function FinancingCapabilities() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-almost-white)] mb-10 md:mb-12 text-center">
            Tailored Financing Across Your Portfolio Lifecycle
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
