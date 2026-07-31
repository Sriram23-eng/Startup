import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import StatementBand from "@/components/StatementBand";
import { Button } from "@/components/ui";
import {
  IconArrow,
  IconTruck,
  IconCode,
  IconShield,
  IconUsers,
  IconStar,
} from "@/components/icons";
import { sizeBands } from "@/lib/data";
import { getProjects } from "@/lib/store";
import { formatINR, formatMoney, site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoT Project Kits & Catalogue",
  description:
    "Browse ready-made IoT, embedded, LoRa, AI/ML and robotics project kits. Filter by domain, size and price.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat, q } = await searchParams;
  const projects = await getProjects();

  // Real figures only, computed from the live catalogue.
  const kitCount = projects.length;
  const fromPrice = kitCount ? Math.min(...projects.map((p) => p.price)) : 0;
  const domainCount = new Set(projects.map((p) => p.category)).size;
  const avgRating = kitCount
    ? (projects.reduce((s, p) => s + (p.rating || 0), 0) / kitCount).toFixed(1)
    : "0";

  // The kit that anchors the hero: the featured one, else the top-rated.
  const hero =
    projects.find((p) => p.featured) ??
    [...projects].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

  const included = [
    { title: "Assembled hardware", desc: "Soldered, wired and bench-tested before it ships." },
    { title: "Commented source", desc: "Firmware you can actually read and extend." },
    { title: "Circuit diagrams", desc: "Schematic, wiring and a full bill of materials." },
    { title: "Setup guide", desc: "Flash it, power it, and see output the same day." },
  ];

  return (
    <>
      {/* ============================ HERO ============================
          A pinned stage rather than a block that scrolls away: the copy
          lifts, the featured kit grows as the anchor, and a payoff line
          rises into the space the copy left. Same choreography as the home
          hero so both page openers read as one language. Desktop only —
          the un-animated state below md is the complete static hero. */}
      <section className="stage-track relative overflow-clip bg-[#f7f9fd] md:h-[200vh]">
        <div className="relative overflow-clip md:sticky md:top-16 md:flex md:h-[calc(100svh-4rem)] md:items-center">
        <div
          aria-hidden
          className="stage-ambient pointer-events-none absolute inset-0"
        >
          <div className="animate-drift absolute -left-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand-400/20 blur-[150px]" />
          <div className="animate-drift absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full bg-cyan-accent/16 blur-[140px] [animation-delay:-6s]" />
        </div>

        <div className="container-x relative grid w-full items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
          {/* Copy and payoff share a slot on desktop, so the payoff rises
              into the space the copy vacates. They stack on phones. */}
          <div className="grid">
          {/* No `animate-rise` here: it sets the `animation` shorthand too,
              and one element cannot run two — the load entrance would win
              the cascade and the scroll choreography would never apply. */}
          <div className="stage-lead md:col-start-1 md:row-start-1">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              The kit catalogue
            </div>
            <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.03em] text-balance text-ink-900 sm:text-5xl lg:text-6xl">
              Hardware that arrives{" "}
              <span className="text-gradient">ready to run</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-pretty text-ink-600">
              Every kit ships assembled, flashed and documented, so you spend
              your time building on it, not debugging it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#catalogue" size="lg">
                Browse the catalogue
                <IconArrow className="h-4 w-4" strokeWidth={2} />
              </Button>
              <Button href="/custom-project" variant="outline" size="lg">
                Request a custom build
              </Button>
            </div>

            {/* Real stats, sitting under the hero copy rather than crowding it. */}
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              <Stat value={String(kitCount)} label="Kits in stock" />
              <Stat value={formatINR(fromPrice)} label="Starting price" />
              <Stat value={`${domainCount}`} label="Domains" />
            </dl>
          </div>

          {/* The payoff — takes the copy's place as the stage resolves. */}
          <div className="stage-payoff hidden md:col-start-1 md:row-start-1 md:block md:self-center">
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-ink-900 lg:text-6xl">
              Assembled.
              <br />
              Flashed.
              <br />
              <span className="text-gradient">Documented.</span>
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-pretty text-ink-600">
              Every kit clears the same bar before it ships.
            </p>
          </div>
          </div>

          {/* Featured kit, a real product image rather than a decorative panel. */}
          {hero && (
            <div className="stage-media">
              <div className="ring-gradient group relative rounded-[1.7rem] bg-white/70 p-2 shadow-lift backdrop-blur-xl">
                <div className="overflow-hidden rounded-[1.35rem] bg-white">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={hero.image}
                      alt={hero.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-ink-900 shadow">
                      <IconStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {avgRating} average rating
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                        Featured kit
                      </div>
                      <div className="mt-1 font-bold tracking-tight text-ink-900">
                        {hero.title}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black tracking-tight text-ink-900">
                        {formatMoney(hero.price, hero.currency || "INR")}
                      </div>
                      <a
                        href={`/projects/${hero.slug}`}
                        className="text-xs font-bold text-brand-600 hover:underline"
                      >
                        View kit
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </section>

      {/* ===================== CAPABILITY STRIP ====================== */}
      <section className="border-y border-line bg-white">
        <div className="container-x grid gap-px sm:grid-cols-3 sm:divide-x sm:divide-line">
          {[
            { Icon: IconTruck, title: "Dispatch in 48 hours", desc: "Assembled and tested" },
            { Icon: IconCode, title: "Source and docs", desc: "Firmware, schematics, BOM" },
            { Icon: IconUsers, title: "Engineer on call", desc: "Support after delivery" },
          ].map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              style={{ "--i": i } as CSSProperties}
              className="seq flex items-center gap-3.5 px-2 py-6 sm:px-6"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-bold tracking-tight text-ink-900">{title}</div>
                <div className="text-sm text-ink-600">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= CATALOGUE ========================= */}
      <section id="catalogue" className="scroll-mt-20 py-16">
        <div className="container-x">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="reveal-focus text-3xl font-black tracking-tight text-balance text-ink-900 sm:text-4xl">
                Find your build
              </h2>
              <p className="mt-3 leading-relaxed text-pretty text-ink-600">
                Filter by domain, size and price. Every result ships with the
                same hardware, source and documentation.
              </p>
            </div>
            {/* Size bands as scannable pills rather than a heavy 4-card row. */}
            <div className="flex flex-wrap gap-2">
              {sizeBands.map((b) => (
                <span
                  key={b.size}
                  className="rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-700"
                >
                  {b.size}
                  <span className="ml-1.5 text-ink-400">{b.range}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <ProjectsExplorer
              projects={projects}
              initialCat={cat ?? "all"}
              initialQuery={q ?? ""}
            />
          </div>
        </div>
      </section>

      {/* ================= STATEMENT BAND (chapter break) ============= */}
      <StatementBand
        tone="dark"
        eyebrow="Built to ship"
        lineOne="Bench-tested."
        lineTwo="Field-ready."
        tiles={[
          {
            title: "Flashed and verified",
            desc: "Every board is programmed and run on our bench before it is packed.",
          },
          {
            title: "Documented to build from",
            desc: "Schematics, BOM and commented source, not a quick-start card.",
          },
          {
            title: "Backed after delivery",
            desc: "The engineer who built it answers the questions about it.",
          },
        ]}
      />

      {/* ==================== WHAT EVERY KIT HAS ===================== */}
      <section className="border-t border-line bg-white py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              In every box
            </div>
            <h2 className="reveal-focus mt-3 text-3xl font-black tracking-tight text-balance text-ink-900 sm:text-4xl">
              Nothing left for you to figure out
            </h2>
            <p className="mt-5 leading-relaxed text-pretty text-ink-600">
              A kit is only finished when it runs on your bench the way it ran on
              ours. That is the bar every order clears before it leaves.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-line bg-[#f7f9fd] px-4 py-3">
              <IconShield className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-semibold text-ink-700">
                Bench-tested before dispatch, every time
              </span>
            </div>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2">
            {included.map((it, i) => (
              <li
                key={it.title}
                style={{ "--i": i } as CSSProperties}
                className="seq relative rounded-2xl border border-line bg-[#f7f9fd] p-6 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
              >
                <span className="absolute right-5 top-5 text-4xl font-black leading-none text-ink-900/[0.06]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-bold tracking-tight text-ink-900">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{it.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =========================== CTA ============================ */}
      <section className="py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[1.8rem] bg-navy-900 px-8 py-14 text-white md:px-16">
            <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl font-black tracking-tight text-balance sm:text-4xl">
                Cannot find the exact build?
              </h2>
              <p className="mt-4 leading-relaxed text-brand-100/80">
                Send us the requirement, the budget and the deadline. You get a
                clear, milestone-based quote and full source on delivery.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/custom-project" variant="white" size="lg">
                  Start a custom build
                </Button>
                <Button href="/contact" variant="outline-light" size="lg">
                  Talk to an engineer
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-black tracking-tight text-ink-900">{value}</div>
      <div className="mt-1 text-xs font-medium text-ink-400">{label}</div>
    </div>
  );
}
