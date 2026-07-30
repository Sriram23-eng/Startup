import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import CoursesCatalog from "@/components/CoursesCatalog";
import { getCourses } from "@/lib/store";
import {
  IconPlay,
  IconUsers,
  IconBox,
  IconAward,
  IconCap,
  IconInfinity,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Online Classes & Courses",
  description:
    "Live online cohorts and self-paced video courses in IoT, ESP32, AI/ML, LoRa, embedded systems and PCB design — taught by practising engineers.",
};

export default async function CoursesPage() {
  const courses = await getCourses();
  const liveCount = courses.filter((c) => c.mode === "Live").length;
  const nextLive = courses.find((c) => c.mode === "Live");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-drift absolute -left-20 -top-24 h-96 w-96 rounded-full bg-brand-400/22 blur-[130px]" />
          <div className="animate-drift absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-accent/18 blur-[130px] [animation-delay:-7s]" />
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_10%,black,transparent)]" />
        </div>
        <div className="container-x relative grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              {liveCount} live cohorts enrolling now
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[1.06] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
              Online classes that{" "}
              <span className="text-gradient">build real engineers</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-600">
              Live, mentor-led cohorts and self-paced video courses — taught by
              practising IoT, embedded and AI engineers. Build real projects,
              not just watch videos.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
              {[
                { Icon: IconPlay, label: "Live + recorded" },
                { Icon: IconUsers, label: "Mentor support" },
                { Icon: IconBox, label: "Project-based" },
                { Icon: IconAward, label: "Certificate" },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 font-semibold text-ink-700"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-brand-600 shadow-card">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Next live class spotlight */}
          {nextLive && (
            <div className="relative">
              <div className="absolute inset-6 -z-10 rounded-[2rem] bg-brand-500/25 blur-3xl" />
              <div className="rounded-3xl border border-white/70 bg-white/80 p-2 shadow-glow backdrop-blur-xl">
                <div className="rounded-[1.4rem] bg-navy-900 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                      NEXT LIVE COHORT
                    </span>
                    <span className="text-xs text-brand-100/50">
                      {nextLive.seatsLeft} seats left
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold">{nextLive.title}</h3>
                  <p className="mt-2 text-sm text-brand-100/65">
                    {nextLive.blurb}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    {[
                      ["🗓 Starts", nextLive.startDate ?? ""],
                      ["🕘 Schedule", nextLive.schedule ?? ""],
                      ["📚 Lessons", `${nextLive.lessons}`],
                      ["⭐ Rating", `${nextLive.rating}/5`],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10"
                      >
                        <div className="text-[11px] text-brand-100/50">{k}</div>
                        <div className="font-bold text-white">{v}</div>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#enroll"
                    className="mt-5 block rounded-xl bg-white py-3 text-center text-sm font-bold text-navy-800 transition hover:bg-brand-50"
                  >
                    Reserve your seat →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Catalogue */}
      <section className="py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Course catalogue"
            title="Find your next class"
            subtitle="Switch between live cohorts and self-paced courses, and filter by level."
          />
          <div className="mt-8">
            <CoursesCatalog courses={courses} />
          </div>
        </div>
      </section>

      {/* Why learn with us */}
      <section className="border-y border-line bg-white py-16">
        <div className="container-x">
          <SectionHeading center eyebrow="Why our classes" title="Learn by building, with people who ship" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { Icon: IconCap, title: "Practising engineers", desc: "Taught by people who build & deploy IoT for a living — not just theory." },
              { Icon: IconBox, title: "Real projects", desc: "Every class ends with a portfolio-worthy project you actually built." },
              { Icon: IconInfinity, title: "Lifetime access + community", desc: "Recordings, source code, datasheets and a maker community for life." },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-3xl border border-line bg-[#f7f9fd] p-7 lift hover:border-brand-200 hover:bg-brand-50/40 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-card transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-black tracking-tight text-ink-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
