import Hero from './components/Hero';
import ManagementResponsibilities from './components/ManagementResponsibilities';
import PropertyTypes from './components/PropertyTypes';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-dark">
      <Hero />
      <ManagementResponsibilities />
      <PropertyTypes />
      {/* Más secciones se agregarán aquí */}
      </main>
  );
}
