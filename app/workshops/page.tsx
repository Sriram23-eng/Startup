import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { workshops } from "@/lib/data";
import { Badge, SectionHeading } from "@/components/ui";
import PageHero from "@/components/PageHero";
import { IconArrow, IconCheck } from "@/components/icons";
import WorkshopForm from "@/components/WorkshopForm";
import WorkshopTrackNav from "@/components/WorkshopTrackNav";

export const metadata: Metadata = {
  title: "Workshops, Training & FDP",
  description:
    "Book online, offline and field workshops, bootcamps, internships, FDPs and corporate training in IoT, AI/ML, embedded and robotics.",
};

const flow = ["Request", "Discussion", "Proposal", "Approval", "Execution"];

export default function WorkshopsPage() {
  return (
    <>
      <PageHero
        pinned
        payoff={
          <>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] lg:text-6xl">
              Your campus.
              <br />
              Your team.
              <br />
              <span className="text-gradient-light">Your schedule.</span>
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-brand-100/70">
              We bring the lab, the hardware and the engineers to you.
            </p>
          </>
        }
        eyebrow="Workshops & Training"
        title={
          <>
            Hands-on programs for{" "}
            <span className="text-gradient-light">students, faculty &amp; teams</span>
          </>
        }
        subtitle="Bootcamps, internships, FDPs and corporate training, delivered online, at your campus, or in the field."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {flow.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-brand-100/90 backdrop-blur">
                  {s}
                </span>
                {i < flow.length - 1 && (
                  <span className="text-cyan-accent">→</span>
                )}
              </span>
            ))}
          </div>
        }
      />

      {/* Delivery formats — each links to its own page. */}
      <section className="border-b border-line bg-white py-14">
        <div className="container-x">
          <SectionHeading
            eyebrow="Delivery formats"
            title="Pick how you want it delivered"
            subtitle="The same programs, run four different ways. Each format has its own page with what's included and how a booking runs."
          />
          <WorkshopTrackNav className="mt-9" />
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
              {workshops.map((w, i) => (
                <div
                  key={w.slug}
                  id={w.slug}
                  style={{ "--i": i } as CSSProperties}
                  className="seq group grid gap-5 rounded-3xl border border-line bg-white p-6 shadow-card lift hover:border-brand-200 hover:shadow-lift sm:grid-cols-[1fr_auto]"
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
