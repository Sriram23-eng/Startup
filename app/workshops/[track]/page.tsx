import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui";
import PageHero from "@/components/PageHero";
import WorkshopForm from "@/components/WorkshopForm";
import WorkshopTrackNav from "@/components/WorkshopTrackNav";
import { IconArrow, IconCheck, IconUsers } from "@/components/icons";
import { getWorkshopTrack, workshops, workshopTracks } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  One page per delivery format — /workshops/online, /offline, /fdp,   */
/*  /corporate. These are the four destinations in the Workshops menu,  */
/*  which used to all point at the hub page. Content comes from the      */
/*  `workshopTracks` registry in lib/data.ts.                            */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return workshopTracks.map((t) => ({ track: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track } = await params;
  const t = getWorkshopTrack(track);
  if (!t) return { title: "Workshops" };

  return {
    title: t.label,
    description: t.subtitle,
    alternates: { canonical: `/workshops/${t.slug}` },
    openGraph: {
      title: `${t.label} — Elektron Nexus`,
      description: t.subtitle,
      type: "website",
    },
  };
}

export default async function WorkshopTrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  const t = getWorkshopTrack(track);
  if (!t) notFound();

  // Programs tagged for this format, and the rest — which we can still run
  // this way on request, so they're listed rather than hidden.
  const primary = workshops.filter((w) => w.tracks.includes(t.slug));
  const onRequest = workshops.filter((w) => !w.tracks.includes(t.slug));

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={
          <>
            {t.title} <span className="text-gradient-light">{t.accent}</span>
          </>
        }
        subtitle={t.subtitle}
        actions={
          <>
            <a
              href="#book"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_12px_28px_-12px_rgba(35,165,43,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Request a proposal
              <IconArrow className="h-4 w-4" strokeWidth={2} />
            </a>
            <Link
              href="/workshops"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-accent hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
            >
              All workshops
            </Link>
          </>
        }
        aside={
          <dl className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur sm:grid-cols-2">
            {t.facts.map((f) => (
              <div key={f.label} className="rounded-2xl bg-white/[0.05] px-4 py-3.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-brand-100/55">
                  {f.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold leading-snug text-white">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* Who it's for */}
      <section className="border-b border-line bg-white py-5">
        <div className="container-x flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 font-bold text-ink-900">
            <IconUsers className="h-4 w-4 text-brand-600" strokeWidth={2} />
            Built for
          </span>
          <span className="text-ink-600">{t.audience}</span>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-14">
          <div>
            {/* ---------------- Programs in this format ---------------- */}
            <div className="reveal">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                Programs
              </div>
              <h2 className="text-[1.9rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl">
                Run in this format
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-600">
                Every program is customisable to your cohort size, level and
                schedule.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {primary.map((w, i) => (
                <div
                  key={w.slug}
                  id={w.slug}
                  style={{ "--i": i } as CSSProperties}
                  className="seq group scroll-mt-24 rounded-3xl border border-line bg-white p-6 shadow-card lift hover:border-brand-200 hover:shadow-lift"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand">{w.mode}</Badge>
                    <Badge tone="soft">{w.level}</Badge>
                    <span className="text-xs font-medium text-ink-400">
                      {w.duration}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-black tracking-tight text-ink-900">
                    {w.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    {w.blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {w.outcomes.map((o) => (
                      <span
                        key={o}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50/70 px-2.5 py-1 text-xs font-medium text-ink-700"
                      >
                        <IconCheck
                          className="h-3.5 w-3.5 text-brand-600"
                          strokeWidth={2.4}
                        />
                        {o}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#book"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white"
                  >
                    Request this program
                    <IconArrow className="h-4 w-4" strokeWidth={2} />
                  </a>
                </div>
              ))}
            </div>

            {/* ---------------- Also available on request ---------------- */}
            {onRequest.length > 0 && (
              <div className="mt-8 rounded-3xl border border-dashed border-line-strong bg-[#f7f9fd] p-6">
                <h3 className="text-sm font-bold text-ink-900">
                  Also available in this format on request
                </h3>
                <p className="mt-1 text-sm text-ink-600">
                  These normally run another way, but we re-cut them for{" "}
                  {t.label.toLowerCase()} regularly — ask in the form.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {onRequest.map((w) => (
                    <li key={w.slug}>
                      <Link
                        href={`/workshops#${w.slug}`}
                        className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-700 ring-1 ring-line transition hover:text-brand-700 hover:ring-brand-200"
                      >
                        {w.title}
                        <IconArrow
                          className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-400"
                          strokeWidth={2}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ---------------- What's included ---------------- */}
            <div className="reveal-late mt-14">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                What’s included
              </div>
              <h2 className="text-[1.9rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl">
                In every {t.label.toLowerCase()} booking
              </h2>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {t.includes.map((item, i) => (
                  <li
                    key={item}
                    style={{ "--i": i % 2 } as CSSProperties}
                    className="seq flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-card"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                      <IconCheck className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-relaxed text-ink-600">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---------------- How it runs ---------------- */}
            <div className="reveal-late mt-14">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                How it runs
              </div>
              <h2 className="text-[1.9rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl">
                From first call to handover
              </h2>
              <ol className="mt-8 space-y-4">
                {t.steps.map((s, i) => (
                  <li
                    key={s.title}
                    style={{ "--i": i } as CSSProperties}
                    className="seq flex gap-5"
                  >
                    <div className="flex flex-col items-center">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-white text-sm font-black text-brand-600 shadow-card">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {i < t.steps.length - 1 && (
                        <span
                          aria-hidden
                          className="mt-1 w-px flex-1 bg-line-strong"
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="font-bold text-ink-900">{s.title}</h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-600">
                        {s.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ---------------- Booking form ---------------- */}
          <div id="book" className="scroll-mt-24 lg:sticky lg:top-20 lg:self-start">
            <WorkshopForm defaultMode={t.formMode} heading={`Book ${t.label.toLowerCase()}`} />
          </div>
        </div>
      </section>

      {/* ---------------- Other formats ---------------- */}
      <section className="border-t border-line bg-white py-16">
        <div className="container-x">
          <div className="reveal max-w-2xl">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              Other formats
            </div>
            <h2 className="text-[1.7rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-3xl">
              Need it delivered another way?
            </h2>
          </div>
          <WorkshopTrackNav active={t.slug} exclude className="mt-8" />
        </div>
      </section>
    </>
  );
}
