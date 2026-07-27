import type { Metadata } from 'next';
import BrokerageHero from '../components/sections/brokerage/BrokerageHero';
import BrokerageOverview from '../components/sections/brokerage/BrokerageOverview';
import BrokerageCapabilities from '../components/sections/brokerage/BrokerageCapabilities';
import BrokerageCta from '../components/sections/brokerage/BrokerageCta';

export const metadata: Metadata = {
  title: 'WS Brokerage | Waterstone - Property Management',
  description:
    'Clear market insight and confident real estate transactions. Acquisitions, sales, leasing, and deal management.',
};

export default function WaterstoneBrokeragePage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <BrokerageHero />
      <BrokerageOverview />
      <BrokerageCapabilities />
      <BrokerageCta />
    </div>
  );
}
