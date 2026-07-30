import Link from "next/link";
import type { ReactNode } from "react";
import {
  IconArrow,
  IconAward,
  IconBolt,
  IconBox,
  IconCap,
  IconCode,
  IconEye,
  IconInfinity,
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

const values: { Icon: Glyph; title: string; desc: string }[] = [
  {
    Icon: IconTarget,
    title: "Build real things",
    desc: "Every kit, course and project ends in something that works in the field, not a toy demo.",
  },
  {
    Icon: IconUsers,
    title: "Teach by doing",
    desc: "We learned by building, and that’s how we teach. Hands-on, mentor-led, project-first.",
  },
  {
    Icon: IconEye,
    title: "Radical transparency",
    desc: "Clear quotes, honest timelines, and full handover of code, docs and IP.",
  },
  {
    Icon: IconInfinity,
    title: "Lifelong support",
    desc: "Communities, recordings and source code that stay with you for good.",
  },
];

const differentiators: { Icon: Glyph; title: string; desc: string }[] = [
  {
    Icon: IconShield,
    title: "Engineers, not resellers",
    desc: "The person who answers your question is the one who wrote the firmware.",
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
    Icon: IconBolt,
    title: "Campus-scale deployments",
    desc: "Multi-node LoRa meshes and field rollouts, not just breadboard prototypes.",
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
          <div className="reveal mx-auto max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              What we do
            </div>
            <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl lg:text-[2.7rem]">
              Three businesses that feed each other
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-600">
              What we learn building custom systems becomes a kit. What the kit
              teaches becomes a course. It’s the same team throughout.
            </p>
          </div>

          <div className="reveal-late mt-12 grid gap-5 md:grid-cols-3">
            {pillars.map(({ Icon, label, title, desc, href, cta }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col rounded-3xl border border-line bg-white p-7 shadow-card lift hover:border-brand-200 hover:shadow-lift"
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
            ))}
          </div>
        </div>
      </section>

      {/* ====================== MISSION & VALUES ===================== */}
      <section className="border-y border-line bg-white py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
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

            <div className="mt-8 rounded-2xl border-l-4 border-brand-500 bg-brand-50/60 p-5">
              <p className="text-pretty font-semibold leading-relaxed text-ink-700">
                “If it can’t survive a week in the field, it isn’t finished.”
              </p>
              <p className="mt-2 text-sm text-ink-400">
                the rule every build is checked against
              </p>
            </div>
          </div>

          <ol className="reveal-late grid gap-4 sm:grid-cols-2">
            {values.map(({ Icon, title, desc }, i) => (
              <li
                key={title}
                className="group relative rounded-2xl border border-line bg-[#f7f9fd] p-6 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
              >
                <span className="absolute right-5 top-5 text-4xl font-black leading-none text-ink-900/[0.06]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-brand-600 shadow-card">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-ink-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================== WHY US (dark anchor) ================== */}
      <section className="relative overflow-hidden bg-navy-900 py-20 text-white lg:py-24">
        <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
        <div
          aria-hidden
          className="grid-lines pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="container-x relative">
          <div className="reveal max-w-2xl">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-cyan-accent">
              Why teams pick us
            </div>
            <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.7rem]">
              The six things people tell us they were missing elsewhere
            </h2>
          </div>

          <div className="reveal-late mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-accent/12 text-cyan-accent ring-1 ring-cyan-accent/20">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-100/70">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
