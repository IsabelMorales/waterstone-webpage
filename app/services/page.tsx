import type { Metadata } from 'next';
import ServicesHero from '../components/ServicesHero';
import ServicesContent from '../components/ServicesContent';
import ServicesDetailedAccordion from '../components/ServicesDetailedAccordion';

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
