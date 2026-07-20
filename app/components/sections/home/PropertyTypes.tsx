"use client";

import Image from "next/image";
import AnimatedOnScroll from "../../common/AnimatedOnScroll";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyType {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface CommercialSubType {
  id: string;
  title: string;
  description: string;
}

const propertyTypes: PropertyType[] = [
  {
    id: "multifamily",
    title: "Multi family buildings",
    description:
      "Multi-story residential buildings, including detached structures, in which each floor may contain one or more separate dwelling units.",
    image: "/image5.jpg",
  },
  {
    id: "condo-coop",
    title: "Condo/coop",
    description:
      "Building or complex, similar to apartments, owned by individuals. Common grounds and common areas within the complex are owned and shared jointly.",
    image: "/building-1.jpg",
  },
  {
    id: "mitchel-lama",
    title: "Mitchell-Lama buildings",
    description:
      "The Mitchell-Lama Housing Program is a non-subsidy governmental housing guarantee in the state of New York, established for development and building of affordable housing, both rental and co-operatively owned, for middle-income residents.",
    image: "/manhattan-1.jpg",
  },
  {
    id: "mixed-use",
    title: "Mixed use",
    description:
      "A development, or even a single building, that blends a combination of residential, commercial, cultural, institutional, or industrial uses.",
    image: "/building-4.jpg",
  },
  {
    id: "commercial",
    title: "Commercial real estate",
    description:
      "Buildings or land intended to generate a profit, either from capital gain or rental income.",
    image: "/image7.jpg",
  },
];

const commercialSubTypes: CommercialSubType[] = [
  {
    id: "office",
    title: "Office Buildings",
    description:
      "Single‐tenant properties, small professional office buildings, downtown skyscrapers, and everything in between.",
  },
  {
    id: "industrial",
    title: "Industrial",
    description:
      'Ranges from smaller properties ("Flex" or "R&D"), to larger office service or office warehouse properties to the very large "big box" industrial properties',
  },
  {
    id: "retail",
    title: "Retail/Restaurant",
    description:
      "Pad sites on highway frontages, single tenant retail buildings, small neighborhood shopping centers, larger centers with grocery store anchor tenants, large anchor stores or even regional and outlet malls.",
  },
  {
    id: "multifamily-commercial",
    title: "Multifamily",
    description:
      "Larger than a Fourplex Apartment complexes or high‐rise apartment buildings.",
  },
  {
    id: "land",
    title: "Land",
    description:
      "Investment properties on undeveloped, raw, rural land in the path of future development.",
  },
  {
    id: "non-residential",
    title: "Non Residential",
    description:
      "Properties such as hotel, hospitality, medical, and self‐storage developments",
  },
];

function CommercialPills({
  subTypes,
  selectedId,
  onSelect,
}: {
  subTypes: CommercialSubType[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-600">
      <p className="text-base font-semibold text-[var(--color-almost-white)] mb-4">
        Types of commercial properties we specialize in:
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {subTypes.map((subType) => (
          <button
            key={subType.id}
            type="button"
            onClick={() => onSelect(subType.id)}
            className={cn(
              "px-4 py-2 rounded-full text-base font-medium transition-colors border-none focus:outline-none focus:ring-0",
              selectedId === subType.id
                ? "bg-brand-primary text-[var(--color-almost-white)]"
                : "bg-gray-700/80 text-gray-300 hover:bg-gray-600/80"
            )}
            aria-pressed={selectedId === subType.id}
            aria-label={`Show ${subType.title} description`}
          >
            {subType.title}
          </button>
        ))}
      </div>
      <div
        className="text-lg text-gray-300 leading-relaxed min-h-[3.5rem]"
        role="region"
        aria-live="polite"
      >
        {subTypes.find((s) => s.id === selectedId)?.description}
      </div>
    </div>
  );
}

export default function PropertyTypes() {
  const [selectedCommercialId, setSelectedCommercialId] = useState(
    commercialSubTypes[0].id
  );

  return (
    <section className="w-full py-12" aria-labelledby="property-types-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <h2
              id="property-types-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-almost-white)] mb-4"
            >
              Types of properties that we manage
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Following is a list of the 6 major types of properties we specialize
              in
            </p>
          </div>
        </AnimatedOnScroll>

        {/* Property types: una fila por tipo, imagen izquierda, texto derecha */}
        <div className="space-y-16">
          {propertyTypes.map((propertyType, index) => {
            const imageFirst = index % 2 === 0;
            return (
            <AnimatedOnScroll key={propertyType.id}>
              <article
                className={`flex flex-col md:flex-row gap-6 md:gap-8 items-start ${!imageFirst ? "md:flex-row-reverse" : ""}`}
                aria-labelledby={`property-type-${propertyType.id}`}
              >
                {/* Imagen - tamaño fijo en todas las filas */}
                <div className="group relative w-full md:w-[55%] h-[16.25rem] md:h-[22.5rem] overflow-hidden rounded-lg flex-shrink-0">
                  <Image
                    src={propertyType.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 55vw"
                    priority={index === 0}
                  />
                </div>

                {/* Línea divisoria + Contenido */}
                <div className={`flex-1 min-w-0 flex flex-col md:flex-row md:items-start w-full md:pl-2 ${!imageFirst ? "md:flex-row-reverse" : ""}`}>
                  {/* Línea vertical decorativa */}
                  <div
                    className="hidden md:block w-0.5 h-14 flex-shrink-0 rounded-full mt-1"
                    style={{ backgroundColor: "var(--color-brand-accent)" }}
                    aria-hidden
                  />
                  <div className={`flex-1 min-w-0 flex flex-col pr-8 ${imageFirst ? "md:pl-3 md:pr-14" : "md:pl-14 md:pr-3 md:text-right md:items-end"}`}>
                  <h3
                    id={`property-type-${propertyType.id}`}
                    className="text-2xl md:text-3xl font-semibold text-[var(--color-almost-white)] mb-2"
                  >
                    {propertyType.title}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    {propertyType.description}
                  </p>

                  {propertyType.id === "commercial" && (
                    <CommercialPills
                      subTypes={commercialSubTypes}
                      selectedId={selectedCommercialId}
                      onSelect={setSelectedCommercialId}
                    />
                  )}
                  </div>
                </div>
              </article>
            </AnimatedOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
