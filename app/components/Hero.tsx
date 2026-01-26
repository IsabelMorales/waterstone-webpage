import Image from "next/image";import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero.webp"
          alt="Property Management Hero"
          fill
          priority
          className="object-cover"
          quality={90}
        />
      </div>

      {/* Dark Overlay with Brand Color */}
      <div className="absolute inset-0 bg-[var(--color-almost-black)]/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--color-almost-white)] mb-6 leading-tight">
             Real Estate <br/> Realized Opportunities
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-almost-white)]/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              In one of the toughest real estate markets in the world, the biggest 
              players are not necessarily the best ones; definitely not for everyone. 
              <br/> While there are some players in New York that are bigger than us, 
              we may still be the management company that is just the right size for <strong>YOU</strong>.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact-us"
                className="px-8 py-4 bg-brand-primary text-[var(--color-almost-white)] text-lg font-medium rounded-lg hover:bg-brand-dark transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
