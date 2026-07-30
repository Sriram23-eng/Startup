import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Orbit-style showreel hero (after the Jitter "Orbit" motion         */
/*  template): micro corner labels, a big uppercase headline, a        */
/*  horizontal filmstrip of photos that scrolls, and a large index     */
/*  sub-label. Editorial, minimal, on the brand charcoal + green.      */
/* ------------------------------------------------------------------ */
export default function OrbitShowreel({ images }: { images: string[] }) {
  // Duplicate the strip so the marquee loops seamlessly.
  const strip = [...images, ...images];

  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="mesh absolute inset-0 opacity-25" />
        <div className="animate-drift absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-500/16 blur-[150px]" />
        <div className="grid-lines absolute inset-0 opacity-[0.1]" />
      </div>

      {/* Top micro-labels */}
      <div className="container-x relative flex items-center justify-between pt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-100/45">
        <span>Elektron Nexus</span>
        <span className="hidden sm:inline">Est. 2022 · Hyderabad</span>
        <span>Showreel / 01</span>
      </div>

      {/* Centre stage */}
      <div className="relative flex flex-col items-center py-12 text-center lg:py-16">
        <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
          Build, learn
          <br />
          &amp; ship
        </h1>

        {/* Scrolling filmstrip of photos */}
        <div className="marquee-hold relative mt-10 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
          <div className="flex w-max animate-marquee gap-3">
            {strip.map((src, i) => (
              <span
                key={i}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 sm:h-20 sm:w-20"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>
            ))}
          </div>
        </div>

        <h2 className="mt-10 text-4xl font-black uppercase tracking-tight sm:text-6xl">
          <span className="text-brand-400">E—01</span>
          <span className="text-white/90"> / Electronics</span>
        </h2>
      </div>

      {/* Bottom micro-labels */}
      <div className="container-x relative flex items-center justify-between pb-8 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-100/45">
        <span>Projects · Academy · Lab</span>
        <span className="hidden sm:inline">IoT · Embedded · AI</span>
        <span>Scroll ↓</span>
      </div>
    </section>
  );
}
