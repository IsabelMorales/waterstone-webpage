import Hero from './components/Hero';
import LogoCarousel from './components/LogoCarousel';
import TenantsTestimonials from './components/TenantsTestimonials';
import ManagementResponsibilities from './components/ManagementResponsibilities';
import PropertyTypes from './components/PropertyTypes';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-dark">
      <Hero />
      <LogoCarousel />
      <TenantsTestimonials />
      <ManagementResponsibilities />
      <PropertyTypes />
      {/* Más secciones se agregarán aquí */}
      </main>
  );
}
