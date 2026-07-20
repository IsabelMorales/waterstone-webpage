import AnimatedOnScroll from '../../common/AnimatedOnScroll';
import { ClipboardList, Wrench, Calculator } from 'lucide-react';

type LucideIcon = typeof ClipboardList;

interface ServiceItem {
  title: string;
  items: string[];
  Icon: LucideIcon;
}

const services: ServiceItem[] = [
  {
    title: 'Administration Services',
    Icon: ClipboardList,
    items: [
      'Records Management – maintenance of records and files for effective data retrieval.',
      'Enforcement of Governing Regulations – Ongoing monitoring of all manners of application of regulations which govern owners as well as tenants. We interact on behalf of the sides to resolve possible disputes.',
      'Board & Member Meetings – Preparations of agendas, distribution of notices and all relevant documents and manage the actions needed to make sure meetings run smoothly and effectively.',
      'Structural Modifications – Processing applications and handling structural initiatives or modifications.',
      'Maintenance of Common Areas – Scheduling and executing periodic inspections and maintenance.',
      'Vendor Relations – Research and interactions with vendors, proposal submissions, handling negotiations and contracts and monitoring vendor performance.',
    ],
  },
  {
    title: 'Maintenance & Janitorial Services',
    Icon: Wrench,
    items: [
      'Maintenance – Management and supervision of periodic tasks such as Painting, Pressure cleaning, Gardening and Cleaning.',
      'Janitorial – Cleaning and maintenance of Lobbies, clubhouses, Common areas, Hallways, catwalks, laundry rooms, bathrooms and all other common facilities.',
      'Vendor Supervision – Research, recommend, negotiate and facilitate all insured vendor relationships.',
    ],
  },
  {
    title: 'Accounting & Finances',
    Icon: Calculator,
    items: [
      'Financial Reports – Waterstone provides timely periodic reports including profit/loss statements as well as analysis of actual figures vs. planned budget. Cash disbursement as well as delinquent receivables.',
      'Budgeting Process – Preparation of preliminary and final approved budget and reserve schedules for the upcoming year.',
      'Delinquency Assessment – Constant monitoring of delinquencies. When needed, we pursue delinquencies and achieve satisfactory resolutions.',
      'Annual Audit – Waterstone finds and recommends a CPA firm to prepare an annual audit, review and compilation of finances.',
      'Payments – Providing appropriate and convenient payment methods, including mailing of checks, direct deposit, online payments, or automatic debits.',
      'Employees Payroll – Unifying a single payroll system management.',
      'Bank Accounts & Expenses / Vendor Payments – Paper or Online Invoices approval of vendors and check signature processing. Integration of Accounts payable records with the financial reporting system and bank accounts for monthly reconciliation.',
    ],
  },
];

export default function ServicesContent() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((service) => (
            <AnimatedOnScroll key={service.title}>
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <service.Icon
                    className="text-brand-accent flex-shrink-0"
                    size={40}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-almost-white)] mb-4 uppercase tracking-wide">
                  {service.title}
                </h2>
                <ul className="space-y-3 flex-1">
                  {service.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-base md:text-lg text-gray-300 leading-relaxed flex gap-2"
                    >
                      <span className="text-brand-accent flex-shrink-0" aria-hidden>
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
