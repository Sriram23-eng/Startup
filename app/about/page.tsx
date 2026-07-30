import type { Metadata } from "next";
import { Button } from "@/components/ui";
import AboutStory from "@/components/AboutStory";
import { IconArrow, IconCheck, IconPin } from "@/components/icons";
import { stats, partners } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Elektron Nexus — an IoT marketplace, training academy and project development lab helping students, faculty and companies build real technology.",
};

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

      {/* Story sections (shared with the home page) */}
      <AboutStory />

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
