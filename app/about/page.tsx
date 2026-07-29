import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import {
  IconArrow,
  IconAward,
  IconBolt,
  IconBox,
  IconCap,
  IconCheck,
  IconCode,
  IconEye,
  IconInfinity,
  IconPin,
  IconShield,
  IconTarget,
  IconTruck,
  IconUsers,
} from "@/components/icons";
import { stats, partners } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MS Project & Tech Solution — an IoT marketplace, training academy and project development lab helping students, faculty and companies build real technology.",
};

type Glyph = (p: { className?: string; strokeWidth?: number }) => ReactNode;

/** The three things this company actually is — the nav implies all three. */
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
    desc: "Documented, bench-tested builds across IoT, embedded, LoRa, AI and robotics — shipped with source code and circuit diagrams.",
    href: "/projects",
    cta: "Browse kits",
  },
  {
    Icon: IconCap,
    label: "Academy",
    title: "Training that sticks",
    desc: "Live cohorts, campus bootcamps, faculty development programs and internships — taught by engineers who ship, not by slide decks.",
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
    desc: "Every kit, course and project ends in something that works in the field — not a toy demo.",
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

const timeline: { year: string; title: string; desc: string }[] = [
  {
    year: "2022",
    title: "Started as a campus project lab",
    desc: "Helping final-year students ship working IoT projects instead of slide decks.",
  },
  {
    year: "2023",
    title: "Launched ready-made kits",
    desc: "Packaged our most-requested builds into fully documented, shippable kits.",
  },
  {
    year: "2024",
    title: "Training academy & internships",
    desc: "Workshops, FDPs and mentor-led internships rolled out across colleges.",
  },
  {
    year: "2026",
    title: "One full platform",
    desc: "Marketplace, academy, project lab and learning system under one roof.",
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
    desc: "Custom work is yours outright — code, design files and rights, no lock-in.",
  },
  {
    Icon: IconTruck,
    title: "Bench-tested before dispatch",
    desc: "Nothing leaves the lab until it has run on our bench exactly as you'll run it.",
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

const glance: { label: string; value: string }[] = [
  { label: "Founded", value: "2022" },
  { label: "Based in", value: site.city },
  { label: "Focus", value: "IoT · Embedded · AI" },
  { label: "Works with", value: "Students, faculty & industry" },
];

export default function AboutPage() {
  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden border-b border-line bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-drift absolute -left-24 -top-28 h-[26rem] w-[26rem] rounded-full bg-brand-400/22 blur-[130px]" />
          <div className="animate-drift absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-accent/18 blur-[130px] [animation-delay:-7s]" />
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_10%,black,transparent)]" />
        </div>

        <div className="container-x relative grid items-center gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700 backdrop-blur">
              <IconPin className="h-3.5 w-3.5" strokeWidth={2} />
              {site.city}
            </span>

            <h1 className="mt-6 text-4xl font-black leading-[1.06] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl lg:text-[3.5rem]">
              We help people{" "}
              <span className="text-gradient">build the future</span>, one
              project at a time.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-600">
              {site.name} is an IoT marketplace, training academy and
              project-development lab. We exist to close the gap between
              classroom theory and real, deployable engineering — for students,
              faculty and companies alike.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/custom-project" size="lg">
                Work with us
                <IconArrow className="h-4 w-4" strokeWidth={2} />
              </Button>
              <Button href="/contact" variant="white" size="lg">
                Get in touch
              </Button>
            </div>
          </div>

          {/* At-a-glance panel — gives the hero a right-hand anchor instead of
              leaving half the viewport empty. */}
          <div className="ring-gradient animate-rise rounded-3xl bg-white/75 p-2 shadow-glow backdrop-blur-xl [animation-delay:120ms]">
            <div className="rounded-[1.35rem] border border-line bg-white p-7">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                At a glance
              </div>
              <dl className="mt-5 divide-y divide-line">
                {glance.map((g) => (
                  <div
                    key={g.label}
                    className="flex items-baseline justify-between gap-4 py-3.5"
                  >
                    <dt className="text-sm font-medium text-ink-400">
                      {g.label}
                    </dt>
                    <dd className="text-right text-sm font-bold text-ink-900">
                      {g.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-brand-50/70 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                  <IconCheck className="h-4 w-4" strokeWidth={2.6} />
                </span>
                <p className="text-sm leading-relaxed text-ink-600">
                  Every custom project ships with source, schematics and full
                  IP transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================== STATS =========================== */}
      <section className="border-b border-line bg-white py-12">
        <div className="container-x grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-line">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center ${i > 0 ? "sm:px-4" : ""}`}>
              <div className="text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1.5 text-sm font-medium text-ink-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================== PILLARS ========================== */}
      <section className="py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              What we are
            </div>
            <h2 className="text-3xl font-black tracking-tight text-balance text-ink-900 sm:text-4xl">
              Three businesses that feed each other
            </h2>
            <p className="mt-4 leading-relaxed text-pretty text-ink-600">
              What we learn building custom systems becomes a kit. What the kit
              teaches becomes a course. It’s the same team throughout.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
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
      <section className="border-y border-line bg-white py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Our mission
            </div>
            <h2 className="text-3xl font-black tracking-tight text-balance text-ink-900 sm:text-4xl">
              Make world-class engineering accessible
            </h2>
            <p className="mt-5 leading-relaxed text-pretty text-ink-600">
              Too many good ideas die on a breadboard. We exist to carry them
              across the line — with the right hardware, clean code, clear
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
                — the rule every build is checked against
              </p>
            </div>
          </div>

          {/* Values as a numbered list, not four emoji tiles. */}
          <ol className="grid gap-4 sm:grid-cols-2">
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

      {/* ========================== TIMELINE ========================= */}
      <section className="py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Our journey
            </div>
            <h2 className="text-3xl font-black tracking-tight text-balance text-ink-900 sm:text-4xl">
              From a campus lab to a full platform
            </h2>
          </div>

          <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            {/* Horizontal rail, aligned to the dot centres (top-3 = 12px). */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-3 hidden h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 md:block"
            />
            {timeline.map((t) => (
              <li
                key={t.year}
                className="relative pl-10 before:absolute before:left-3 before:top-6 before:h-full before:w-px before:bg-line last:before:hidden md:pl-0 md:before:hidden"
              >
                <span className="absolute left-0 top-0 z-10 grid h-6 w-6 place-items-center rounded-full border-2 border-brand-500 bg-white md:relative md:left-auto md:top-auto">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                </span>
                <div className="text-sm font-black tracking-[0.12em] text-brand-600 md:mt-5">
                  {t.year}
                </div>
                <h3 className="mt-2 font-bold text-ink-900">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {t.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================== WHY US (dark anchor) ================== */}
      <section className="relative overflow-hidden bg-navy-900 py-20 text-white">
        <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
        <div
          aria-hidden
          className="grid-lines pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="container-x relative">
          <div className="max-w-2xl">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-cyan-accent">
              Why teams pick us
            </div>
            <h2 className="text-3xl font-black tracking-tight text-balance sm:text-4xl">
              The six things people tell us they were missing elsewhere
            </h2>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ========================== PARTNERS ========================= */}
      <section className="border-b border-line bg-white py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Our network
            </div>
            <h2 className="text-3xl font-black tracking-tight text-balance text-ink-900 sm:text-4xl">
              Trusted across 60+ campuses &amp; companies
            </h2>
          </div>

          <div className="mt-11 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((p) => (
              <div
                key={p}
                className="grid min-h-[5.5rem] place-items-center bg-white px-4 text-center text-sm font-bold tracking-tight text-ink-400 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <section className="py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-10 text-center text-white md:p-16">
            <div className="mesh pointer-events-none absolute inset-0 opacity-60" />
            <div
              aria-hidden
              className="grid-lines pointer-events-none absolute inset-0 opacity-[0.15]"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-black tracking-tight text-balance sm:text-4xl">
                Let’s build something together
              </h2>
              <p className="mt-4 leading-relaxed text-brand-100/80">
                Kits, custom builds, training or internships — tell us what
                you’re trying to make and we’ll tell you honestly what it takes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/contact" variant="white" size="lg">
                  Contact us
                </Button>
                <Button href="/projects" variant="outline-light" size="lg">
                  Explore kits
                </Button>
              </div>
              <p className="mt-6 text-sm text-brand-100/55">
                Prefer email? {site.email}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
