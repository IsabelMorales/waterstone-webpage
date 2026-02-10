import Hero from './components/Hero';
import CompanyFeatures from './components/CompanyFeatures';
import ManagementResponsibilities from './components/ManagementResponsibilities';
import PropertyTypes from './components/PropertyTypes';

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
