import Image from 'next/image';

export default function ServicesHero() {
  return (
    <section className="relative w-full h-[100vh] min-h-[18rem] max-h-[28rem] overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero-4.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          quality={85}
        />
      </div>
      <div className="absolute inset-0 bg-[var(--color-almost-black)]/30" />
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--color-almost-white)] mb-4">
            Services
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-almost-white)]/90 max-w-2xl mx-auto">
            Our services cover all property management aspects
          </p>
        </div>
      </div>
    </section>
  );
}
