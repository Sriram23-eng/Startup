import Link from "next/link";
import { Button } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { workshopTracks } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  Home-page workshops section. Argues *why* to join rather than       */
/*  listing programs — the catalogue lives on /workshops and the four   */
/*  format pages, linked at the foot of this section.                   */
/*                                                                      */
/*  Deliberately not another bordered card grid: AboutStory already     */
/*  runs one directly above this on the home page, so the reasons here  */
/*  use hairline rules and open space instead.                          */
/* ------------------------------------------------------------------ */
const reasons: { title: string; desc: string }[] = [
  {
    title: "Hands-on from day one",
    desc: "Work with real hardware, sensors, development boards and professional tools — not simulations.",
  },
  {
    title: "Project-first learning",
    desc: "Every workshop is built around a real application that solves a practical engineering problem.",
  },
  {
    title: "Industry-relevant curriculum",
    desc: "Technologies companies use today: ESP32, STM32, Raspberry Pi, ROS 2, AI, PCB design and industrial IoT.",
  },
  {
    title: "Learn from practicing engineers",
    desc: "Train with professionals who design, build and deploy embedded systems — not just teach them.",
  },
  {
    title: "Complete learning resources",
    desc: "Source code, circuit diagrams, documentation, design files and reference material for every project.",
  },
  {
    title: "Beyond the classroom",
    desc: "Community support, project guidance and technical help continue long after the workshop ends.",
  },
];

export default function Workshops() {
  return (
    <section className="border-y border-line bg-white py-20 lg:py-24">
      <div className="container-x">
        {/* ---------------- Intro ---------------- */}
        <div className="reveal grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              Workshops &amp; bootcamps
            </div>
            <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl lg:text-[2.7rem]">
              Learn by building.
              <br className="hidden sm:block" /> Master by doing.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-pretty text-ink-700">
              Great engineers aren’t created by watching videos — they’re shaped
              by solving real problems.
            </p>
            <p className="mt-4 leading-relaxed text-pretty text-ink-600">
              Our workshops and bootcamps are designed around practical
              learning. Every session pairs theory with hands-on
              implementation, so you build, test, debug and deploy real
              engineering solutions on industry-standard hardware.
            </p>
            <p className="mt-4 leading-relaxed text-pretty text-ink-600">
              Whether you’re taking your first steps into embedded systems or
              advancing your expertise in IoT, AI, robotics or PCB design,
              you’ll leave with skills and projects you can confidently show.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/workshops" size="lg">
                Explore workshops
                <IconArrow className="h-4 w-4" strokeWidth={2} />
              </Button>
              <Button href="/workshops/offline" variant="outline" size="lg">
                Book for your campus
              </Button>
            </div>
          </div>
        </div>

        {/* ---------------- Guiding principle ---------------- */}
        <figure className="reveal-late mt-16 border-y border-line py-10 text-center lg:mt-20 lg:py-12">
          <blockquote className="mx-auto max-w-3xl text-[1.6rem] font-black leading-[1.15] tracking-[-0.02em] text-balance text-ink-900 sm:text-3xl lg:text-[2.1rem]">
            “Real engineering begins when{" "}
            <span className="text-gradient">theory meets hardware</span>.”
          </blockquote>
          <figcaption className="mt-4 text-sm text-ink-400">
            The principle behind every workshop we deliver.
          </figcaption>
        </figure>

        {/* ---------------- Why learners choose us ---------------- */}
        <div className="reveal-late mt-16 lg:mt-20">
          <h3 className="text-xl font-black tracking-tight text-ink-900">
            Why learners choose our workshops
          </h3>

          <ol className="mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <li key={r.title} className="border-t border-line pt-5">
                <div className="text-xs font-black tracking-[0.14em] text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="mt-3 text-[17px] font-bold tracking-tight text-ink-900">
                  {r.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {r.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* ---------------- Formats ---------------- */}
        <div className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-7">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">
            Delivered as
          </span>
          {workshopTracks.map((t) => (
            <Link
              key={t.slug}
              href={`/workshops/${t.slug}`}
              className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
