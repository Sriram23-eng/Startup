import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui";
import RevealOnView from "@/components/RevealOnView";
import {
  IconArrow,
  IconAward,
  IconBox,
  IconCap,
  IconCode,
  IconShield,
  IconTarget,
  IconTruck,
  IconUsers,
} from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  The "about" story sections (pillars, mission & values, why teams   */
/*  pick us). Shared by /about and the home page.                      */
/* ------------------------------------------------------------------ */
type Glyph = (p: { className?: string; strokeWidth?: number }) => ReactNode;

const pillars: {
  Icon: Glyph;
  label: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
}[] = [
  {
    Icon: IconBox,
    label: "Marketplace",
    title: "Ready-made project kits",
    desc: "Documented, bench-tested builds across IoT, embedded, LoRa, AI and robotics, shipped with source code and circuit diagrams.",
    href: "/projects",
    cta: "Browse kits",
  },
  {
    Icon: IconCap,
    label: "Academy",
    title: "Training that sticks",
    desc: "Live cohorts, campus bootcamps, faculty development programs and internships, taught by engineers who ship, not by slide decks.",
    href: "/courses",
    cta: "See programs",
  },
  {
    Icon: IconCode,
    label: "Project Lab",
    title: "Custom engineering",
    desc: "Requirements to deployment: hardware design, firmware, dashboards and field rollout, with full IP and documentation handed over.",
    href: "/custom-project",
    cta: "Start a project",
  },
];

/* The strongest six reasons, curated from what were two overlapping lists
   (mission "values" + "why teams pick us"). */
const reasons: { Icon: Glyph; title: string; desc: string }[] = [
  {
    Icon: IconShield,
    title: "Engineers, not resellers",
    desc: "The person who answers your question is the one who wrote the firmware.",
  },
  {
    Icon: IconTarget,
    title: "Build real things",
    desc: "Every kit, course and project ends in something that works in the field, not a toy demo.",
  },
  {
    Icon: IconCode,
    title: "Everything documented",
    desc: "Commented source, schematics, BOM and a setup guide ship with every build.",
  },
  {
    Icon: IconAward,
    title: "Full IP handover",
    desc: "Custom work is yours outright: code, design files and rights, no lock-in.",
  },
  {
    Icon: IconTruck,
    title: "Bench-tested before dispatch",
    desc: "Nothing leaves the lab until it has run on our bench exactly as you’ll run it.",
  },
  {
    Icon: IconUsers,
    title: "Support after the sale",
    desc: "WhatsApp and email access to the build team long after delivery.",
  },
];

export default function AboutStory() {
  return (
    <>
      {/* ========================== PILLARS ========================== */}
      <section className="py-20 lg:py-24">
        <div className="container-x">
          <div className="reveal mx-auto max-w-3xl text-center">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Who we are
            </div>
            <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl lg:text-[2.7rem]">
              We help people <span className="text-gradient">build the future</span>,
              one project at a time.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-600">
              Elektron Nexus is an IoT marketplace, training academy and
              project-development lab, three businesses that feed each other.
              What we learn building custom systems becomes a kit; what the kit
              teaches becomes a course, taught by the same team throughout.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href="/custom-project" size="lg">
                Work with us
                <IconArrow className="h-4 w-4" strokeWidth={2} />
              </Button>
              <Button href="/contact" variant="white" size="lg">
                Get in touch
              </Button>
            </div>
          </div>

          <div className="reveal-late relative mt-14">
            {/* the rope the three cards hang from (desktop only) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-2 top-0 hidden md:block"
            >
              <div className="h-0.5 rounded-full bg-line-strong" />
              <span className="absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-line-strong" />
              <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-line-strong" />
            </div>

            <div className="grid gap-5 md:grid-cols-3 md:gap-6 md:pt-12">
              {pillars.map(({ Icon, label, title, desc, href, cta }, i) => (
                <div
                  key={label}
                  className="toran-hang relative"
                  style={{ animationDelay: `${i * -1.6}s` }}
                >
                  {/* string from the rope to the card (desktop only) */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-12 left-1/2 hidden h-12 w-px -translate-x-1/2 bg-line-strong md:block"
                  />
                  {/* knot at the rope */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-[52px] left-1/2 hidden h-2 w-2 -translate-x-1/2 rounded-full bg-brand-400 ring-2 ring-white md:block"
                  />
                  {/* hook ring where the string meets the card */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-1.5 left-1/2 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-line-strong bg-white md:block"
                  />
                  <Link
                    href={href}
                    className="group relative flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-card lift hover:border-brand-200 hover:shadow-lift"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">
                      {label}
                    </div>
                    <h3 className="mt-1.5 text-xl font-black tracking-tight text-ink-900">
                      {title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                      {desc}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600">
                      {cta}
                      <IconArrow
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        strokeWidth={2}
                      />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============= MISSION + WHY US (merged) ===================== */}
      <section className="py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* mission statement */}
          <div className="reveal lg:sticky lg:top-24 lg:self-start">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Our mission
            </div>
            <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl lg:text-[2.7rem]">
              Make world-class engineering accessible
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-600">
              Too many good ideas die on a breadboard. We exist to carry them
              across the line, with the right hardware, clean code, clear
              documentation and people who have done it before.
            </p>
            <p className="mt-4 leading-relaxed text-pretty text-ink-600">
              Whether you’re a student shipping a final-year project, a college
              upskilling its faculty, or a company prototyping a product, we
              give you the kit, the knowledge and the team to make it real.
            </p>

            <div className="mt-8 rounded-2xl border border-line border-l-4 border-l-brand-500 bg-white p-5 shadow-card">
              <p className="text-pretty font-semibold leading-relaxed text-ink-700">
                “If it can’t survive a week in the field, it isn’t finished.”
              </p>
              <p className="mt-2 text-sm text-ink-400">
                the rule every build is checked against
              </p>
            </div>
          </div>

          {/* why teams pick us — compact cards, staggered pop-in */}
          <div>
            <div className="reveal mb-5 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Why teams pick us
            </div>
            <RevealOnView className="grid gap-3 sm:grid-cols-2">
              {reasons.map(({ Icon, title, desc }, i) => (
                <li
                  key={title}
                  className="group relative rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span className="absolute right-4 top-4 text-3xl font-black leading-none text-ink-900/[0.06] transition-colors duration-300 group-hover:text-brand-500/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-3.5 text-[15px] font-bold text-ink-900">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                    {desc}
                  </p>
                </li>
              ))}
            </RevealOnView>
          </div>
        </div>
      </section>
    </>
  );
}
