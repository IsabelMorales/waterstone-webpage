'use client';

import { useState } from 'react';
import AnimatedOnScroll from './AnimatedOnScroll';
import {
  FileSearch,
  Megaphone,
  UserCheck,
  Key,
  Wallet,
  Scale,
  Briefcase,
  Search,
  Calculator,
  Wrench,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LucideIcon = typeof FileSearch;

type BulletItem = string | { main: string; sub: string[] };

interface DetailedService {
  id: string;
  title: string;
  Icon: LucideIcon;
  items: BulletItem[];
}

const detailedServices: DetailedService[] = [
  {
    id: 'property-evaluation',
    title: 'Property Evaluation management',
    Icon: FileSearch,
    items: [
      'Documentation of property – Environment, Exterior and Interior',
      'Recommend potential or necessary repairs or enhancements to maximize rent.',
      'Determine optimal rental rate based on area and typical and recent rents of similar size and type properties.',
      'Determine general property policies regarding use of common areas, pets, smoking etc.',
      'Installation of property facilities and a lock box',
    ],
  },
  {
    id: 'property-marketing',
    title: 'Property marketing',
    Icon: Megaphone,
    items: [
      {
        main: 'Preparation for market submission',
        sub: [
          'Cleaning the property and optimize exterior and interior',
          'Enhance landscaping to improve visual appeal',
        ],
      },
      {
        main: 'Create and manage a marketing advertising campaign:',
        sub: [
          'Submit to rental listing websites',
          'Print publications',
          'Signs',
          'Fliers',
        ],
      },
      'Collaborations with other realty agencies – to maximize rental fitness',
      'Establishment of means for providing detailed information about properties to prospective tenants',
      'Arrange responsive solutions for field calls from prospects\' questions and viewing requests.',
      'Arrangement for meetings and property showings at appropriate times.',
      'Provision of rental applications.',
      'Collection of applications and application fees.',
      'Collection applications with application fee',
    ],
  },
  {
    id: 'screening',
    title: 'Screening and Selection of tenants',
    Icon: UserCheck,
    items: [
      'Background checks for identity verification, credit history, rental history, income etc.',
      'Classify tenant fitness based on pre-determined criteria',
      'Notification to tenants who were rejected',
    ],
  },
  {
    id: 'move-in',
    title: 'Move in of tenant',
    Icon: Key,
    items: [
      'Leasing agreement',
      'Confirmation with tenant of dates for move in.',
      'Confirmation of tenant understanding of the leasing terms such as payment and property maintenance',
      'Verification of the proper execution of the agreements',
      'Inspection of move-in with the tenant, and obtaining a signed report, which confirms the condition of the property before the move-in.',
      'Collection of initial months rent and security deposit',
    ],
  },
  {
    id: 'rent-collection',
    title: 'Collection of Rent',
    Icon: Wallet,
    items: [
      'Rental receipt',
      'Late payments hunt down',
      'Sending notices for pay or quit',
      'Late fees enforcement',
    ],
  },
  {
    id: 'evictions',
    title: 'Evictions',
    Icon: Scale,
    items: [
      'Filing relevant documentation for initiation and completion of an unlawful detainer action',
      'Representation of owner in court',
      'Coordination with law enforcement for tenant and tenant\'s possessions removal from unit',
    ],
  },
  {
    id: 'legal',
    title: 'Legal management',
    Icon: Briefcase,
    items: [
      'Providing advice when a legal dispute or litigation occurs',
      'Referring owner to an appropriate attorney as needed',
    ],
  },
  {
    id: 'inspections',
    title: 'Inspections',
    Icon: Search,
    items: [
      'Performance of periodic, pre-defined scheduled inspections (interior and exterior) to identify needed repairs, removal of safety hazards, fixing of code and lease violations, etc.',
      'Generate periodic reports concerning the condition of the property for the owner inspection',
    ],
  },
  {
    id: 'financial',
    title: 'Financial',
    Icon: Calculator,
    items: [
      'Property management accounting services',
      'Arrange payments such as mortgage, insurance, etc. on behalf of owner',
      'Provision of detailed expenses documentation through invoices and receipts',
      'Maintenance of records: paid invoices, inspection reports, leases, warranties, etc.',
      'Submit annual reports, suited for tax purposes as well as tax documents including a 1099 form',
      'Provide relevant tax deductions information to owners related to their rental property',
      'Provision of monthly cash-flow statements including detailed listing of itemized expenses and income',
    ],
  },
  {
    id: 'maintenance-remodeling',
    title: 'Maintenance, Remodeling and Repairs',
    Icon: Wrench,
    items: [
      'Manage in-house maintenance crew',
      'Establishment of a prevention-maintenance guidelines and policy to identify needed repairs',
      'Manage ongoing network of licensed, bonded and fully insured skilled professionals contractors who have been selected for value pricing and excellent up to code work.',
      'Appropriation of jobs assignments to in-house employees, handyman and/or professional contractors.',
      {
        main: 'Outdoor Maintenance',
        sub: [
          'Snow and leaf removal',
          'Maintenance of Landscaping',
          'Trash and Debris removal',
        ],
      },
      'Establishment and monitoring of a 24 hour emergency repair hot-line',
      {
        main: 'Renovation / rehab initiatives',
        sub: [
          'Recommend project strategies / initiatives to maximize rental income.',
          'Preliminary cost estimates preparation',
          'Obtain multiple independent bids for projects',
          'Manage and oversee project execution',
        ],
      },
    ],
  },
  {
    id: 'move-out',
    title: 'Move out',
    Icon: LogOut,
    items: [
      'Move out unit inspection – providing a property\'s condition report upon move-out',
      'Interaction with moving-out tenant – Providing tenant with moving out report and estimated damages',
      'Refunding security deposit balance to the tenant, after resolving all damages issues',
      'Unit cleaning, repairing and /or upgrading',
      'Install new locks',
      'Submit property back on the market for rent',
    ],
  },
];

function BulletList({ items }: { items: BulletItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => {
        if (typeof item === 'string') {
          return (
            <li key={idx} className="flex gap-2 text-base text-gray-300 leading-relaxed">
              <span className="text-brand-accent flex-shrink-0" aria-hidden>•</span>
              <span>{item}</span>
            </li>
          );
        }
        return (
          <li key={idx} className="space-y-1">
            <div className="flex gap-2 text-base text-gray-300 leading-relaxed">
              <span className="text-brand-accent flex-shrink-0" aria-hidden>•</span>
              <span>{item.main}</span>
            </div>
            <ul className="ml-5 mt-1 space-y-1 border-l border-gray-600 pl-4">
              {item.sub.map((s, subIdx) => (
                <li key={subIdx} className="text-sm text-gray-400 leading-relaxed">
                  {s}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

export default function ServicesDetailedAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="w-full py-4 bg-brand-dark border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <p className="text-lg md:text-xl text-[var(--color-almost-white)] mb-8 leading-relaxed">
            Following is a more detailed listing of our services. Not all are relevant in all cases.
          </p>

          <div className="space-y-2" role="list">
            {detailedServices.map((service) => {
              const isOpen = openId === service.id;
              return (
                <div
                  key={service.id}
                  className="border border-gray-700 rounded-lg overflow-hidden transition-colors hover:border-gray-600"
                  role="listitem"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : service.id)}
                    className="w-full flex items-center gap-4 px-4 py-4 md:px-6 md:py-5 text-left bg-gray-800/50 hover:bg-gray-800/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                    aria-expanded={isOpen}
                    aria-controls={`accordion-content-${service.id}`}
                    id={`accordion-trigger-${service.id}`}
                  >
                    <service.Icon
                      className={cn(
                        'flex-shrink-0 transition-transform duration-200',
                        isOpen ? 'text-brand-accent' : 'text-gray-500'
                      )}
                      size={28}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <span className="flex-1 text-lg md:text-xl font-semibold text-[var(--color-almost-white)]">
                      {service.title}
                    </span>
                    <svg
                      className={cn(
                        'w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    id={`accordion-content-${service.id}`}
                    role="region"
                    aria-labelledby={`accordion-trigger-${service.id}`}
                    className={cn(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    <div className="px-4 py-4 md:px-6 md:py-5 border-t border-gray-700 bg-gray-900/30">
                      <BulletList items={service.items} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedOnScroll>
      </div>
    </section>
  );
}
