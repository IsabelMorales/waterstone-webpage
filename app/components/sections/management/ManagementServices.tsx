import AnimatedOnScroll from '../../common/AnimatedOnScroll';
import { MessagesSquare, Wrench, Wallet, ClipboardList } from 'lucide-react';

type LucideIcon = typeof MessagesSquare;

interface CoreService {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const coreServices: CoreService[] = [
  {
    title: 'Tenant Relations & Support',
    description:
      'We manage all communications, requests, and lease coordination. By maintaining professional, responsive relationships, we increase tenant satisfaction and minimize turnover.',
    Icon: MessagesSquare,
  },
  {
    title: 'Proactive Maintenance & Repairs',
    description:
      "From routine inspections to urgent repairs, we coordinate skilled contractors to safeguard your building's structure and keep systems operating reliably.",
    Icon: Wrench,
  },
  {
    title: 'Rent Collection & Financial Reporting',
    description:
      'Punctual rent collection and clear financial tracking. We ensure reliable cash flow and provide straightforward accounting so you always know where your numbers stand.',
    Icon: Wallet,
  },
  {
    title: 'Day-to-Day Operations',
    description:
      'We oversee vendor contracts, common area upkeep, and building guidelines, resolving minor issues before they become costly headaches.',
    Icon: ClipboardList,
  },
];

export default function ManagementServices() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-almost-white)] mb-10 md:mb-12 text-center">
            End-to-End Operational Excellence
          </h2>
        </AnimatedOnScroll>

        <AnimatedOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {coreServices.map((service) => (
              <div
                key={service.title}
                className="border border-gray-700 rounded-lg bg-gray-800/50 px-6 py-6 transition-colors hover:border-gray-600"
              >
                <service.Icon
                  className="text-brand-accent mb-4"
                  size={36}
                  strokeWidth={1.5}
                  aria-hidden
                />
                <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-almost-white)] mb-3">
                  {service.title}
                </h3>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedOnScroll>
      </div>
    </section>
  );
}
