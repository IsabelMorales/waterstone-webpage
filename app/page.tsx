import Hero from './components/Hero';
import LogoCarousel from './components/LogoCarousel';
import ManagementResponsibilities from './components/ManagementResponsibilities';
import PropertyTypes from './components/PropertyTypes';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <LogoCarousel />
      <ManagementResponsibilities />
      <PropertyTypes />
      {/* Más secciones se agregarán aquí */}
    </main>
  );
}
