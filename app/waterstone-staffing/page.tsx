import type { Metadata } from 'next';
import StaffingHero from '../components/sections/staffing/StaffingHero';
import StaffingOverview from '../components/sections/staffing/StaffingOverview';
import StaffingCapabilities from '../components/sections/staffing/StaffingCapabilities';
import StaffingCta from '../components/sections/staffing/StaffingCta';

export const metadata: Metadata = {
  title: 'WS Staffing | Waterstone - Property Management',
  description:
    'Reliable talent for every property role. Targeted staffing for superintendents, maintenance, and administrative teams.',
};

export default function WaterstoneStaffingPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <StaffingHero />
      <StaffingOverview />
      <StaffingCapabilities />
      <StaffingCta />
    </div>
  );
}
