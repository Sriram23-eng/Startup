import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Hero showreel as a pinned scroll stage (after the OPPO Find X       */
/*  product pages): the section is a tall "track", the stage inside it  */
/*  is sticky, so scrolling scrubs a choreography instead of pushing    */
/*  the hero off screen. Layers move at different rates to build depth  */
/*  — the lead headline lifts away, a giant ghost wordmark surfaces      */
/*  behind, the filmstrip grows and drifts, and the payoff line rises   */
/*  into the space the headline vacated.                                */
/*                                                                      */
/*  Every layer's *un-animated* state is the readable one, so phones,   */
/*  browsers without scroll timelines and reduce-motion users all get   */
/*  a plain, complete hero. See the `.hero-*` block in globals.css.      */
/* ------------------------------------------------------------------ */
export default function OrbitShowreel({ images }: { images: string[] }) {
  // Duplicate the strip so the marquee loops seamlessly.
  const strip = [...images, ...images];

  return (
    <section className="hero-track relative bg-navy-900 text-white md:h-[220vh]">
      {/* The stage. Pinned below the 4rem navbar and exactly as tall as what
          is left of the viewport, so nothing hides under the header. */}
      <div className="relative flex flex-col overflow-clip md:sticky md:top-16 md:h-[calc(100svh-4rem)]">
        {/* ---------------- Ambient ---------------- */}
        <div
          aria-hidden
          className="hero-ambient pointer-events-none absolute inset-0"
        >
          <div className="mesh absolute inset-0 opacity-25" />
          <div className="animate-drift absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-500/16 blur-[150px]" />
          <div className="grid-lines absolute inset-0 opacity-[0.1]" />
        </div>

        {/* ---------------- Ghost wordmark ----------------
            Surfaces behind the stage mid-scroll — the brand equivalent of
            the oversized product name OPPO reveals behind the phone.
            Anchored on the filmstrip's band (68%) rather than the stage
            centre, so it reads as depth behind the "product" instead of
            colliding with the headline. The outer element owns the
            positioning transform; the inner one owns the animated scale,
            so the two never overwrite each other. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[68%] hidden -translate-y-1/2 md:block"
        >
          <div className="hero-ghost grid place-items-center">
            {/* 9vw keeps all 14 characters inside the viewport — a wordmark
                clipped to "ELEKTRON N" reads as broken, not as bleed. */}
            <span className="whitespace-nowrap text-[9vw] font-black leading-none tracking-[-0.045em] text-white/[0.07]">
              ELEKTRON NEXUS
            </span>
          </div>
        </div>

        {/* ---------------- Top micro-labels ---------------- */}
        <div className="container-x relative flex items-center justify-between pt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-100/45">
          <span>Elektron Nexus</span>
          <span className="hidden sm:inline">Est. 2022 · Hyderabad</span>
          <span>Showreel / 01</span>
        </div>

        {/* ---------------- Centre stage ---------------- */}
        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-9 py-12 text-center">
          {/* Lead and payoff share one grid slot on desktop, so the payoff
              rises into the space the headline leaves. They stack normally
              on phones, where nothing animates. */}
          <div className="grid w-full justify-items-center gap-9 md:gap-0">
            <div className="hero-lead md:col-start-1 md:row-start-1">
              <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
                Build, learn
                <br />
                &amp; ship
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-brand-100/65 sm:text-base">
                Ready-made kits, custom engineering builds and hands-on
                training, for electronics and IoT, all in one place.
              </p>
            </div>

            <h2 className="hero-payoff text-4xl font-black uppercase tracking-tight sm:text-6xl md:col-start-1 md:row-start-1 md:self-center">
              <span className="text-brand-400">Real-world</span>
              <span className="text-white/90"> electronics</span>
            </h2>
          </div>

          {/* Scrolling filmstrip — the constant anchor the rest moves around. */}
          <div className="hero-strip marquee-hold relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
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
        </div>

        {/* ---------------- Bottom labels + progress rail ---------------- */}
        <div className="container-x relative pb-8">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-brand-100/45">
            <span>Projects · Academy · Lab</span>
            <span className="hidden sm:inline">IoT · Embedded · AI</span>
            <span className="hero-cue">Scroll ↓</span>
          </div>
          {/* Orientation cue: a pinned stage stops responding to scroll the
              usual way, so show how far through it you are. */}
          <div aria-hidden className="relative mt-4 h-px w-full bg-white/10">
            <span className="hero-rail absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-brand-400/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
