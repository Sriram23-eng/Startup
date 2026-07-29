import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui";
import ProjectCard from "@/components/ProjectCard";
import {
  CategoryIcon,
  IconArrow,
  IconAward,
  IconBolt,
  IconBook,
  IconBox,
  IconCap,
  IconCheck,
  IconChip,
  IconClock,
  IconCode,
  IconMail,
  IconPhone,
  IconPin,
  IconShield,
  IconSparkle,
  IconStar,
  IconTruck,
  IconUsers,
} from "@/components/icons";
import {
  categories,
  workshops,
  testimonials,
  partners,
  stats,
} from "@/lib/data";
import { getProjects, getCourses } from "@/lib/store";
import { formatINR, site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Glyph = (p: { className?: string; strokeWidth?: number }) => ReactNode;

/** What every buyer gets, regardless of which path they take. */
const capabilities: { Icon: Glyph; title: string; desc: string }[] = [
  {
    Icon: IconTruck,
    title: "Dispatch in 48 hours",
    desc: "Kits ship assembled & tested",
  },
  {
    Icon: IconCode,
    title: "Source + docs included",
    desc: "Firmware, schematics, BOM",
  },
  {
    Icon: IconUsers,
    title: "Engineer on call",
    desc: "WhatsApp & email support",
  },
];

const contactLinks: {
  Icon: Glyph;
  label: string;
  value: string;
  href: string;
}[] = [
  { Icon: IconMail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { Icon: IconPhone, label: "Phone", value: site.phone, href: `tel:${site.whatsapp}` },
  { Icon: IconPin, label: "Studio", value: site.city, href: "/contact" },
];

/** Three steps, shared by the kit path and the custom-build path. */
const process: { title: string; desc: string; meta: string }[] = [
  {
    title: "Choose or describe",
    desc: "Pick a kit from the catalogue, or send us your requirement, budget and deadline.",
    meta: "Same-day response",
  },
  {
    title: "We build & document",
    desc: "Assembled, flashed and bench-tested — with schematics, BOM and commented source.",
    meta: "Milestone updates",
  },
  {
    title: "You deploy, we back you",
    desc: "Ships to your door with a setup guide. Questions get answered by the engineer who built it.",
    meta: "Support after delivery",
  },
];

export default async function HomePage() {
  const [allProjects, allCourses] = await Promise.all([
    getProjects(),
    getCourses(),
  ]);
  const featured = allProjects.slice(0, 6);
  const liveCourses = allCourses.filter((c) => c.mode === "Live").slice(0, 3);
  const fromPrice = allProjects.length
    ? Math.min(...allProjects.map((p) => p.price))
    : 0;

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-drift absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-400/25 blur-[140px]" />
          <div className="animate-drift absolute -right-20 top-0 h-[24rem] w-[24rem] rounded-full bg-cyan-accent/20 blur-[130px] [animation-delay:-6s]" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand-600/12 blur-[130px]" />
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(70%_55%_at_50%_20%,black,transparent)]" />
        </div>

        <div className="container-x relative grid items-center gap-14 py-20 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:py-28">
          {/* ---- Copy column ---- */}
          <div className="animate-rise">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-ink-700 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Marketplace · Academy · Project Lab
            </div>

            {/* Explicit line breaks: left to wrap, "— end to end." split across
                lines 2 and 3 at desktop widths and read as a stray fragment. */}
            <h1 className="mt-6 text-[2.15rem] font-black leading-[1.04] tracking-[-0.025em] text-ink-900 min-[420px]:text-[2.6rem] sm:text-[3.4rem] lg:text-[3.6rem]">
              Build, learn &amp; ship
              <br />
              <span className="text-gradient">real-world IoT</span>
              <br />
              <span className="text-ink-900">— end to end.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-600">
              Ready-made project kits, custom engineering builds, and hands-on
              training. From a first Arduino blink to a multi-kilometre LoRa
              deployment — hardware, code and people included.
            </p>

            {/* One primary action. The old three-equal-buttons row made every
                option look equally likely, which is how nobody clicks any. */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/projects" size="lg">
                Explore project kits
                <IconArrow className="h-4 w-4" strokeWidth={2} />
              </Button>
              <Button href="/custom-project" variant="white" size="lg">
                Request a custom build
              </Button>
              <Link
                href="/workshops"
                className="group inline-flex items-center gap-1.5 px-1 py-2 text-sm font-semibold text-ink-600 underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                or book a workshop
                <IconArrow
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex -space-x-2.5">
                {[
                  ["from-brand-500 to-brand-700", "A"],
                  ["from-cyan-accent to-brand-500", "S"],
                  ["from-navy-700 to-navy-900", "R"],
                  ["from-emerald-400 to-emerald-600", "K"],
                ].map(([g, ch]) => (
                  <span
                    key={ch}
                    className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${g} text-xs font-bold text-white ring-2 ring-[#f7f9fd]`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 font-bold text-ink-900">
                  <span className="flex text-amber-400">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <IconStar key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </span>
                  4.9/5
                </div>
                <div className="text-xs font-medium text-ink-400">
                  from 9,200+ students &amp; engineering teams
                </div>
              </div>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-2 gap-y-5 border-t border-line pt-7 sm:grid-cols-4 sm:divide-x sm:divide-line">
              {stats.map((s, i) => (
                <div key={s.label} className={i > 0 ? "sm:pl-5" : ""}>
                  <div className="text-2xl font-black tracking-tight text-ink-900">
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-ink-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Product visual ---- */}
          <HeroConsole />
        </div>

        {/* Capability strip — closes the hero and answers "what do I get?" */}
        <div className="relative border-t border-line bg-white/60 backdrop-blur">
          <div className="container-x grid gap-x-8 gap-y-5 py-6 sm:grid-cols-3">
            {capabilities.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-ink-900">{title}</div>
                  <div className="text-xs text-ink-400">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== TRUST / PARTNERS ====================== */}
      <section className="border-b border-line bg-white py-9">
        <div className="container-x">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-ink-400">
            Trusted by students, faculty &amp; engineers at
          </p>
          <div className="marquee-hold relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="flex w-max animate-marquee gap-12">
              {[...partners, ...partners].map((p, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap text-lg font-bold tracking-tight text-ink-400/70 transition-colors hover:text-brand-600"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= THREE PATHS ======================== */}
      {/* Moved up from the middle of the page: a visitor arriving from
          "IoT marketplace + academy + lab" needs routing before catalogue. */}
      <section className="py-20">
        <div className="container-x">
          <Head
            eyebrow="Where do you start?"
            title="Three ways to work with us"
            subtitle="Buy something that already works, commission something that doesn’t exist yet, or learn to build it yourself."
          />

          <div className="mt-11 grid gap-5 lg:grid-cols-12">
            {/* Primary path — wide */}
            <article className="ring-gradient group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-8 shadow-card lift hover:shadow-lift md:p-10 lg:col-span-7">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-400/12 blur-3xl"
              />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-700">
                  <IconBox className="h-3.5 w-3.5" strokeWidth={2} />
                  Most popular
                </span>
                <h3 className="mt-5 text-3xl font-black tracking-tight text-ink-900">
                  Buy a ready-made kit
                </h3>
                <p className="mt-3 max-w-md text-ink-600">
                  Complete, tested builds — hardware, source code, circuit
                  diagrams, documentation and a setup guide, shipped to your
                  door.
                </p>

                <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                  {[
                    "Same-week dispatch",
                    "Full documentation",
                    "Demo video included",
                    "Email + WhatsApp support",
                  ].map((t) => (
                    <Bullet key={t}>{t}</Bullet>
                  ))}
                </ul>

                {/* Fills the height this card inherits from the taller column
                    beside it, and answers the actual question buyers ask. */}
                <div className="mt-8 rounded-2xl border border-line bg-[#f7f9fd] p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">
                    In the box
                  </div>
                  <div className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {[
                      { Icon: IconBox, label: "Assembled hardware" },
                      { Icon: IconCode, label: "Commented source code" },
                      { Icon: IconBook, label: "Setup guide + BOM" },
                      { Icon: IconChip, label: "Circuit diagrams" },
                    ].map(({ Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 text-sm font-medium text-ink-700"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-brand-600" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative mt-9 flex flex-wrap items-center gap-3">
                <Button href="/projects" size="lg">
                  Browse the catalogue
                  <IconArrow className="h-4 w-4" strokeWidth={2} />
                </Button>
                <span className="text-sm font-medium text-ink-400">
                  From {formatINR(fromPrice)} · {allProjects.length} kits live
                </span>
              </div>
            </article>

            {/* Two stacked secondary paths */}
            <div className="grid gap-5 lg:col-span-5">
              <PathCard
                tone="dark"
                icon={<IconSparkle className="h-5 w-5" strokeWidth={1.8} />}
                title="Commission a custom build"
                desc="Send requirements, get a transparent quote, receive milestone-based delivery with full IP and docs handed over."
                meta="IoT · Embedded · LoRa · AI/ML"
                cta={{ label: "Request a quote", href: "/custom-project" }}
              />
              <PathCard
                tone="light"
                icon={<IconCap className="h-5 w-5" strokeWidth={1.8} />}
                title="Learn it properly"
                desc="Mentor-led live cohorts, campus workshops, FDPs and internships that end in something you actually built."
                meta="Live cohorts · Bootcamps · Internships"
                cta={{ label: "See programs", href: "/courses" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================== FEATURED PROJECTS ===================== */}
      <section className="border-y border-line bg-white py-20">
        <div className="container-x">
          <Head
            eyebrow="Ready-made kits"
            title="Order today, build this weekend"
            subtitle="Hardware, source code, documentation and circuit diagrams in one box."
            action={
              <Button href="/projects" variant="outline">
                All kits
                <IconArrow className="h-4 w-4" strokeWidth={2} />
              </Button>
            }
          />

          {/* Category rail — 11 domains as a scannable pill row instead of the
              12-card grid that used to sit above yet another card grid. */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/projects?cat=${c.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                title={c.blurb}
              >
                <CategoryIcon
                  slug={c.slug}
                  className="h-4 w-4 text-ink-400 transition-colors group-hover:text-brand-600"
                  strokeWidth={1.8}
                />
                {c.name}
              </Link>
            ))}
            <Link
              href="/custom-project"
              className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy-700"
            >
              <IconSparkle className="h-4 w-4 text-cyan-accent" strokeWidth={1.8} />
              Something custom
            </Link>
          </div>

          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================== HOW IT WORKS ======================== */}
      <section className="py-20">
        <div className="container-x">
          <Head
            center
            eyebrow="How it works"
            title="From “I need this” to “it’s running”"
            subtitle="The same three steps whether you order a kit off the shelf or commission something new."
          />

          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {/* Connecting rail, desktop only */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent md:block"
            />
            {process.map(({ title, desc, meta }, i) => (
              <li key={title} className="relative">
                <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-line bg-white text-lg font-black text-brand-600 shadow-card">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink-900">{title}</h3>
                <p className="mt-2 max-w-sm leading-relaxed text-ink-600">
                  {desc}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
                  <IconClock className="h-3.5 w-3.5" strokeWidth={2} />
                  {meta}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================== ACADEMY (dark anchor) ================== */}
      {/* Workshops and live courses were two consecutive card grids. Merged
          into one composite section — a list on the left, cohorts on the
          right — so the page has a single dark anchor instead of two. */}
      <section className="relative overflow-hidden bg-navy-900 py-20 text-white">
        <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
        <div
          aria-hidden
          className="grid-lines pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <div className="container-x relative">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-cyan-accent">
                The academy
              </div>
              <h2 className="text-3xl font-black tracking-tight text-balance sm:text-4xl">
                Training that ends in something you built
              </h2>
              <p className="mt-4 leading-relaxed text-brand-100/75">
                Bootcamps, FDPs and internships on your campus — or live online
                cohorts you can join from anywhere.
              </p>
            </div>

            {/* Balances the heading row and puts the academy’s proof up front. */}
            <dl className="flex gap-6 sm:gap-10">
              {[
                ["9,200+", "Trained"],
                ["60+", "Campuses"],
                ["4.9", "Avg rating"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {value}
                  </dd>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-brand-100/50">
                    {label}
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Workshops — compact rows */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                  Workshops &amp; on-campus programs
                </h3>
                <Link
                  href="/workshops"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-accent"
                >
                  All programs
                  <IconArrow
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </div>

              <div className="divide-y divide-white/10">
                {workshops.map((w) => (
                  <Link
                    key={w.slug}
                    href={`/workshops#${w.slug}`}
                    className="group flex items-center gap-5 py-5 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-cyan-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-cyan-accent">
                          {w.mode}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-100/50">
                          {w.level} · {w.duration}
                        </span>
                      </div>
                      <h4 className="mt-2 font-bold leading-snug text-white transition-colors group-hover:text-cyan-accent">
                        {w.title}
                      </h4>
                      <p className="mt-1 line-clamp-1 text-sm text-brand-100/60">
                        {w.blurb}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[11px] uppercase tracking-wider text-brand-100/50">
                        From
                      </div>
                      <div className="text-lg font-black text-white">
                        {formatINR(w.priceFrom)}
                      </div>
                    </div>
                    <IconArrow
                      className="h-5 w-5 shrink-0 text-white/25 transition-all group-hover:translate-x-1 group-hover:text-cyan-accent"
                      strokeWidth={2}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Live cohorts — cards */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                  Live online cohorts
                </h3>
                <Link
                  href="/courses"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-accent"
                >
                  All courses
                  <IconArrow
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </div>

              <div className="mt-5 grid gap-4">
                {liveCourses.map((c) => (
                  <Link
                    key={c.slug}
                    href="/courses#enroll"
                    className="ring-gradient ring-gradient-dark group rounded-2xl bg-white/[0.06] p-5 backdrop-blur lift hover:bg-white/[0.1]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-bold text-red-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                        LIVE
                      </span>
                      {typeof c.seatsLeft === "number" && (
                        <span className="text-xs font-bold text-amber-300">
                          {c.seatsLeft} seats left
                        </span>
                      )}
                    </div>
                    <h4 className="mt-3 font-bold leading-snug text-white transition-colors group-hover:text-cyan-accent">
                      {c.title}
                    </h4>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-100/60">
                      <span>Starts {c.startDate}</span>
                      <span className="text-white/20">•</span>
                      <span>{c.schedule}</span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2 border-t border-white/10 pt-3">
                      <span className="text-lg font-black text-white">
                        {formatINR(c.price)}
                      </span>
                      {c.oldPrice && (
                        <span className="text-sm text-brand-100/45 line-through">
                          {formatINR(c.oldPrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= INTERNSHIPS ======================= */}
      <section className="py-20">
        <div className="container-x">
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
            <div className="grid items-center gap-10 p-8 md:grid-cols-2 md:p-12">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-accent/12 px-3 py-1 text-xs font-bold text-[#0b7c8c] ring-1 ring-cyan-accent/30">
                  <IconAward className="h-3.5 w-3.5" strokeWidth={2} />
                  Internship portal
                </span>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-balance text-ink-900">
                  Industry internships with real deliverables
                </h2>
                <p className="mt-4 leading-relaxed text-ink-600">
                  Apply, get matched to a live project, track your milestones,
                  and download a verifiable offer letter and certificate — all
                  from your student dashboard.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="/internships" size="lg">
                    Apply now
                  </Button>
                  <Button href="/certificates" variant="outline" size="lg">
                    Verify a certificate
                  </Button>
                </div>
              </div>

              <ol className="relative grid gap-3">
                {[
                  ["Apply online", "Pick a domain & submit your profile"],
                  ["Get matched", "Work on a live IoT / AI project"],
                  ["Track & submit", "Milestones in your dashboard"],
                  ["Earn certificate", "Verifiable offer letter & cert"],
                ].map(([t, d], i) => (
                  <li
                    key={t}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-[#f7f9fd] p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/60"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-ink-900">{t}</div>
                      <div className="text-sm text-ink-400">{d}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================= */}
      <section className="border-y border-line bg-white py-20">
        <div className="container-x">
          <Head
            center
            eyebrow="Success stories"
            title="Loved by colleges & companies"
          />

          {/* One lead quote plus two supporting — deliberately not three
              identical boxes, so the strongest story actually leads. */}
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <Quote featured item={testimonials[0]} className="lg:col-span-7" />
            <div className="grid gap-6 lg:col-span-5">
              {testimonials.slice(1).map((t) => (
                <Quote key={t.name} item={t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================== CTA ============================= */}
      <section className="py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-10 text-white md:p-14">
            <div className="mesh pointer-events-none absolute inset-0 opacity-60" />
            <div
              aria-hidden
              className="grid-lines pointer-events-none absolute inset-0 opacity-[0.15]"
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-balance sm:text-4xl">
                  Have an idea? Let’s build it together.
                </h2>
                <p className="mt-4 max-w-lg leading-relaxed text-brand-100/80">
                  Whether you need a kit by Friday or a full custom system, an
                  engineer — not a sales bot — reads every message.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/custom-project" variant="white" size="lg">
                    Request custom project
                  </Button>
                  <Button href="/contact" variant="outline-light" size="lg">
                    Talk to us
                  </Button>
                </div>
              </div>

              {/* Contact affordances — the old CTA just repeated the hero. */}
              <div className="grid gap-3">
                {contactLinks.map(({ Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur transition-colors hover:border-cyan-accent/40 hover:bg-white/[0.1]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-accent/15 text-cyan-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-brand-100/55">
                        {label}
                      </span>
                      <span className="block truncate font-semibold text-white">
                        {value}
                      </span>
                    </span>
                    <IconArrow
                      className="ml-auto h-4 w-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-cyan-accent"
                      strokeWidth={2}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ================================================================== */
/*  Local building blocks                                              */
/* ================================================================== */

/** Section header with an optional right-aligned action. */
function Head({
  eyebrow,
  title,
  subtitle,
  action,
  center = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={
        center
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-wrap items-end justify-between gap-5"
      }
    >
      <div className="max-w-2xl">
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
          {eyebrow}
        </div>
        <h2 className="text-3xl font-black tracking-tight text-balance text-ink-900 sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 leading-relaxed text-pretty text-ink-600">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-sm font-medium text-ink-700">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
        <IconCheck className="h-3 w-3" strokeWidth={2.6} />
      </span>
      {children}
    </li>
  );
}

function PathCard({
  tone,
  icon,
  title,
  desc,
  meta,
  cta,
}: {
  tone: "light" | "dark";
  icon: ReactNode;
  title: string;
  desc: string;
  meta: string;
  cta: { label: string; href: string };
}) {
  const dark = tone === "dark";
  return (
    <Link
      href={cta.href}
      className={`group relative flex flex-col overflow-hidden rounded-3xl p-7 lift ${
        dark
          ? "bg-navy-800 text-white hover:shadow-lift"
          : "border border-line bg-white text-ink-900 shadow-card hover:border-brand-200 hover:shadow-lift"
      }`}
    >
      {dark && (
        <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
      )}
      <div className="relative flex h-full flex-col">
        <span
          className={`grid h-11 w-11 place-items-center rounded-xl ${
            dark
              ? "bg-cyan-accent/15 text-cyan-accent"
              : "bg-brand-50 text-brand-600"
          }`}
        >
          {icon}
        </span>
        <h3 className="mt-5 text-xl font-black tracking-tight">{title}</h3>
        <p
          className={`mt-2.5 flex-1 text-sm leading-relaxed ${
            dark ? "text-brand-100/75" : "text-ink-600"
          }`}
        >
          {desc}
        </p>
        <div
          className={`mt-5 text-[11px] font-bold uppercase tracking-wider ${
            dark ? "text-brand-100/50" : "text-ink-400"
          }`}
        >
          {meta}
        </div>
        <div
          className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${
            dark ? "text-cyan-accent" : "text-brand-600"
          }`}
        >
          {cta.label}
          <IconArrow
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2}
          />
        </div>
      </div>
    </Link>
  );
}

function Quote({
  item,
  featured = false,
  className = "",
}: {
  item: { quote: string; name: string; role: string };
  featured?: boolean;
  className?: string;
}) {
  const initials = item.name
    .replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <figure
      className={`flex flex-col rounded-3xl p-7 md:p-8 ${
        featured
          ? // Centred: this card is stretched by the two stacked cards beside
            // it, and a short quote pinned to the top left a dead gap.
            "justify-center bg-navy-800 text-white"
          : "border border-line bg-[#f7f9fd] text-ink-900"
      } ${className}`}
    >
      <div
        className={`flex gap-0.5 ${featured ? "text-cyan-accent" : "text-amber-400"}`}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <IconStar key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <blockquote
        className={`mt-5 text-pretty ${
          featured
            ? "text-xl leading-relaxed text-white/90 md:text-2xl"
            : "flex-1 leading-relaxed text-ink-600"
        }`}
      >
        “{item.quote}”
      </blockquote>
      <figcaption
        className={`mt-6 flex items-center gap-3 border-t pt-5 ${
          featured ? "border-white/10" : "border-line"
        }`}
      >
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-black ${
            featured
              ? "bg-cyan-accent/15 text-cyan-accent"
              : "bg-brand-100 text-brand-700"
          }`}
        >
          {initials}
        </span>
        <span>
          <span
            className={`block font-bold ${featured ? "text-white" : "text-ink-900"}`}
          >
            {item.name}
          </span>
          <span
            className={`block text-sm ${
              featured ? "text-brand-100/60" : "text-ink-400"
            }`}
          >
            {item.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/* ---------------- Hero product visual ---------------- */

function HeroConsole() {
  return (
    <div className="relative animate-rise [animation-delay:120ms]">
      <div
        aria-hidden
        className="absolute inset-8 -z-10 rounded-[2rem] bg-brand-500/25 blur-3xl"
      />

      <div className="ring-gradient rounded-[1.75rem] bg-white/70 p-2.5 shadow-glow backdrop-blur-xl">
        <div className="relative overflow-hidden rounded-[1.4rem] bg-navy-900 p-6 text-brand-100">
          <div className="mesh pointer-events-none absolute inset-0 opacity-30" />

          <div className="relative">
            {/* window chrome */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <div className="font-mono text-xs font-semibold text-cyan-accent">
                  field-node-07
                </div>
                <div className="mt-0.5 text-[11px] text-brand-100/45">
                  Uptime 41d · last packet 3s ago
                </div>
              </div>
              <span className="flex items-end gap-0.5">
                {[6, 9, 12, 8].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 rounded-sm bg-cyan-accent/80"
                  />
                ))}
                <span className="ml-1.5 font-mono text-[11px] text-brand-100/50">
                  LoRa −94 dBm
                </span>
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Soil moisture", "38", "%"],
                ["Air temp", "29.4", "°C"],
                ["Humidity", "61", "%"],
                ["Battery", "4.02", "V"],
              ].map(([k, v, unit]) => (
                <div
                  key={k}
                  className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10"
                >
                  <div className="text-[11px] text-brand-100/50">{k}</div>
                  <div className="mt-0.5 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white">{v}</span>
                    <span className="text-xs font-medium text-brand-100/50">
                      {unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sparkline — replaces the flat bar row */}
            <div className="mt-5 rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-brand-100/50">Moisture · 12 h</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-300">
                  <IconBolt className="h-3 w-3" strokeWidth={2} />
                  +12.4%
                </span>
              </div>
              <svg
                viewBox="0 0 240 64"
                preserveAspectRatio="none"
                className="mt-2 h-16 w-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#25d3ee" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#25d3ee" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="sparkLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2f63f5" />
                    <stop offset="100%" stopColor="#25d3ee" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,37.6 L21.8,23.6 L43.6,30.9 L65.5,16.3 L87.3,26.4 L109.1,9.6 L130.9,19.7 L152.7,13 L174.5,27.5 L196.4,6.2 L218.2,20.8 L240,14.1 L240,64 L0,64 Z"
                  fill="url(#sparkFill)"
                />
                <path
                  d="M0,37.6 L21.8,23.6 L43.6,30.9 L65.5,16.3 L87.3,26.4 L109.1,9.6 L130.9,19.7 L152.7,13 L174.5,27.5 L196.4,6.2 L218.2,20.8 L240,14.1"
                  fill="none"
                  stroke="url(#sparkLine)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-line bg-white/95 p-4 shadow-card backdrop-blur sm:block">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <IconCheck className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <div>
            <div className="text-sm font-bold text-ink-900">
              Deployed in 2 days
            </div>
            <div className="text-xs text-ink-400">Campus weather mesh</div>
          </div>
        </div>
      </div>

      {/* -top-9 keeps this clear of the console's "Live" pill. */}
      <div className="absolute -right-4 -top-9 hidden rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-card backdrop-blur md:block">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <IconShield className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <div>
            <div className="text-[11px] font-medium text-ink-400">
              Every kit ships
            </div>
            <div className="text-sm font-black text-ink-900">
              Bench-tested
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
