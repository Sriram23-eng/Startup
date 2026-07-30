import type { Metadata } from "next";
import { workshops } from "@/lib/data";
import { Badge, SectionHeading } from "@/components/ui";
import { IconArrow, IconCheck } from "@/components/icons";
import WorkshopForm from "@/components/WorkshopForm";

export const metadata: Metadata = {
  title: "Workshops, Training & FDP",
  description:
    "Book online, offline and field workshops, bootcamps, internships, FDPs and corporate training in IoT, AI/ML, embedded and robotics.",
};

const flow = ["Request", "Discussion", "Proposal", "Approval", "Execution"];

export default function WorkshopsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-drift absolute -left-24 -top-28 h-[26rem] w-[26rem] rounded-full bg-brand-400/22 blur-[130px]" />
          <div className="animate-drift absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-accent/18 blur-[130px] [animation-delay:-7s]" />
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_10%,black,transparent)]" />
        </div>
        <div className="container-x relative py-16">
          <div className="animate-rise">
            <Badge tone="cyan">Workshops &amp; Training</Badge>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.06] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
              Hands-on programs for{" "}
              <span className="text-gradient">students, faculty &amp; teams</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-600">
              Bootcamps, internships, FDPs and corporate training — delivered
              online, at your campus, or in the field.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {flow.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="rounded-full border border-line-strong bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-ink-700 backdrop-blur">
                    {s}
                  </span>
                  {i < flow.length - 1 && (
                    <span className="text-brand-400">→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_440px]">
          {/* Programs list */}
          <div>
            <SectionHeading
              eyebrow="Programs"
              title="Choose a program"
              subtitle="Every program is customisable to your cohort size, level and schedule."
            />
            <div className="mt-8 space-y-5">
              {workshops.map((w) => (
                <div
                  key={w.slug}
                  id={w.slug}
                  className="group grid gap-5 rounded-3xl border border-line bg-white p-6 shadow-card lift hover:border-brand-200 hover:shadow-lift sm:grid-cols-[1fr_auto]"
                >
                  <div>
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
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{w.blurb}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {w.outcomes.map((o) => (
                        <span
                          key={o}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50/70 px-2.5 py-1 text-xs font-medium text-ink-700"
                        >
                          <IconCheck className="h-3.5 w-3.5 text-brand-600" strokeWidth={2.4} />
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-between sm:items-end">
                    <div className="sm:text-right">
                      <div className="text-xs font-medium text-ink-400">From</div>
                      <div className="text-xl font-black tracking-tight text-ink-900">
                        ₹{w.priceFrom.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <a
                      href="#book"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white"
                    >
                      Book
                      <IconArrow className="h-4 w-4" strokeWidth={2} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking form */}
          <div id="book" className="lg:sticky lg:top-20 lg:self-start">
            <WorkshopForm />
          </div>
        </div>
      </section>
    </>
  );
}
