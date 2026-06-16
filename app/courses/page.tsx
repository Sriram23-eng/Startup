import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import CoursesCatalog from "@/components/CoursesCatalog";
import { getCourses } from "@/lib/store";

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
      <section className="relative overflow-hidden border-b border-navy-700/8 bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-24 h-96 w-96 rounded-full bg-brand-400/25 blur-[130px]" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-accent/20 blur-[130px]" />
        </div>
        <div className="container-x relative grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              {liveCount} live cohorts enrolling now
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-navy-800 sm:text-5xl">
              Online classes that
              <br />
              <span className="text-gradient">build real engineers</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-700/70">
              Live, mentor-led cohorts and self-paced video courses — taught by
              practising IoT, embedded and AI engineers. Build real projects,
              not just watch videos.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              {[
                ["🎥", "Live + recorded"],
                ["🧑‍🏫", "Mentor support"],
                ["🛠", "Project-based"],
                ["🎓", "Certificate"],
              ].map(([i, t]) => (
                <span key={t} className="flex items-center gap-2 font-semibold text-navy-700/75">
                  <span className="text-lg">{i}</span> {t}
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
      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading center eyebrow="Why our classes" title="Learn by building, with people who ship" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["🧑‍🏫", "Practising engineers", "Taught by people who build & deploy IoT for a living — not just theory."],
              ["🛠", "Real projects", "Every class ends with a portfolio-worthy project you actually built."],
              ["♾️", "Lifetime access + community", "Recordings, source code, datasheets and a maker community for life."],
            ].map(([i, t, d]) => (
              <div key={t} className="rounded-2xl border border-navy-700/8 bg-brand-50/30 p-7">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-2xl shadow-sm">
                  {i}
                </div>
                <h3 className="mt-4 font-bold text-navy-800">{t}</h3>
                <p className="mt-2 text-sm text-navy-700/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
