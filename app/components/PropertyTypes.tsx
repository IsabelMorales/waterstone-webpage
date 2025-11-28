interface PropertyType {
  id: string;
  title: string;
  description: string;
}

interface CommercialSubType {
  id: string;
  title: string;
  description: string;
}

const propertyTypes: PropertyType[] = [
  {
    id: 'multifamily',
    title: 'Multi family buildings',
    description:
      'Multi-story detached buildings, where each floor is a separate apartment or unit',
  },
  {
    id: 'condo-coop',
    title: 'Condo/coop',
    description:
      'Building or complex, similar to apartments, owned by individuals. Common grounds and common areas within the complex are owned and shared jointly.',
  },
  {
    id: 'mitchel-lama',
    title: 'Mitchel Lama buildings',
    description:
      'The Mitchell-Lama Housing Program is a non-subsidy governmental housing guarantee in the state of New York, established for development and building of affordable housing, both rental and co-operatively owned, for middle-income residents.',
  },
  {
    id: 'mixed-use',
    title: 'Mixed use',
    description:
      'A development, or even a single building, that blends a combination of residential, commercial, cultural, institutional, or industrial uses.',
  },
  {
    id: 'commercial',
    title: 'Commercial real estate',
    description:
      'Buildings or land intended to generate a profit, either from capital gain or rental income.',
  },
];

const commercialSubTypes: CommercialSubType[] = [
  {
    id: 'office',
    title: 'Office Buildings',
    description:
      'Single‐tenant properties, small professional office buildings, downtown skyscrapers, and everything in between.',
  },
  {
    id: 'industrial',
    title: 'Industrial',
    description:
      'Ranges from smaller properties ("Flex" or "R&D"), to larger office service or office warehouse properties to the very large "big box" industrial properties',
  },
  {
    id: 'retail',
    title: 'Retail/Restaurant',
    description:
      'Pad sites on highway frontages, single tenant retail buildings, small neighborhood shopping centers, larger centers with grocery store anchor tenants, large anchor stores or even regional and outlet malls.',
  },
  {
    id: 'multifamily-commercial',
    title: 'Multifamily',
    description:
      'Larger than a Fourplex Apartment complexes or high‐rise apartment buildings.',
  },
  {
    id: 'land',
    title: 'Land',
    description:
      'Investment properties on undeveloped, raw, rural land in the path of future development.',
  },
  {
    id: 'non-residential',
    title: 'Non Residential',
    description:
      'Properties such as hotel, hospitality, medical, and self‐storage developments',
  },
];

export default function PropertyTypes() {
  return (
    <section className="w-full bg-gray-50 py-14 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark mb-4">
            Property Types
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Following is a list of the 6 major types of properties we specialize
            in:
          </p>
        </div>

        {/* Main Property Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {propertyTypes.map((propertyType) => (
            <div
              key={propertyType.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 md:p-8 hover:border-brand-primary hover:shadow-lg transition-all duration-300 group"
            >
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold text-brand-dark mb-4 group-hover:text-brand-primary transition-colors duration-300">
                {propertyType.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {propertyType.description}
              </p>

              {/* Special section for Commercial types */}
              {propertyType.id === 'commercial' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm font-semibold text-brand-dark mb-4">
                    The following are types of COMMERCIAL properties that we
                    specialize in:
                  </p>
                  <ul className="space-y-3">
                    {commercialSubTypes.map((subType) => (
                      <li key={subType.id} className="flex items-start">
                        <span className="text-brand-primary mr-2 font-bold">
                          {commercialSubTypes.indexOf(subType) + 1}.
                        </span>
                        <div>
                          <span className="font-semibold text-brand-dark">
                            {subType.title}
                          </span>
                          <span className="text-gray-600"> – {subType.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

