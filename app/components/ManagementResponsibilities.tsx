import Image from 'next/image';

interface Responsibility {
  number: number;
  title: string;
  description: string;
}

const responsibilities: Responsibility[] = [
  {
    number: 1,
    title: 'Building maintenance and repairs management',
    description:
      'We have hands-on experience with the work often conducted by contractors and other skilled professionals, to ensure hiring and management of the right people and verify the quality of work.',
  },
  {
    number: 2,
    title: 'Property Inspection management',
    description:
      'We Independently identify and manage maintenance needs for the safety and satisfaction of the residents.',
  },
  {
    number: 3,
    title: 'Finance Management',
    description:
      'As property managers, we assume the responsibility for financial calculations and keeping tabs on cash flow. We employ contemporary accounting management software that allows us to keep track of rent collection amounts, and even collect rent virtually from residents.',
  },
  {
    number: 4,
    title: 'Customer Service management',
    description:
      'We are very personable and deal with residents on a regular basis. Working in property management is working in customer service. We form positive working relationships with contractors, skilled professionals, residents and our clients.',
  },
  {
    number: 5,
    title: 'Understanding the community',
    description:
      'The Big Apple is a very diverse urban phenomenon. A multitude of communities have developed local cultures in their urban lives which gives each neighborhood its unique characteristics, population and real estate opportunities. We are sensitive and responsive to a variety of standards stemming from different traditions and unique cultural habits. We understand and respect these traditions and we are committed to property management that is guided by preserving and maintaining the values which make each neighborhood so dear to its residents.',
  },
];

export default function ManagementResponsibilities() {
  return (
    <section className="w-full bg-white py-14 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark mb-4">
            Management Responsibilities
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            As Real estate property management we are skillful, methodical and
            possess robust expertise in the following main areas:
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {responsibilities.map((responsibility) => (
            <div
              key={responsibility.number}
              className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-brand-primary hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/hero.jpeg"
                  alt={`${responsibility.title} - Property Management Services`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Number Badge */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg group-hover:bg-brand-dark transition-colors duration-300">
                    {responsibility.number}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-semibold text-brand-dark mb-4 group-hover:text-brand-primary transition-colors duration-300">
                  {responsibility.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {responsibility.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

