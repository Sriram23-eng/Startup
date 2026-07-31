import Link from "next/link";
import { workshops, type Workshop } from "@/lib/data";
import { formatINR } from "@/lib/site";
import { IconArrow, IconClock } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  Home-page workshops section. Scannable cards: mode + level badges,  */
/*  duration, blurb, outcome chips and a "from" price. Replaces the     */
/*  old catalogue media grid.                                           */
/* ------------------------------------------------------------------ */
const modeStyle: Record<Workshop["mode"], string> = {
  Online: "bg-cyan-accent/12 text-[#0b7c8c] ring-cyan-accent/30",
  Offline: "bg-brand-50 text-brand-700 ring-brand-100",
  Field: "bg-brand-50 text-brand-700 ring-brand-100",
  Corporate: "bg-navy-900/[0.06] text-ink-700 ring-navy-900/10",
  Internship: "bg-navy-900/[0.06] text-ink-700 ring-navy-900/10",
};

export default function Workshops() {
  if (!workshops.length) return null;

  return (
    <section className="border-y border-line bg-white py-16 lg:py-20">
      <div className="container-x">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              Workshops &amp; bootcamps
            </div>
            <h2 className="text-[1.8rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-3xl lg:text-4xl">
              Learn by doing, with real hardware
            </h2>
          </div>
          <Link
            href="/workshops"
            className="text-sm font-bold text-brand-600 hover:underline"
          >
            All workshops →
          </Link>
        </div>

        <div className="reveal-late mt-8 grid gap-4 sm:grid-cols-2">
          {workshops.map((w) => (
            <Link
              key={w.slug}
              href="/workshops"
              className="group flex flex-col rounded-3xl border border-line bg-white p-6 shadow-card lift hover:border-brand-200 hover:shadow-lift"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${modeStyle[w.mode]}`}
                >
                  {w.mode}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  {w.level}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-black tracking-tight text-ink-900">
                {w.title}
              </h3>
              <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500">
                <IconClock className="h-4 w-4" strokeWidth={2} />
                {w.duration}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {w.blurb}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {w.outcomes.slice(0, 4).map((o) => (
                  <span
                    key={o}
                    className="rounded-lg bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-ink-600"
                  >
                    {o}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <div className="text-sm text-ink-400">
                  From{" "}
                  <span className="font-black text-ink-900">
                    {formatINR(w.priceFrom)}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600">
                  View
                  <IconArrow
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
