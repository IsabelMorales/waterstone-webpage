import Image from 'next/image';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';

export default function BrokerageOverview() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-almost-white)] mb-6 leading-tight">
                Navigating Deals with Clarity and Purpose
              </h2>
              <div className="space-y-4 text-base md:text-lg text-gray-300 leading-relaxed">
                <p>
                  A successful real estate transaction is never just about signing a
                  contract—it requires an accurate reading of market trends, realistic
                  valuation, and patient negotiation.
                </p>
                <p>
                  WS Brokerage acts as your dedicated partner through every stage of the
                  transaction. We evaluate every opportunity through the lens of your
                  long-term goals, cutting through market noise to protect your position,
                  maximize financial return, and keep closing timelines on track.
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-[42%] h-[16rem] md:h-[22rem] flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/leasing-1.jpg"
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
