import type { Metadata } from 'next';
import FinancingHero from '../components/sections/financing/FinancingHero';
import FinancingOverview from '../components/sections/financing/FinancingOverview';
import FinancingCapabilities from '../components/sections/financing/FinancingCapabilities';
import FinancingCta from '../components/sections/financing/FinancingCta';

export const metadata: Metadata = {
  title: 'WS Financing | Waterstone - Property Management',
  description:
    'Strategic real estate capital structured for your growth. Acquisition loans, refinancing, and deal advisory.',
};

export default function WaterstoneFinancingPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <FinancingHero />
      <FinancingOverview />
      <FinancingCapabilities />
      <FinancingCta />
    </div>
  );
}
