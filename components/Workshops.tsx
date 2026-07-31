import Link from "next/link";
import { workshops, type Workshop } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  Home-page workshops teaser. A clean, hairline-divided list (no card  */
/*  boxes, no prices) — just the workshop matter, linking through to     */
/*  the full /workshops page.                                            */
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

        <ol className="reveal-late mt-8 grid gap-4 sm:grid-cols-2">
          {workshops.map((w, i) => (
            <li key={w.slug}>
              <Link
                href="/workshops"
                className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:border-brand-200 hover:shadow-lift"
              >
                <span className="absolute right-5 top-5 text-4xl font-black leading-none text-ink-900/[0.06]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${modeStyle[w.mode]}`}
                  >
                    {w.mode}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                    {w.level} · {w.duration}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-black tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {w.blurb}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
