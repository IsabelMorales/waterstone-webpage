import Image from 'next/image';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';

export default function StaffingOverview() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-almost-white)] mb-6 leading-tight">
                Staffing Built Around How Your Property Actually Runs
              </h2>
              <div className="space-y-4 text-base md:text-lg text-gray-300 leading-relaxed">
                <p>
                  Every building has its own rhythm, standards, and specific challenges.
                  Off-the-shelf placement services often send personnel who look good on
                  paper but struggle with real-world building dynamics.
                </p>
                <p>
                  WS Staffing takes a targeted approach. We take the time to understand
                  your day-to-day operations, bringing you qualified individuals who are
                  not only technically capable, but also a seamless fit for your
                  environment from day one.
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-[42%] h-[16rem] md:h-[22rem] flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/buildman.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </div>
          </div>
        </AnimatedOnScroll>
      </div>
    </section>
  );
}
