import Image from 'next/image';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';

export default function ConsultingOverview() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-almost-white)] mb-6 leading-tight">
                Advice Built on Real Operational Experience
              </h2>
              <div className="space-y-4 text-base md:text-lg text-gray-300 leading-relaxed">
                <p>
                  Realizing the full potential of your property portfolio requires more
                  than theoretical advice. WS Consulting provides owners and investors
                  with practical, hands-on strategies to optimize asset performance,
                  navigate changing market conditions, and build long-term value.
                </p>
                <p>
                  Every real estate asset comes with its own set of operational
                  realities, market variables, and financial hurdles. Off-the-shelf
                  strategies rarely account for what actually happens on the ground.
                </p>
                <p>
                  At WS Consulting, our recommendations are backed by years of active
                  industry management, deal structuring, and portfolio oversight. We
                  work alongside you to analyze your current position, spot hidden
                  inefficiencies, and lay out straightforward, execution-focused plans
                  that drive real returns.
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-[42%] h-[16rem] md:h-[22rem] flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/accounting-1.jpg"
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
