import type { Metadata } from 'next';
import PropertiesHero from '../components/sections/properties/PropertiesHero';
import PropertiesGrid from '../components/sections/properties/PropertiesGrid';

export const metadata: Metadata = {
  title: 'Properties | Waterstone - Property Management',
  description:
    'A sample of the real estate properties we manage throughout New York City boroughs and Florida.',
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <PropertiesHero />
      <PropertiesGrid />
    </div>
  );
}
