import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui";
import OrbitShowreel from "@/components/OrbitShowreel";
import StackedKits from "@/components/StackedKits";
import MediaGrid from "@/components/MediaGrid";
import ImageCollage from "@/components/ImageCollage";
import GlowButton from "@/components/GlowButton";
import AboutStory from "@/components/AboutStory";
import {
  IconArrow,
  IconAward,
  IconCheck,
  IconClock,
  IconMail,
  IconPhone,
  IconPin,
  IconStar,
} from "@/components/icons";
import { testimonials, partners } from "@/lib/data";
import { getProjects } from "@/lib/store";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Glyph = (p: { className?: string; strokeWidth?: number }) => ReactNode;

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

      {/* ============ FEATURED KITS (stacked-cards scroll) ========= */}
      <StackedKits projects={allProjects} />

      {/* ============ ABOUT STORY (moved onto the home page) ========= */}
      <AboutStory />

      {/* ==================== MEDIA GRID (catalogue) =============== */}
      <MediaGrid projects={allProjects} />

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

      {/* ============ TRUST / PARTNERS (mid-page) ==================== */}
      <section className="border-y border-line bg-white py-12">
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

      {/* ================== IMAGE COLLAGE (real builds) ============ */}
      <ImageCollage images={stripImages} />

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

      {/* ==================== AT A GLANCE (compact, end) =========== */}
      <section className="border-t border-line py-14">
        <div className="container-x">
          <div className="reveal grid gap-8 rounded-3xl border border-line bg-white p-8 shadow-card sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
            {[
              ["Founded", "2022"],
              ["Focus", "IoT · Embedded · AI"],
              ["Works with", "Students, faculty & industry"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                  {k}
                </div>
                <div className="mt-1.5 text-lg font-black tracking-tight text-ink-900">
                  {v}
                </div>
              </div>
            ))}
            <div className="flex items-start gap-3 rounded-2xl bg-brand-50/70 p-4">
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
                  <GlowButton href="/custom-project">
                    Request custom project
                  </GlowButton>
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

