import Hero from './components/sections/home/Hero';
import CompanyFeatures from './components/sections/home/CompanyFeatures';
import ManagementResponsibilities from './components/sections/home/ManagementResponsibilities';
import PropertyTypes from './components/sections/home/PropertyTypes';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-dark">
      <Hero />
      <CompanyFeatures />
      <ManagementResponsibilities />
      <PropertyTypes />
      {/* Más secciones se agregarán aquí */}
      </main>
  );
}
