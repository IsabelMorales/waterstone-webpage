import type { Metadata } from 'next';
import ConsultingHero from '../components/sections/consulting/ConsultingHero';
import ConsultingOverview from '../components/sections/consulting/ConsultingOverview';
import ConsultingCapabilities from '../components/sections/consulting/ConsultingCapabilities';
import ConsultingCta from '../components/sections/consulting/ConsultingCta';

export const metadata: Metadata = {
  title: 'WS Consulting | Waterstone - Property Management',
  description:
    'Strategic real estate guidance grounded in real-world experience. Operational optimization, portfolio growth, and value-add planning.',
};

export default function WaterstoneConsultingPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <ConsultingHero />
      <ConsultingOverview />
      <ConsultingCapabilities />
      <ConsultingCta />
    </div>
  );
}
