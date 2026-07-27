import Image from 'next/image';
import AnimatedOnScroll from '../../common/AnimatedOnScroll';

export default function ManagementOverview() {
  return (
    <section className="w-full py-12 md:py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedOnScroll>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-almost-white)] mb-6 leading-tight">
                Your Assets in Expert Hands, Every Single Day
              </h2>
              <div className="space-y-4 text-base md:text-lg text-gray-300 leading-relaxed">
                <p>
                  Keeping a property profitable requires constant attention,
                  operational precision, and rapid problem-solving. WS Management
                  was built to eliminate that burden for owners, pairing rigorous
                  oversight with proactive care.
                </p>
                <p>
                  We ensure your assets stay in peak condition, tenant relationships
                  remain strong, and administrative processes run on time. You retain
                  full visibility over your investment while we handle the heavy
                  lifting.
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-[42%] h-[16rem] md:h-[22rem] flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/leasing-2.jpg"
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
