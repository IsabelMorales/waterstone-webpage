"use client";

import Image from "next/image";
import AnimatedOnScroll from "./AnimatedOnScroll";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  size: "large-narrow" | "large-wide" | "small";
}

const features: Feature[] = [
  {
    id: "leasing",
    title: "Leasing",
    subtitle: "Strategic Growth",
    description:
      "Instead of waiting for results, we drive them through active coordination with premier local brokerage firms. This direct involvement allows us to accelerate the tenant acquisition process and focus on high-quality placements that stabilize and enhance your property’s long-term value.",
    image: "/leasing-2.jpg",
    size: "large-narrow", // Grande pero estrecha
  },
  {
    id: "reputable",
    title: "Reputable",
    subtitle: "Technical Excellence on Site",
    description:
      "Our reputation for thoroughness comes from a deep understanding of building systems. We oversee every project—from minor repairs to major renovations—with an auditor’s eye. We don’t just hire vendors; we personally verify the integrity of their work to ensure your investment is always protected.",
    image: "/repairman.jpg",
    size: "large-wide", // Grande pero ancha
  },
  {
    id: "reliable",
    title: "Reliable",
    subtitle: "Precision in Operations",
    description:
      "We audit existing frameworks to eliminate friction and implement modernized workflows. The result is a seamless, predictable environment for both boards and residents.",
    image: "/reliable.jpg",
    size: "small",
  },
  {
    id: "responsive",
    title: "Responsive",
    subtitle: "A People-First Approach",
    description:
      "By prioritizing accessible and professional communication, we resolve issues quickly. Our focus is on maintaining strong relationships that help the entire building community thrive.",
    image: "/customer-service.jpeg",
    size: "small",
  },
];

export default function CompanyFeatures() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="w-full pt-12" aria-labelledby="company-features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedOnScroll>
          <div className="text-center mb-12">
            <h2
              id="company-features-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-almost-white)] mb-4"
            >
              Why Choose Waterstone
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Four core principles that define our approach to property management
            </p>
          </div>
        </AnimatedOnScroll>

        {/* Bento Box Grid - Layout modificado: Leasing estrecha, Reputable ancha, dos pequeñas debajo */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2">
          {features.map((feature, index) => {
            const isHovered = hoveredId === feature.id;
            const isLargeNarrow = feature.size === "large-narrow";
            const isLargeWide = feature.size === "large-wide";
            const isSmall = feature.size === "small";

            // Posicionamiento explícito para cada tarjeta usando clases CSS
            let gridClass = "";
            let minHeight = "min-h-[17.5rem]";
            
            if (feature.id === "leasing") {
              gridClass = "feature-leasing";
              minHeight = "min-h-[17.5rem] md:min-h-[37.5rem]";
            } else if (feature.id === "reputable") {
              gridClass = "feature-reputable";
              minHeight = "min-h-[17.5rem] md:min-h-[19rem]";
            } else if (feature.id === "reliable") {
              gridClass = "feature-reliable";
              minHeight = "min-h-[17.5rem] md:min-h-[18rem]";
            } else if (feature.id === "responsive") {
              gridClass = "feature-responsive";
              minHeight = "min-h-[17.5rem] md:min-h-[18rem]";
            }

            return (
              <AnimatedOnScroll key={feature.id} className={gridClass}>
                <div
                  className={cn(
                    "group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300",
                    minHeight
                  )}
                  onMouseEnter={() => setHoveredId(feature.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${feature.title} - ${feature.subtitle}`}
                >
                  {/* Imagen de fondo */}
                  <div className="absolute inset-0">
                    <Image
                      src={feature.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes={
                        isLargeNarrow
                          ? "(max-width: 768px) 100vw, 33vw"
                          : isLargeWide
                          ? "(max-width: 768px) 100vw, 67vw"
                          : "(max-width: 768px) 100vw, 33vw"
                      }
                      priority={index < 2}
                    />
                  </div>

                  {/* Overlay oscuro */}
                  <div className="absolute inset-0 bg-[var(--color-almost-black)]/60 group-hover:bg-[var(--color-almost-black)]/75 transition-colors duration-300" />

                  {/* Contenido */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
                    {/* Título y subtítulo */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="mb-4">
                        <h3
                          className={cn(
                            "font-bold text-[var(--color-almost-white)] transition-all duration-300",
                            isSmall
                              ? isHovered
                                ? "text-2xl md:text-3xl"
                                : "text-3xl md:text-4xl"
                              : isHovered
                              ? "text-3xl md:text-4xl"
                              : "text-4xl md:text-5xl lg:text-6xl"
                          )}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className={cn(
                            "text-gray-300 font-semibold transition-all duration-300",
                            isSmall
                              ? isHovered
                                ? "text-base md:text-lg opacity-90"
                                : "text-lg md:text-xl"
                              : isHovered
                              ? "text-lg md:text-xl opacity-90"
                              : "text-xl md:text-2xl lg:text-3xl"
                          )}
                        >
                          {feature.subtitle}
                        </p>
                      </div>

                      {/* Descripción - aparece en hover */}
                      <div
                        className={cn(
                          "text-[var(--color-almost-white)] leading-relaxed transition-all duration-300 overflow-hidden",
                          isHovered
                            ? "opacity-100 max-h-96 translate-y-0"
                            : "opacity-0 max-h-0 translate-y-4"
                        )}
                      >
                        <p className={cn(
                          isSmall ? "text-base md:text-lg" : "text-lg md:text-xl"
                        )}>{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
