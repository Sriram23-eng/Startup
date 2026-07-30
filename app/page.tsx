import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui";
import OrbitShowreel from "@/components/OrbitShowreel";
import FeaturedSlider from "@/components/FeaturedSlider";
import AboutStory from "@/components/AboutStory";
import DotField from "@/components/DotField";
import { LogoMark } from "@/components/Logo";
import {
  IconArrow,
  IconAward,
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
  IconSparkle,
  IconStar,
  IconTruck,
  IconUsers,
} from "@/components/icons";
import {
  testimonials,
  partners,
  stats,
} from "@/lib/data";
import { getProjects } from "@/lib/store";
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
  const allProjects = await getProjects();
  const fromPrice = allProjects.length
    ? Math.min(...allProjects.map((p) => p.price))
    : 0;

  // Photos for the Orbit hero filmstrip: real catalogue images, plus a few
  // curated electronics shots so the strip is always full and on-brand.
  const stripImages = [
    ...allProjects.map((p) => p.image).filter(Boolean),
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=400&q=70",
  ].slice(0, 14);

  return (
    <>
      {/* ==================== HERO (Orbit showreel) ================== */}
      <OrbitShowreel images={stripImages} />

      {/* ================= FEATURE QUICK-NAV (OPPO-style) ============= */}
      <nav className="sticky top-16 z-30 border-b border-line bg-[#f6f8f7]/85 backdrop-blur-xl">
        <div className="container-x flex items-center gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            ["Ready-made kits", "/projects"],
            ["Custom builds", "#paths"],
            ["Courses", "/courses"],
            ["Internships", "#internships"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-line-strong bg-white px-4 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ====================== TRUST / PARTNERS ====================== */}
      <section className="border-b border-line bg-white py-10">
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

      {/* ==================== ABOUT INTRO (who we are) =============== */}
      <section id="who-we-are" className="relative overflow-hidden scroll-mt-24 py-20 lg:py-24">
        <DotField className="inset-y-0 right-0 hidden w-1/2 lg:block" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div className="reveal">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              Who we are
            </div>
            <h2 className="mt-3 text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl lg:text-[2.7rem]">
              We help people <span className="text-gradient">build the future</span>,
              one project at a time.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-600">
              Elektron Nexus is an IoT marketplace, training academy and
              project-development lab. We exist to close the gap between
              classroom theory and real, deployable engineering, for students,
              faculty and companies alike.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/custom-project" size="lg">
                Work with us
                <IconArrow className="h-4 w-4" strokeWidth={2} />
              </Button>
              <Button href="/contact" variant="white" size="lg">
                Get in touch
              </Button>
            </div>
          </div>

          {/* At-a-glance panel */}
          <div className="reveal-late rounded-3xl border border-line bg-white p-7 shadow-card">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              At a glance
            </div>
            <dl className="mt-5 divide-y divide-line">
              {[
                ["Founded", "2022"],
                ["Based in", site.city],
                ["Focus", "IoT · Embedded · AI"],
                ["Works with", "Students, faculty & industry"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 py-3.5"
                >
                  <dt className="text-sm font-medium text-ink-400">{k}</dt>
                  <dd className="text-right text-sm font-bold text-ink-900">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-brand-50/70 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                <IconCheck className="h-4 w-4" strokeWidth={2.6} />
              </span>
              <p className="text-sm leading-relaxed text-ink-600">
                Every custom project ships with source, schematics and full IP
                transfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED SLIDER (numbered pagination) ========= */}
      <FeaturedSlider projects={allProjects} />

      {/* ========================= THREE PATHS ======================== */}
      {/* Moved up from the middle of the page: a visitor arriving from
          "IoT marketplace + academy + lab" needs routing before catalogue. */}
      <section id="paths" className="scroll-mt-28 py-24 lg:py-28">
        <div className="container-x">
          <Head
            eyebrow="Where do you start?"
            title="Three ways to work with us"
            subtitle="Buy something that already works, commission something that doesn’t exist yet, or learn to build it yourself."
          />

          <div className="reveal-late mt-11 grid gap-5 lg:grid-cols-12">
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

      {/* ============ ABOUT STORY (moved onto the home page) ========= */}
      <AboutStory />

      {/* =================== LOGO REVEAL (brand moment) ============== */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="mesh absolute inset-0 opacity-20" />
          <div className="grid-lines absolute inset-0 opacity-[0.1]" />
        </div>

        <div className="container-x relative flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-brand-100/40">
          <span>Elektron Nexus</span>
          <span className="hidden sm:inline">Playground / 01</span>
          <span>Est. 2022</span>
        </div>

        <div className="reveal relative flex flex-col items-center py-14 text-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 animate-pulse rounded-full bg-brand-500/25 blur-3xl"
            />
            <LogoMark className="h-28 w-28 text-brand-400 sm:h-40 sm:w-40" />
          </div>
          <div className="mt-7 text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Elektron <span className="text-brand-400">Nexus</span>
          </div>
          <div className="mt-2.5 text-xs font-bold uppercase tracking-[0.3em] text-brand-100/50">
            Core Electronics Hub
          </div>
        </div>

        <div className="container-x relative flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-brand-100/40">
          <span>IoT · Embedded · AI</span>
          <span className="hidden sm:inline">Marketplace · Academy · Lab</span>
          <span>Hyderabad</span>
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

          <ol className="reveal-late relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
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

      {/* ==================== PROJECT GALLERY GRID ================== */}
      <section className="border-y border-line bg-white py-20 lg:py-24">
        <div className="container-x">
          <Head
            center
            eyebrow="The catalogue"
            title="A build for every domain"
            subtitle="From a first Arduino blink to a multi-kilometre LoRa deployment."
          />
          <div className="reveal-late mt-11 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {allProjects.slice(0, 9).map((p, idx) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className={`group relative aspect-[4/3] overflow-hidden rounded-2xl ${
                  idx === 4
                    ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-white"
                    : ""
                }`}
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-3 bottom-3 translate-y-1 text-sm font-bold text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  {p.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= INTERNSHIPS ======================= */}
      <section id="internships" className="scroll-mt-28 py-24 lg:py-28">
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

      {/* ==================== FULL-BLEED IMAGE BAND ================= */}
      <section className="relative h-[60vh] min-h-[26rem] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=2000&q=72"
          alt="Electronics workbench"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/65" />
        <div className="mesh pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative flex h-full items-center">
          <div className="container-x text-white">
            <div className="reveal max-w-2xl">
              <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.02em] text-balance sm:text-6xl">
                From breadboard to field deployment
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-brand-100/80">
                Every kit is built, flashed and bench-tested, then documented so
                you can take it live.
              </p>
              <div className="mt-7">
                <Button href="/projects" size="lg">
                  Explore the catalogue
                  <IconArrow className="h-4 w-4" strokeWidth={2} />
                </Button>
              </div>
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
      className={`reveal ${
        center
          ? "mx-auto max-w-3xl text-center"
          : "flex flex-wrap items-end justify-between gap-5"
      }`}
    >
      <div className={center ? "" : "max-w-2xl"}>
        <div className="mb-3.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          {eyebrow}
        </div>
        <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl lg:text-[2.9rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-600">
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

