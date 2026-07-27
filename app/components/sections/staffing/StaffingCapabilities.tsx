import AnimatedOnScroll from '../../common/AnimatedOnScroll';
import { Shield, Wrench, ClipboardList, Handshake } from 'lucide-react';

type LucideIcon = typeof Shield;

interface StaffingCapability {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const capabilities: StaffingCapability[] = [
  {
    title: 'Superintendents & On-Site Managers',
    description:
      'Leadership on the ground. Experienced managers who handle daily tenant inquiries, vendor supervision, and unexpected facility issues with calm authority.',
    Icon: Shield,
  },
  {
    title: 'Maintenance & Technical Personnel',
    description:
      'Skilled staff equipped to manage routine upkeep, mechanical checks, and quick repairs—keeping systems running reliably and avoiding costly downtime.',
    Icon: Wrench,
  },
  {
    title: 'Administrative & Front Desk Staff',
    description:
      'Organized, client-facing team members who handle scheduling, tenant communications, documentation, and office workflows with precision.',
    Icon: ClipboardList,
  },
  {
    title: 'Flexible & Custom Staffing Solutions',
    description:
      'Whether you need long-term full-time placements, seasonal support, or dedicated coverage for specific projects, we tailor the hiring structure to match your schedule and budget.',
    Icon: Handshake,
  },
];

export default function StaffingCapabilities() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-almost-white)] mb-10 md:mb-12 text-center">
            Qualified Professionals Across Key Roles
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
