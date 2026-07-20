import type { Metadata } from 'next';
import AboutHero from '../components/sections/about/AboutHero';
import AboutContent from '../components/sections/about/AboutContent';

export const metadata: Metadata = {
  title: 'About Us | Waterstone - Property Management',
  description:
    'WaterStone Group specializes in real estate management for landlords in New York and Florida — traditional values with contemporary property management.',
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <AboutHero />
      <AboutContent />
    </div>
  );
}
