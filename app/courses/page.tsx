import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import PageHero from "@/components/PageHero";
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
      <PageHero
        eyebrow={`${liveCount} live cohorts enrolling now`}
        title={
          <>
            Online classes that{" "}
            <span className="text-gradient-light">build real engineers</span>
          </>
        }
        subtitle="Live, mentor-led cohorts and self-paced video courses, taught by practising IoT, embedded and AI engineers. Build real projects, not just watch videos."
        actions={
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {[
              { Icon: IconPlay, label: "Live + recorded" },
              { Icon: IconUsers, label: "Mentor support" },
              { Icon: IconBox, label: "Project-based" },
              { Icon: IconAward, label: "Certificate" },
            ].map(({ Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 font-semibold text-brand-100/90"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-cyan-accent ring-1 ring-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </span>
            ))}
          </div>
        }
        aside={
          nextLive ? (
            <div className="ring-gradient rounded-3xl bg-white/[0.04] p-2 backdrop-blur">
              <div className="rounded-[1.4rem] bg-navy-800 p-6 text-white ring-1 ring-white/5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    NEXT LIVE COHORT
                  </span>
                  <span className="text-xs text-brand-100/50">
                    {nextLive.seatsLeft} seats left
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black tracking-tight">{nextLive.title}</h3>
                <p className="mt-2 text-sm text-brand-100/65">{nextLive.blurb}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Starts", nextLive.startDate ?? ""],
                    ["Schedule", nextLive.schedule ?? ""],
                    ["Lessons", `${nextLive.lessons}`],
                    ["Rating", `${nextLive.rating}/5`],
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
                  className="mt-5 block rounded-xl bg-white py-3 text-center text-sm font-bold text-ink-900 transition hover:bg-brand-50"
                >
                  Reserve your seat →
                </a>
              </div>
            </div>
          ) : undefined
        }
      />

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
