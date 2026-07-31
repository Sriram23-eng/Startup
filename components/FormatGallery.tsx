import Link from "next/link";
import type { CSSProperties } from "react";
import { workshopTracks } from "@/lib/data";
import { IconArrow } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  Format gallery (after Apple's "Get the highlights" media-card row). */
/*                                                                      */
/*  A real horizontal scroller with snap points — not vertical scroll   */
/*  hijacking. Apple builds theirs the same way (`scroll-snap-type: x   */
/*  mandatory` on an overflow container) precisely because it stays      */
/*  keyboard-, trackpad- and touch-native, and never fights the page     */
/*  scroll. The next card is deliberately left peeking at the edge —     */
/*  that overhang is the entire affordance telling you it scrolls.       */
/* ------------------------------------------------------------------ */
export default function FormatGallery() {
  return (
    <section className="border-t border-line bg-white py-16 lg:py-20">
      <div className="container-x">
        {/* Heading left, secondary action right — Apple's gallery header. */}
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              Formats
            </div>
            <h2 className="reveal-focus text-[1.9rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl">
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

      {/* Full-bleed rail so cards can run to the screen edge, with the
          container's inset recreated as scroll padding to keep snapping
          aligned with the rest of the page grid. */}
      <div
        role="region"
        aria-label="Workshop delivery formats"
        tabIndex={0}
        /* `overflow-y-hidden` is load-bearing: setting only `overflow-x`
           makes CSS compute the other axis to `auto` as well, so the row
           becomes a *vertical* scroll container that swallows wheel events.
           `overscroll-x-contain` stops the scroll chaining to the page when
           the row reaches its end, and `proximity` beats `mandatory` here —
           mandatory forces a re-snap every time scrolling settles, which
           fights the page and yanks you into the next section. */
        className="mt-9 flex snap-x snap-proximity gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        style={
          {
            scrollPaddingInline: "clamp(1.1rem, 2.4vw, 2rem)",
            paddingInline: "clamp(1.1rem, 2.4vw, 2rem)",
          } as CSSProperties
        }
      >
        {workshopTracks.map((t) => (
          <Link
            key={t.slug}
            href={`/workshops/${t.slug}`}
            className="group relative flex shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[1.75rem] bg-navy-900 p-7 text-white transition-shadow hover:shadow-lift sm:p-8 basis-[86%] sm:basis-[62%] lg:basis-[40%] xl:basis-[32%]"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="mesh absolute inset-0 opacity-30" />
              <div className="grid-lines absolute inset-0 opacity-[0.12]" />
            </div>

            <div className="relative">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-accent">
                {t.label}
              </div>
              {/* The big caption — Apple sets these large and lets them
                  carry the card on their own. */}
              <p className="mt-4 text-xl font-black leading-[1.15] tracking-[-0.02em] text-balance sm:text-2xl">
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

      <div className="container-x">
        <p className="text-xs text-ink-400">Scroll for more formats →</p>
      </div>
    </section>
  );
}
