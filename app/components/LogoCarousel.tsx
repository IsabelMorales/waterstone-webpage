'use client';

import Image from 'next/image';

interface LogoItem {
  id: string;
  name: string;
  src: string;
}

// Usamos el logo de la empresa como placeholder para el carrusel
const logos: LogoItem[] = [
  { id: '1', name: 'Waterstone', src: '/logo.png' },
  { id: '2', name: 'Waterstone', src: '/logo.png' },
  { id: '3', name: 'Waterstone', src: '/logo.png' },
  { id: '4', name: 'Waterstone', src: '/logo.png' },
  { id: '5', name: 'Waterstone', src: '/logo.png' },
  { id: '6', name: 'Waterstone', src: '/logo.png' },
  { id: '7', name: 'Waterstone', src: '/logo.png' },
  { id: '8', name: 'Waterstone', src: '/logo.png' },
];

export default function LogoCarousel() {
  // Duplicamos los logos para crear el efecto infinito
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="w-full bg-gray-50 py-11 md:py-4 overflow-hidden">
      <div className="relative">
        {/* Gradient overlays para efecto fade en los bordes */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        {/* Scroll container */}
        <div className="overflow-hidden">
          <div className="flex logo-scroll-animation">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 mx-4 md:mx-8 flex items-center justify-center"
                style={{ width: '200px' }}
              >
                <div className="relative w-full h-20 md:h-24">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    fill
                    className="object-contain"
                    sizes="200px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

