"use client";

import { useState } from "react";
import AnimatedOnScroll from "./AnimatedOnScroll";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Doe",
    location: "Brooklyn, NY",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    location: "Manhattan, NY",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael Johnson",
    location: "Queens, NY",
    text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.",
    rating: 5,
  },
  {
    id: 4,
    name: "Sarah Williams",
    location: "The Bronx, NY",
    text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    rating: 5,
  },
];

export default function TenantsTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // En móvil: 1 testimonio por slide, en desktop: 2 testimonios por slide
  // Usaremos 2 por defecto para desktop
  const testimonialsPerSlide = 2;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="w-full py-16 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-almost-white)] mb-4">
              Tenants Testimonials
            </h2>
          </div>
        </AnimatedOnScroll>

        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel Wrapper */}
          <div className="relative overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 px-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-2 items-stretch">
                    {testimonials
                      .slice(
                        slideIndex * testimonialsPerSlide,
                        slideIndex * testimonialsPerSlide + testimonialsPerSlide
                      )
                      .map((testimonial) => (
                        <AnimatedOnScroll
                          key={testimonial.id}
                        >
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-7 max-w-md mx-auto w-full h-full flex flex-col">
                            {/* Rating Stars */}
                            <div className="flex justify-center mb-5">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-5 h-5 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-base md:text-lg text-gray-700 text-center mb-6 leading-relaxed flex-grow">
                              &ldquo;{testimonial.text}&rdquo;
                            </blockquote>

                            {/* Author Info */}
                            <div className="text-center mt-auto">
                              <p className="text-base font-semibold text-brand-dark">
                                {testimonial.name}
                              </p>
                              <p className="text-xs md:text-sm text-gray-600 mt-1">
                                {testimonial.location}
                              </p>
                            </div>
                          </div>
                        </AnimatedOnScroll>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 text-[var(--color-almost-white)] hover:text-brand-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-8 h-8 md:w-10 md:h-10"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 text-[var(--color-almost-white)] hover:text-brand-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            aria-label="Next testimonial"
          >
            <svg
              className="w-8 h-8 md:w-10 md:h-10"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                  index === currentIndex
                    ? "bg-brand-primary w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
