import AnimatedOnScroll from '../../common/AnimatedOnScroll';
import {
  Building,
  ChartColumn,
  MessagesSquare,
  HandCoins,
  UserCheck,
  ClipboardCheck,
} from 'lucide-react';

type LucideIcon = typeof Building;

interface Responsibility {
  number: number;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const responsibilities: Responsibility[] = [
  {
    number: 1,
    title: 'Building management',
    description:
      'At Waterstone, we bridge the gap between building needs and expert execution. We design tailored maintenance strategies and provide on-site supervision for all repairs and inspections. Our hands-on experience allows us to select the right professionals and verify their work, ensuring your property remains safe, compliant, and impeccably maintained.',
    Icon: Building,
  },
  {
    number: 2,
    title: 'Financial Management',
    description:
      'As property managers, we assume the responsibility for financial calculations and keeping tabs on cash flow. We employ contemporary accounting management software that allows us to keep track of rent collection amounts, and even collect rent virtually from residents.',
    Icon: ChartColumn,
  },
  {
    number: 3,
    title: 'Customer Service management',
    description:
      'We are very personable and deal with residents on a regular basis. Working in property management is working in customer service. We form positive working relationships with contractors, skilled professionals, residents and our clients.',
    Icon: MessagesSquare,
  },
  {
    number: 4,
    title: 'Rent Collections',
    description:
      'We implement rigorous systems to ensure consistent cash flow and financial stability for your property. By balancing professional firmness with clear communication, we minimize delinquencies and handle the entire collection process, providing owners with a reliable and predictable income stream.',
    Icon: HandCoins,
  },
  {
    number: 5,
    title: 'Tenant Screening',
    description:
      'Our vetting process goes beyond standard. We focus on securing residents who meet your property’s specific financial standards and contribute to a stable, respectful community environment.',
    Icon: UserCheck,
  },
  {
    number: 6,
    title: 'Regulatory Compliance',
    description:
      'Navigating the complexities of local laws is a core part of our oversight. We proactively manage fire systems, elevators, and boiler checks, along with all local law inspections, to ensure your building meets every safety standard. By staying ahead of filing deadlines, we protect your property from penalties and ensure full compliance on time, every time.',
    Icon: ClipboardCheck,
  },
];

export default function ManagementResponsibilities() {
  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-almost-white)] mb-4">
              What we do at Waterstone
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              As Real estate property management we are skillful, methodical and
              possess robust expertise in the following main areas
            </p>
          </div>
        </AnimatedOnScroll>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {responsibilities.map((responsibility) => {
            return (
              <AnimatedOnScroll
                key={responsibility.number}
              >
                <div className="group">
                  {/* Icono encima del título, alineado a la izquierda */}
                  <div className="mb-1">
                    <responsibility.Icon
                      className="text-brand-accent flex-shrink-0"
                      size={40}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-[var(--color-almost-white)] mb-3 transition-colors duration-300">
                    {responsibility.title}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    {responsibility.description}
                  </p>
                </div>
              </AnimatedOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
