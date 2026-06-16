import type { Metadata } from "next";
import { Badge, Button, SectionHeading } from "@/components/ui";
import { stats, partners } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MS Project & Tech Solution — an IoT marketplace, training academy and project development lab helping students, faculty and companies build real technology.",
};

const values = [
  ["🎯", "Build real things", "Every kit, course and project ends in something that actually works in the field — not a toy demo."],
  ["🤝", "Teach by doing", "We learned by building, and that’s how we teach. Hands-on, mentor-led, project-first."],
  ["🔍", "Radical transparency", "Clear quotes, honest timelines, and full handover of code, docs and IP."],
  ["♾️", "Lifelong support", "Communities, recordings and source code that stay with you for good."],
];

const timeline = [
  ["2022", "Started as a campus project lab", "Helping final-year students ship working IoT projects."],
  ["2023", "Launched ready-made kits", "Packaged our most-requested builds into documented kits."],
  ["2024", "Training academy & internships", "Workshops, FDPs and mentor-led internships across colleges."],
  ["2026", "Full platform", "Marketplace + academy + project lab + LMS in one place."],
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-navy-700/8 bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-24 h-96 w-96 rounded-full bg-brand-400/20 blur-[130px]" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-accent/20 blur-[130px]" />
        </div>
        <div className="container-x relative py-16">
          <div className="max-w-3xl">
            <Badge tone="brand">About us</Badge>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-navy-800 sm:text-5xl">
              We help people{" "}
              <span className="text-gradient">build the future</span>, one project
              at a time.
            </h1>
            <p className="mt-5 text-lg text-navy-700/70">
              MS Project &amp; Tech Solution is an IoT marketplace, training
              academy and project-development lab. We bridge the gap between
              classroom theory and real, deployable engineering — for students,
              faculty and companies alike.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/custom-project" size="lg">
                Work with us
              </Button>
              <Button href="/contact" variant="white" size="lg">
                Get in touch
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-navy-700/8 bg-white py-12">
        <div className="container-x grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-navy-800 sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-navy-700/55">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Our mission"
              title="Make world-class engineering accessible"
            />
            <p className="mt-5 text-navy-700/70">
              Too many brilliant ideas die on a breadboard. We exist to carry
              them across the line — with the right hardware, clean code, clear
              documentation and people who’ve done it before.
            </p>
            <p className="mt-4 text-navy-700/70">
              Whether you’re a student shipping a final-year project, a college
              upskilling its faculty, or a company prototyping a product, we give
              you the kit, the knowledge and the team to make it real.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map(([i, t, d]) => (
              <div
                key={t}
                className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card"
              >
                <div className="text-2xl">{i}</div>
                <h3 className="mt-3 font-bold text-navy-800">{t}</h3>
                <p className="mt-1.5 text-sm text-navy-700/60">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading center eyebrow="Our journey" title="From a campus lab to a full platform" />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {timeline.map(([y, t, d], i) => (
              <div key={y} className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <span className="text-lg font-black text-navy-800">{y}</span>
                </div>
                <h3 className="mt-4 font-bold text-navy-800">{t}</h3>
                <p className="mt-1.5 text-sm text-navy-700/60">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16">
        <div className="container-x text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-700/40">
            Trusted across 60+ campuses & companies
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map((p) => (
              <span key={p} className="text-lg font-bold text-navy-700/35">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-10 text-center text-white md:p-14">
            <div className="mesh pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Let’s build something together
              </h2>
              <p className="mt-3 text-brand-100/80">
                Kits, custom builds, training or internships — we’re one message
                away.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button href="/contact" variant="white" size="lg">
                  Contact us
                </Button>
                <Button
                  href="/projects"
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
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
