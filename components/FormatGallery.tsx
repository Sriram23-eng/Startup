import Link from "next/link";
import { workshopTracks } from "@/lib/data";
import { IconArrow } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  Format gallery — a pinned horizontal stage.                        */
/*                                                                      */
/*  The section holds while the four cards pan across, then releases to */
/*  the next section, so you see every format before moving on.         */
/*                                                                      */
/*  Desktop only. On phones — and anywhere without scroll timelines —    */
/*  it stays a native horizontal scroller with snap points, which is     */
/*  both better on touch and fully keyboard-operable. That fallback is   */
/*  the same construction Apple ships for its media-card galleries.      */
/* ------------------------------------------------------------------ */
export default function FormatGallery() {
  return (
    <section className="fmt-track relative border-t border-line bg-white md:h-[210vh]">
      <div className="relative flex flex-col justify-center overflow-clip py-16 md:sticky md:top-16 md:h-[calc(100svh-4rem)] md:py-0">
        {/* Heading left, secondary action right. */}
        <div className="container-x">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                Formats
              </div>
              <h2 className="text-[1.9rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl">
                Four ways to run it.
              </h2>
            </div>
            <Link
              href="/workshops"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline"
            >
              All workshops
              <IconArrow className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Viewport: a real scroller below md, a clipped stage above it. */}
        <div className="mt-9 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible md:pb-0">
          {/* Lead-in gutter matches `.container-x`, so the first card starts
              flush with the heading above it rather than at the screen edge;
              the row still runs full-bleed off the right. */}
          <div
            className="fmt-rail flex w-max gap-5"
            style={{
              paddingLeft:
                "max(clamp(1.1rem, 2.4vw, 2rem), calc((100vw - 1280px) / 2 + clamp(1.1rem, 2.4vw, 2rem)))",
              paddingRight: "clamp(1.1rem, 2.4vw, 2rem)",
            }}
          >
            {workshopTracks.map((t) => (
              <Link
                key={t.slug}
                href={`/workshops/${t.slug}`}
                className="group relative flex w-[86vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[1.75rem] bg-navy-900 p-7 text-white transition-shadow hover:shadow-lift sm:w-[62vw] sm:p-8 lg:w-[44vw] xl:w-[38vw] md:snap-align-none"
              >
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  <div className="mesh absolute inset-0 opacity-30" />
                  <div className="grid-lines absolute inset-0 opacity-[0.12]" />
                </div>

                <div className="relative">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-accent">
                    {t.label}
                  </div>
                  <p className="mt-4 text-xl font-black leading-[1.15] tracking-[-0.02em] text-balance sm:text-2xl lg:text-3xl">
                    {t.title}{" "}
                    <span className="text-gradient-light">{t.accent}</span>
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-brand-100/70">
                    {t.navDesc} · {t.audience}
                  </p>
                </div>

                <dl className="relative mt-8 grid gap-2.5">
                  {t.facts.slice(0, 2).map((f) => (
                    <div
                      key={f.label}
                      className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur"
                    >
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-brand-100/50">
                        {f.label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-semibold leading-snug">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <span className="relative mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-accent">
                  Explore this format
                  <IconArrow
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Orientation: how far through the pinned stage you are. */}
        <div className="container-x mt-8 hidden md:block">
          <div aria-hidden className="relative h-px w-full bg-line-strong">
            <span className="fmt-progress absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-brand-500" />
          </div>
        </div>
        <div className="container-x mt-4 md:hidden">
          <p className="text-xs text-ink-400">Scroll for more formats →</p>
        </div>
      </div>
    </section>
  );
}
