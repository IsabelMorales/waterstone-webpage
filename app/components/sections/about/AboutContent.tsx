import Image from 'next/image';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';

export default function AboutContent() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Who we are + RAM credential */}
        <AnimatedOnScroll>
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 mb-8 md:mb-10">
            <p className="flex-1 text-lg md:text-xl text-gray-300 leading-relaxed text-left">
              WaterStone Group, LLC is a real estate and investment management firm
              dedicated to helping landlords protect and grow their assets across New
              York and Florida. We combine deep local market expertise with proactive
              management, giving property owners a reliable partner who cares for their
              buildings as if they were our own.
            </p>
            <div className="flex-shrink-0 self-center md:self-auto">
              <Image
                src="/ram.jpg"
                alt="RAM — Registered in Apartment Management, a NABO designation"
                width={160}
                height={200}
                className="h-36 w-auto md:h-44 rounded-xl object-contain"
              />
            </div>
          </div>
        </AnimatedOnScroll>

        {/* Promise quote */}
        <AnimatedOnScroll>
          <blockquote className="flex items-start gap-4 md:gap-5 mb-8 md:mb-10 max-w-5xl">
            <div
              className="w-1 h-14 md:h-16 flex-shrink-0 rounded-full mt-1"
              style={{ backgroundColor: 'var(--color-brand-accent)' }}
              aria-hidden
            />
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-[var(--color-almost-white)] leading-snug">
              Effective property management isn&apos;t just about handling daily
              operations—it&apos;s about protecting your long-term investment. We combine
              traditional real estate discipline with modern management solutions to
              deliver clarity, consistent cash flow, and complete peace of mind.
            </p>
          </blockquote>
        </AnimatedOnScroll>

        {/* Focus + How we work */}
        <AnimatedOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
            <div className="border border-gray-700 rounded-lg bg-gray-800/50 px-6 py-6 transition-colors hover:border-gray-600">
              <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-almost-white)] mb-4">
                What we focus on
              </h2>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                Our core expertise spans two of the nation&apos;s most active markets: New
                York and Florida. We manage a diverse portfolio of multifamily buildings,
                mixed-use properties, commercial holdings, and condominium associations
                across both regions. From daily building operations to strategic
                acquisitions, our focus remains firmly on protecting property value and
                supporting our owners&apos; long-term financial goals.
              </p>
            </div>
            <div className="border border-gray-700 rounded-lg bg-gray-800/50 px-6 py-6 transition-colors hover:border-gray-600">
              <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-almost-white)] mb-4">
                How we work
              </h2>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                We take a hands-on, modern approach to property operations. By pairing
                smart technology and transparent reporting with energy-efficient building
                practices, we craft tailored management plans for every property. The
                result is optimized cash flow, reduced operational friction, and
                well-maintained environments that keep reliable tenants happy and
                investments thriving.
              </p>
            </div>
          </div>
        </AnimatedOnScroll>

        {/* Closing line */}
        <AnimatedOnScroll>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto text-center">
            Every plan is built around one outcome: maximum benefit for the people who
            own and live in the buildings we manage.
          </p>
        </AnimatedOnScroll>
      </div>
    </section>
  );
}
