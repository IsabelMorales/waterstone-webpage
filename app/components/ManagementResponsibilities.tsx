import Image from 'next/image';
import AnimatedOnScroll from './AnimatedOnScroll';

interface Responsibility {
  number: number;
  title: string;
  description: string;
  image: string;
}

const responsibilities: Responsibility[] = [
  {
    number: 1,
    title: 'Building management',
    description:
      'At Waterstone, we bridge the gap between building needs and expert execution. We design tailored maintenance strategies and provide on-site supervision for all repairs and inspections. Our hands-on experience allows us to select the right professionals and verify their work, ensuring your property remains safe, compliant, and impeccably maintained.',
    image: '/buildman.jpg',
  },
  {
    number: 2,
    title: 'Finance Management',
    description:
      'As property managers, we assume the responsibility for financial calculations and keeping tabs on cash flow. We employ contemporary accounting management software that allows us to keep track of rent collection amounts, and even collect rent virtually from residents.',
    image: '/accounting-1.jpg',
  },
  {
    number: 3,
    title: 'Customer Service management',
    description:
      'We are very personable and deal with residents on a regular basis. Working in property management is working in customer service. We form positive working relationships with contractors, skilled professionals, residents and our clients.',
    image: '/repair-1.jpg',
  },
  {
    number: 4,
    title: 'Understanding the community',
    description:
      'The Big Apple is a very diverse urban phenomenon. A multitude of communities have developed local cultures in their urban lives which gives each neighborhood its unique characteristics, population and real estate opportunities. We are sensitive and responsive to a variety of standards stemming from different traditions and unique cultural habits. We understand and respect these traditions and we are committed to property management that is guided by preserving and maintaining the values which make each neighborhood so dear to its residents.',
    image: '/community-1.jpg',
  },
];

export default function ManagementResponsibilities() {
  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-almost-white)] mb-4">
              Management Responsibilities
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              As Real estate property management we are skillful, methodical and
              possess robust expertise in the following main areas
            </p>
          </div>
        </AnimatedOnScroll>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {responsibilities.map((responsibility) => {
            return (
              <AnimatedOnScroll
                key={responsibility.number}
              >
                <div className="group">
                  {/* Image */}
                  <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-lg mb-4">
                    <Image
                      src={responsibility.image}
                      alt={`${responsibility.title} - Property Management Services`}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                        responsibility.number === 3 ? 'object-top' : 'object-center'
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-almost-white)] mb-3 transition-colors duration-300">
                    {responsibility.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed">
                    {responsibility.description}
                  </p>
                </div>
              </AnimatedOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

