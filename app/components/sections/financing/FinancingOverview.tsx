import Image from 'next/image';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';

export default function FinancingOverview() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-almost-white)] mb-6 leading-tight">
                Capital Strategies Aligned with Your Real Estate Goals
              </h2>
              <div className="space-y-4 text-base md:text-lg text-gray-300 leading-relaxed">
                <p>
                  Navigating real estate capital markets can feel overly complex,
                  rigid, and time-consuming. Misaligned loan terms or delayed
                  approvals can mean missed opportunities or squeezed margins.
                </p>
                <p>
                  We bridge that gap. By leveraging a broad network of trusted
                  lending partners, WS Financing negotiates and structures debt
                  strategies around your specific investment timeline, cash flow
                  requirements, and portfolio goals.
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-[42%] h-[16rem] md:h-[22rem] flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/accounting.jpg"
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
