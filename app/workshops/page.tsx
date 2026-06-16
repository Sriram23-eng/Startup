import type { Metadata } from "next";
import { workshops } from "@/lib/data";
import { Badge, SectionHeading } from "@/components/ui";
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
      <section className="relative overflow-hidden border-b border-navy-700/8">
        <div className="mesh pointer-events-none absolute inset-0 opacity-70" />
        <div className="container-x relative py-14">
          <Badge tone="cyan">Workshops & Training</Badge>
          <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
            Hands-on programs for students, faculty & teams
          </h1>
          <p className="mt-3 max-w-2xl text-navy-700/70">
            Bootcamps, internships, FDPs and corporate training — delivered
            online, at your campus, or in the field.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {flow.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className="rounded-full bg-white/70 px-3 py-1.5 text-sm font-semibold text-navy-700/80 ring-1 ring-navy-700/8 backdrop-blur">
                  {s}
                </span>
                {i < flow.length - 1 && (
                  <span className="text-brand-400">→</span>
                )}
              </span>
            ))}
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
                  className="group grid gap-5 rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card transition hover:shadow-glow sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="brand">{w.mode}</Badge>
                      <Badge tone="soft">{w.level}</Badge>
                      <span className="text-xs text-navy-700/45">
                        {w.duration}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-navy-800">
                      {w.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-navy-700/65">{w.blurb}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {w.outcomes.map((o) => (
                        <span
                          key={o}
                          className="rounded-lg bg-brand-50/60 px-2.5 py-1 text-xs font-medium text-navy-700/70"
                        >
                          ✓ {o}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-between sm:items-end">
                    <div className="text-right">
                      <div className="text-xs text-navy-700/45">From</div>
                      <div className="text-xl font-black text-navy-800">
                        ₹{w.priceFrom.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <a
                      href="#book"
                      className="mt-3 rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white"
                    >
                      Book →
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
