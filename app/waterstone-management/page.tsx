import type { Metadata } from 'next';
import ManagementHero from '../components/sections/management/ManagementHero';
import ManagementOverview from '../components/sections/management/ManagementOverview';
import ManagementServices from '../components/sections/management/ManagementServices';
import ManagementCta from '../components/sections/management/ManagementCta';

export const metadata: Metadata = {
  title: 'WS Management | Waterstone - Property Management',
  description:
    'Hassle-free property management with maximum investment value. Expert oversight for landlords in New York and Florida.',
};

export default function WaterstoneManagementPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <ManagementHero />
      <ManagementOverview />
      <ManagementServices />
      <ManagementCta />
    </div>
  );
}
