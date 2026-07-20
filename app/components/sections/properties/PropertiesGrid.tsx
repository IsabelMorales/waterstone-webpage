import Image from 'next/image';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';

interface Property {
  id: string;
  name: string;
  image: string;
}

const properties: Property[] = [
  {
    id: 'properties-01',
    name: '103 - 119 North 3rd Street Williamsburg',
    image: '/properties01.jpg',
  },
  {
    id: 'properties-02',
    name: '3360 Shore Pkwy Sheepshead Bay NY',
    image: '/properties02.jpg',
  },
  {
    id: 'properties-03',
    name: '176 Lefferts Place Bedford Stuyvesant',
    image: '/properties03.jpg',
  },
  {
    id: 'properties-04',
    name: '2020 Eastchester Rd. Bronx NY',
    image: '/properties04.jpg',
  },
  {
    id: 'properties-05',
    name: '115-49 Inwood Street Queens NY',
    image: '/properties05.jpg',
  },
  {
    id: 'properties-06',
    name: '116-30 Springfield Blvd.',
    image: '/properties06.jpg',
  },
  {
    id: 'properties-07',
    name: '738 Ocean View Ave, Brooklyn, NY 11235',
    image: '/properties07.jpg',
  },
  {
    id: 'properties-08',
    name: '255 - 259 Martenese St Brooklyn, NY',
    image: '/properties08.jpg',
  },
  {
    id: 'properties-09',
    name: '522 152nd St NY NY',
    image: '/properties09.jpg',
  },
];

export default function PropertiesGrid() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-4xl mb-10 md:mb-14">
            We manage real estate properties throughout New York City boroughs
            and some in Florida. Many of these properties are bound to certain
            restrictions which prevent us from displaying them. We handle each
            and every client with utmost sensitivity and efficient management in
            order to protect their interest and remain fully compliant with all
            applicable regulations. The lists we are allowed to present is a
            sample — representing the diversity of property types we can handle,
            and the dynamic scope of situations we can deal with.
          </p>
        </AnimatedOnScroll>

        <AnimatedOnScroll>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 list-none">
            {properties.map((property, index) => (
              <li key={property.id}>
                <article aria-labelledby={`property-name-${property.id}`}>
                  <div className="group relative w-full h-[14rem] sm:h-[16rem] md:h-[18rem] overflow-hidden">
                    <Image
                      src={property.image}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                    />
                  </div>
                  <div className="mt-3 flex items-start gap-3">
                    <div
                      className="w-0.5 h-10 flex-shrink-0 rounded-full mt-1"
                      style={{ backgroundColor: 'var(--color-brand-accent)' }}
                      aria-hidden
                    />
                    <h2
                      id={`property-name-${property.id}`}
                      className="text-lg md:text-xl font-semibold text-[var(--color-almost-white)] leading-snug"
                    >
                      {property.name}
                    </h2>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </AnimatedOnScroll>
      </div>
    </section>
  );
}
