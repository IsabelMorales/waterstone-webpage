import Link from 'next/link';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';

export default function StaffingCta() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark border-t border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-almost-white)] mb-4 leading-tight">
            Build a Stronger On-Site Team Today
          </h2>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-8">
            Tell us about your property&apos;s workforce needs, and we&apos;ll match you
            with skilled professionals ready to make an immediate impact.
          </p>
          <Link
            href="/contact-us"
            className="inline-block px-8 py-3.5 bg-brand-primary text-[var(--color-almost-white)] text-base md:text-lg font-medium rounded-lg hover:bg-brand-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
          >
            Request Staffing Solutions
          </Link>
        </AnimatedOnScroll>
      </div>
    </section>
  );
}
