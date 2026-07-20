import type { Metadata } from 'next';
import ServicesHero from '../components/sections/services/ServicesHero';
import ServicesContent from '../components/sections/services/ServicesContent';
import ServicesDetailedAccordion from '../components/sections/services/ServicesDetailedAccordion';

export const metadata: Metadata = {
  title: 'Services | Waterstone - Property Management',
  description:
    'Our services cover all property management aspects: Administration, Maintenance & Janitorial, and Accounting & Finances.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <ServicesHero />
      <ServicesContent />
      <ServicesDetailedAccordion />
    </div>
  );
}
