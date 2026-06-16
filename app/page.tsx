import Link from "next/link";
import { Badge, Button, SectionHeading, Card } from "@/components/ui";
import ProjectCard from "@/components/ProjectCard";
import {
  categories,
  workshops,
  testimonials,
  partners,
  stats,
} from "@/lib/data";
import { getProjects, getCourses } from "@/lib/store";
import { formatINR } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allProjects, allCourses] = await Promise.all([
    getProjects(),
    getCourses(),
  ]);
  const featured = allProjects.slice(0, 6);
  const liveCourses = allCourses.filter((c) => c.mode === "Live").slice(0, 3);

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-[#f7f9fd]">
        {/* Ambient premium glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-400/25 blur-[130px]" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-accent/20 blur-[130px]" />
          <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-brand-600/15 blur-[120px]" />
          <div className="grid-dots absolute inset-0 opacity-40 [mask-image:radial-gradient(75%_60%_at_50%_25%,black,transparent)]" />
        </div>

        <div className="container-x relative grid items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="animate-rise">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-navy-700/10 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-navy-700/80 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              IoT Marketplace · Academy · Project Lab
            </div>

            <h1 className="mt-6 text-[2.7rem] font-black leading-[1.03] tracking-tight text-navy-800 sm:text-6xl">
              Build, learn &amp; ship
              <br />
              <span className="text-gradient">real-world IoT</span>
              <span className="text-navy-800"> — end to end.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-700/70">
              Ready-made project kits, custom engineering development, and
              hands-on workshops &amp; internships. From a first Arduino blink to
              a multi-km LoRa deployment — we’ve got the hardware, code and
              people.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/projects" size="lg">
                Explore Projects →
              </Button>
              <Button href="/custom-project" variant="white" size="lg">
                Request Custom Project
              </Button>
              <Button href="/workshops" variant="outline" size="lg">
                Book a Workshop
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-7 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  "from-brand-500 to-brand-700",
                  "from-cyan-accent to-brand-500",
                  "from-navy-700 to-navy-900",
                  "from-emerald-400 to-emerald-600",
                ].map((g, i) => (
                  <span
                    key={i}
                    className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${g} text-xs font-bold text-white ring-2 ring-[#f7f9fd]`}
                  >
                    {["A", "S", "R", "K"][i]}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-amber-500">
                  ★★★★★{" "}
                  <span className="font-bold text-navy-800">4.9/5</span>
                </div>
                <div className="text-xs text-navy-700/55">
                  Loved by 9,200+ students &amp; teams
                </div>
              </div>
            </div>

            {/* Stats with dividers */}
            <div className="mt-10 grid max-w-xl grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-navy-700/10">
              {stats.map((s, i) => (
                <div key={s.label} className={i > 0 ? "sm:pl-5" : ""}>
                  <div className="text-2xl font-black text-navy-800">
                    {s.value}
                  </div>
                  <div className="text-xs font-medium text-navy-700/50">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-rise [animation-delay:120ms]">
            {/* soft glow under the device */}
            <div className="absolute inset-6 -z-10 rounded-[2rem] bg-brand-500/30 blur-3xl" />

            <div className="animate-floaty rounded-[1.75rem] border border-white/70 bg-white/60 p-2.5 shadow-glow backdrop-blur-xl">
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

                  <div className="mt-5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-accent">
                      field-node-07
                    </span>
                    <span className="flex items-end gap-0.5">
                      {[6, 9, 12, 8].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}px` }}
                          className="w-1 rounded-sm bg-cyan-accent/80"
                        />
                      ))}
                      <span className="ml-1.5 text-brand-100/50">
                        LoRa · −94 dBm
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ["Soil moisture", "38%"],
                      ["Air temp", "29.4°C"],
                      ["Humidity", "61%"],
                      ["Battery", "4.02 V"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10"
                      >
                        <div className="text-[11px] text-brand-100/50">{k}</div>
                        <div className="text-lg font-bold text-white">{v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-end gap-1.5">
                    {[40, 65, 52, 78, 60, 90, 72, 84, 58, 96, 70, 82].map(
                      (h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="h-16 flex-1 rounded-t bg-gradient-to-t from-brand-600 to-cyan-accent"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* floating chip — bottom left */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/70 bg-white/95 p-4 shadow-card backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-lg">
                  ✓
                </span>
                <div>
                  <div className="text-sm font-bold text-navy-800">
                    Deployed in 2 days
                  </div>
                  <div className="text-xs text-navy-700/50">
                    Campus weather mesh
                  </div>
                </div>
              </div>
            </div>

            {/* floating chip — top right */}
            <div className="absolute -right-3 -top-4 hidden rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-card backdrop-blur md:block">
              <div className="text-[11px] font-medium text-navy-700/50">
                Crop yield
              </div>
              <div className="flex items-center gap-1.5 text-lg font-black text-navy-800">
                <span className="text-emerald-500">▲</span> +12.4%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== TRUST / PARTNERS ====================== */}
      <section className="border-y border-navy-700/8 bg-white py-8">
        <div className="container-x">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-navy-700/40">
            Trusted by students, faculty & engineers at
          </p>
          <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="flex w-max animate-marquee gap-12">
              {[...partners, ...partners].map((p, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap text-lg font-bold text-navy-700/30"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= CATEGORIES ========================= */}
      <section className="py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Browse by domain"
              title="Every engineering domain, one platform"
              subtitle="11 specialisations spanning hardware, firmware, connectivity and intelligence."
            />
            <Button href="/projects" variant="outline">
              All projects →
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/projects?cat=${c.slug}`}
                className="group rounded-2xl border border-navy-700/8 bg-white p-5 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-card"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl transition group-hover:bg-brand-600">
                  <span className="transition group-hover:scale-110">
                    {c.icon}
                  </span>
                </div>
                <div className="mt-4 font-bold text-navy-800">{c.name}</div>
                <div className="mt-1 text-sm text-navy-700/55">{c.blurb}</div>
              </Link>
            ))}
            <div className="flex flex-col justify-center rounded-2xl bg-navy-800 p-5 text-white">
              <div className="text-2xl">✨</div>
              <div className="mt-3 font-bold">Need something custom?</div>
              <Link
                href="/custom-project"
                className="mt-1 text-sm font-semibold text-cyan-accent hover:underline"
              >
                Tell us your idea →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== FEATURED PROJECTS ===================== */}
      <section className="bg-white py-20">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Ready-made kits"
            title="Featured project kits"
            subtitle="Hardware + source code + documentation + circuit diagrams + setup guide. Order today, build this weekend."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/projects" size="lg">
              Browse all kits →
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== TWO PATHS (CUSTOM) ==================== */}
      <section className="py-20">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <PathCard
            tone="light"
            badge="Path A"
            title="Buy a ready-made kit"
            desc="Complete kits with hardware, source code, docs, circuit diagrams and setup guides — shipped to your door."
            points={["Same-week dispatch", "Full documentation", "Demo video included", "Email + WhatsApp support"]}
            cta={{ label: "Shop kits", href: "/projects" }}
          />
          <PathCard
            tone="dark"
            badge="Path B"
            title="Get a custom project built"
            desc="Submit requirements, get a quotation, and our team designs & delivers exactly what you need — academic or commercial."
            points={["IoT · Embedded · LoRa · AI/ML", "Transparent quotation", "Milestone-based delivery", "IP & docs handed over"]}
            cta={{ label: "Request a quote", href: "/custom-project" }}
          />
        </div>
      </section>

      {/* ========================= WORKSHOPS ========================= */}
      <section className="relative overflow-hidden bg-navy-900 py-20 text-white">
        <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              light
              eyebrow="Workshops & training"
              title="Hands-on programs that actually build skills"
              subtitle="Bootcamps, FDPs, internships and corporate training — online, offline or on-site at your campus."
            />
            <Button href="/workshops" variant="white">
              All programs →
            </Button>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workshops.map((w) => (
              <Link
                key={w.slug}
                href={`/workshops#${w.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cyan-accent/15 px-2.5 py-1 text-[11px] font-bold text-cyan-accent">
                    {w.mode}
                  </span>
                  <span className="text-xs text-brand-100/50">{w.level}</span>
                </div>
                <h3 className="mt-4 font-bold leading-snug text-white">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm text-brand-100/60">{w.duration}</p>
                <div className="mt-4 text-sm font-semibold text-cyan-accent">
                  From ₹{w.priceFrom.toLocaleString("en-IN")} · book →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= ONLINE CLASSES ====================== */}
      <section className="bg-white py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Online classes"
              title="Learn live — or at your own pace"
              subtitle="Mentor-led cohorts and self-paced video courses by practising engineers. Build real projects, earn a certificate."
            />
            <Button href="/courses" variant="outline">
              All courses →
            </Button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {liveCourses.map((c) => (
              <Link
                key={c.slug}
                href="/courses#enroll"
                className="group flex flex-col rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    LIVE
                  </span>
                  <span className="text-xs font-semibold text-navy-700/45">
                    {c.level}
                  </span>
                </div>
                <h3 className="mt-4 font-bold leading-snug text-navy-800 group-hover:text-brand-700">
                  {c.title}
                </h3>
                <div className="mt-2 text-sm text-navy-700/60">
                  🗓 Starts {c.startDate} · {c.schedule}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-navy-700/8 pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-navy-800">
                      {formatINR(c.price)}
                    </span>
                    {c.oldPrice && (
                      <span className="text-sm text-navy-700/40 line-through">
                        {formatINR(c.oldPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-red-500">
                    {c.seatsLeft} seats left
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= INTERNSHIPS ======================= */}
      <section className="py-20">
        <div className="container-x">
          <Card className="overflow-hidden">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <Badge tone="cyan">Internship Portal</Badge>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-800">
                  Industry internships with real deliverables
                </h2>
                <p className="mt-4 text-navy-700/70">
                  Apply, get matched to a live project, track your status, and
                  download a verifiable offer letter & certificate — all from
                  your student dashboard.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/internships">Apply now</Button>
                  <Button href="/learn#verify" variant="outline">
                    Verify a certificate
                  </Button>
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  ["1", "Apply online", "Pick a domain & submit your profile"],
                  ["2", "Get matched", "Work on a live IoT / AI project"],
                  ["3", "Track & submit", "Milestones in your dashboard"],
                  ["4", "Earn certificate", "Verifiable offer letter & cert"],
                ].map(([n, t, d]) => (
                  <div
                    key={n}
                    className="flex items-start gap-4 rounded-xl border border-navy-700/8 bg-brand-50/40 p-4"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                      {n}
                    </span>
                    <div>
                      <div className="font-bold text-navy-800">{t}</div>
                      <div className="text-sm text-navy-700/60">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================= */}
      <section className="bg-white py-20">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Success stories"
            title="Loved by colleges & companies"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-navy-700/8 bg-brand-50/30 p-7"
              >
                <div className="text-2xl text-brand-300">“</div>
                <blockquote className="flex-1 text-navy-700/80">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 border-t border-navy-700/10 pt-4">
                  <div className="font-bold text-navy-800">{t.name}</div>
                  <div className="text-sm text-navy-700/55">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== CTA ============================= */}
      <section className="py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-10 text-center text-white md:p-16">
            <div className="mesh pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Have an idea? Let’s build it together.
              </h2>
              <p className="mt-4 text-brand-100/80">
                Whether you need a kit by Friday or a full custom system, our
                engineers are one message away.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/custom-project" variant="white" size="lg">
                  Request custom project
                </Button>
                <Button href="/projects" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Explore kits
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PathCard({
  tone,
  badge,
  title,
  desc,
  points,
  cta,
}: {
  tone: "light" | "dark";
  badge: string;
  title: string;
  desc: string;
  points: string[];
  cta: { label: string; href: string };
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 md:p-10 ${
        dark
          ? "bg-navy-800 text-white"
          : "border border-navy-700/8 bg-white text-navy-800"
      }`}
    >
      {dark && <div className="mesh pointer-events-none absolute inset-0 opacity-40" />}
      <div className="relative">
        <span
          className={`text-xs font-bold uppercase tracking-widest ${
            dark ? "text-cyan-accent" : "text-brand-600"
          }`}
        >
          {badge}
        </span>
        <h3 className="mt-3 text-2xl font-extrabold">{title}</h3>
        <p className={`mt-3 ${dark ? "text-brand-100/75" : "text-navy-700/65"}`}>
          {desc}
        </p>
        <ul className="mt-6 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-3 text-sm font-medium">
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${
                  dark ? "bg-cyan-accent/20 text-cyan-accent" : "bg-brand-100 text-brand-700"
                }`}
              >
                ✓
              </span>
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button href={cta.href} variant={dark ? "white" : "primary"}>
            {cta.label} →
          </Button>
        </div>
      </div>
    </div>
  );
}
