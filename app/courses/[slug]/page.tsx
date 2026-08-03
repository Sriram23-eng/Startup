import type { Metadata } from "next";
import type { ComponentType, CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { categoryName } from "@/lib/data";
import { getCourses, getCourseBySlug } from "@/lib/store";
import { getCourseOutline } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth";
import { getEnrollment } from "@/lib/accounts";
import { canSeePrices } from "@/lib/pricing";
import { Button, SectionHeading } from "@/components/ui";
import CourseEnroll, { type EnrollStatus } from "@/components/CourseEnroll";
import {
  IconStar,
  IconUsers,
  IconBook,
  IconClock,
  IconCap,
  IconBox,
  IconChip,
  IconAward,
  IconPlay,
  IconInfinity,
  IconCheck,
  IconCode,
  IconBrain,
  IconArrow,
} from "@/components/icons";

// Reads the session cookie (price gate + enrollment state), so this page must
// never be prerendered — a cached copy would serve one visitor's state to all.
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */

const BAND_ORDER = ["Beginner", "Intermediate", "Advanced", "Projects"];

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

const KINDS: Record<string, { Icon: Icon; label: string }> = {
  topic: { Icon: IconBook, label: "Lesson" },
  practical: { Icon: IconChip, label: "Hands-on" },
  project: { Icon: IconBox, label: "Project" },
};

/**
 * The course-content tables live only in Postgres — `lib/content.ts` has no
 * JSON fallback, unlike the rest of the store. This page is public, so a
 * database that is unset or briefly unreachable must not take it down; the
 * syllabus below falls back to the course's own topic list instead.
 */
async function courseOutline(slug: string) {
  try {
    return await getCourseOutline(slug);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.blurb,
    openGraph: { images: [course.image] },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  // `canSeePrices` reads the same React-cached session as `getCurrentUser`,
  // so these three share one database round-trip for the user.
  const [outline, showPrices, user] = await Promise.all([
    courseOutline(slug),
    canSeePrices(),
    getCurrentUser(),
  ]);
  const enrollment = user ? await getEnrollment(user.id, slug) : null;
  const signedIn = Boolean(user);

  const live = course.mode === "Live";
  const highlights = course.highlights ?? [];
  const syllabus = course.topics ?? [];

  const moduleCount = outline.length;
  const topicCount = outline.reduce((n, m) => n + m.topics.length, 0);
  const hasSyllabus = moduleCount > 0 || syllabus.length > 0;

  // Shown in place of the syllabus while signed out — how much there is, but
  // not what it is. This page is a server component, so the locked branch
  // simply never renders the titles; they are not in the payload to be read.
  const syllabusSize =
    moduleCount > 0
      ? `${moduleCount} module${moduleCount === 1 ? "" : "s"} · ${topicCount} lesson${
          topicCount === 1 ? "" : "s"
        }`
      : `${syllabus.length} topic${syllabus.length === 1 ? "" : "s"}`;

  // Known bands first, then any custom band an admin has used — grouping by a
  // fixed list alone would silently hide those modules from the syllabus.
  const bands = [
    ...BAND_ORDER,
    ...outline.map((m) => m.band).filter((b) => !BAND_ORDER.includes(b)),
  ];
  const byBand = [...new Set(bands)]
    .map((band) => ({ band, modules: outline.filter((m) => m.band === band) }))
    .filter((g) => g.modules.length > 0);

  const others = (await getCourses()).filter((c) => c.slug !== slug).slice(0, 3);

  const included: { Icon: Icon; title: string; desc: string }[] = [
    live
      ? {
          Icon: IconPlay,
          title: "Live sessions + recordings",
          desc: "Attend live with the cohort, and rewatch every session afterwards.",
        }
      : {
          Icon: IconPlay,
          title: "Recorded video lessons",
          desc: "Work through every lesson at your own pace, whenever it suits you.",
        },
    {
      Icon: IconBrain,
      title: "AI tutor for this course",
      desc: "Ask questions beside the lesson you're on and get answers grounded in it.",
    },
    {
      Icon: IconCode,
      title: "Source code & wiring diagrams",
      desc: "Every sketch, schematic and datasheet used in the course, yours to keep.",
    },
    {
      Icon: IconUsers,
      title: "Mentor support",
      desc: "Practising engineers you can bring a stuck build to.",
    },
    {
      Icon: IconAward,
      title: "Certificate on completion",
      desc: "A verifiable certificate once you finish the course.",
    },
    {
      Icon: IconInfinity,
      title: "Lifetime access",
      desc: "Come back to the material and the community for as long as you like.",
    },
  ];

  const status: EnrollStatus = (enrollment?.status as EnrollStatus) ?? "none";

  return (
    <>
      {/* ---------------- Top: the course + the enroll option ----------------
          Dark cinematic opener in the same language as PageHero, with the
          course's own photo behind it — so each course page reads as itself
          rather than as one more instance of a template. */}
      <section className="relative overflow-clip bg-navy-950 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src={course.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.18]"
          />
          {/* Two gradients, not one: the horizontal keeps the headline column
              readable over any photo, the vertical seats the section on the
              page. Without both, a busy image eats the type. */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/92 to-navy-950/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70" />
          <div className="mesh absolute inset-0 opacity-50" />
          <div className="animate-drift absolute -left-40 -top-44 h-[34rem] w-[34rem] rounded-full bg-brand-500/20 blur-[150px]" />
          <div className="animate-drift absolute -right-28 top-10 h-[28rem] w-[28rem] rounded-full bg-cyan-accent/14 blur-[150px] [animation-delay:-6s]" />
          <div className="grid-lines absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(80%_60%_at_50%_20%,black,transparent)]" />
        </div>

        <div className="container-x relative pb-16 pt-8 lg:pb-20">
          <nav className="text-sm text-brand-100/45">
            <Link href="/" className="transition-colors hover:text-cyan-accent">
              Home
            </Link>
            <span className="px-2">/</span>
            <Link href="/courses" className="transition-colors hover:text-cyan-accent">
              Courses
            </Link>
            <span className="px-2">/</span>
            <span className="text-brand-100/80">{course.title}</span>
          </nav>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <div className="animate-rise flex flex-wrap items-center gap-2">
                {live ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-[11px] font-bold text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    LIVE COHORT
                  </span>
                ) : (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white ring-1 ring-white/15">
                    Self-paced
                  </span>
                )}
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-cyan-accent ring-1 ring-white/10">
                  {categoryName(course.category)}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-brand-100/70 ring-1 ring-white/10">
                  {course.level}
                </span>
              </div>

              <h1 className="animate-rise mt-5 text-[2.1rem] font-black leading-[1.06] tracking-[-0.03em] text-balance sm:text-5xl [animation-delay:60ms]">
                {course.title}
              </h1>
              <p className="animate-rise mt-5 max-w-xl text-lg leading-relaxed text-brand-100/70 [animation-delay:120ms]">
                {course.blurb}
              </p>

              <div className="animate-rise mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 [animation-delay:180ms]">
                {[
                  { Icon: IconStar, k: "Rating", v: `${course.rating}` },
                  { Icon: IconBook, k: "Lessons", v: `${topicCount || course.lessons}` },
                  { Icon: IconClock, k: "Hours", v: `${course.hours}` },
                  {
                    Icon: IconUsers,
                    k: "Learners",
                    v: course.learners.toLocaleString("en-IN"),
                  },
                ].map(({ Icon, k, v }) => (
                  <div
                    key={k}
                    className="rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/10 backdrop-blur-sm"
                  >
                    <Icon className="h-4 w-4 text-cyan-accent" />
                    <div className="mt-2.5 text-xl font-black leading-none text-white">
                      {v}
                    </div>
                    <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-100/45">
                      {k}
                    </div>
                  </div>
                ))}
              </div>

              <div className="animate-rise mt-6 flex items-center gap-2.5 text-sm text-brand-100/60 [animation-delay:220ms]">
                <IconCap className="h-4 w-4 text-brand-100/40" />
                Taught by{" "}
                <span className="font-semibold text-white">{course.instructor}</span>
              </div>
            </div>

            {/* The reserve panel — top of the page, beside the course it belongs
                to. White on the dark backdrop so it carries the most weight
                on the page, which is what it should. */}
            <div className="animate-rise [animation-delay:240ms]">
              <div className="ring-gradient rounded-[1.9rem] bg-white/[0.06] p-2 backdrop-blur">
                <CourseEnroll
                  courseSlug={course.slug}
                  live={live}
                  price={showPrices ? course.price : null}
                  oldPrice={showPrices ? course.oldPrice ?? null : null}
                  startDate={course.startDate ?? null}
                  schedule={course.schedule ?? null}
                  seatsLeft={course.seatsLeft ?? null}
                  signedIn={signedIn}
                  initialStatus={status}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- What you'll learn ---------------- */}
      {highlights.length > 0 && (
        <section className="border-y border-line bg-white py-14">
          <div className="container-x">
            <SectionHeading
              eyebrow="What you'll learn"
              title="By the end of this course"
            />
            <div className="reveal-late mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {highlights.map((h) => (
                <div key={h} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                    <IconCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </span>
                  <span className="leading-relaxed text-ink-700">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Course content ---------------- */}
      <section className="py-14">
        <div className="container-x">
          <SectionHeading
            eyebrow="Course content"
            title="What's inside the course"
            subtitle={
              moduleCount > 0
                ? `${moduleCount} module${moduleCount === 1 ? "" : "s"} · ${topicCount} lesson${
                    topicCount === 1 ? "" : "s"
                  } — every lesson comes with a video walkthrough, written documentation, example code and an exercise.`
                : "The syllabus this course covers, module by module."
            }
          />

          <div className="mt-8 max-w-3xl">
            {!signedIn && hasSyllabus ? (
              /* Signed out: say how much there is, not what it is. */
              <div className="rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-10">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="h-7 w-7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
                    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>
                <div className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                  {syllabusSize}
                </div>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-ink-900">
                  Sign in to see the full syllabus
                </h3>
                <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-600">
                  Create a free account to read every module and lesson in this
                  course before you reserve a seat.
                </p>
                <Button
                  href={`/login?next=/courses/${course.slug}`}
                  size="lg"
                  className="mt-6"
                >
                  Sign in to see the syllabus →
                </Button>
              </div>
            ) : byBand.length > 0 ? (
              <div className="space-y-8">
                {byBand.map((group) => (
                  <div key={group.band}>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                      {group.band}
                    </div>
                    <div className="space-y-3">
                      {group.modules.map((m, mi) => (
                        <details
                          key={m.id}
                          open={mi === 0}
                          className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-brand-50/40">
                            <span className="font-bold text-ink-900">{m.title}</span>
                            <span className="flex shrink-0 items-center gap-3">
                              <span className="text-xs font-semibold text-ink-400">
                                {m.topics.length} lesson
                                {m.topics.length === 1 ? "" : "s"}
                              </span>
                              {/* Without a marker the row gives no sign it opens
                                  — `list-none` removes the browser's triangle. */}
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden
                                className="h-4 w-4 text-ink-400 transition-transform duration-200 group-open:rotate-180"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </span>
                          </summary>
                          {m.topics.length > 0 && (
                            <ul className="border-t border-line">
                              {m.topics.map((t) => {
                                const kind = KINDS[t.kind] ?? KINDS.topic;
                                return (
                                  <li
                                    key={t.id}
                                    className="flex items-center gap-3 border-b border-line px-5 py-3 transition-colors last:border-b-0 hover:bg-brand-50/30"
                                  >
                                    <kind.Icon className="h-4 w-4 shrink-0 text-brand-600" />
                                    <span className="flex-1 text-sm text-ink-700">
                                      {t.title}
                                    </span>
                                    <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                                      {kind.label}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : syllabus.length > 0 ? (
              /* No modules authored yet — fall back to the course's own topic list. */
              <ol className="space-y-2.5">
                {syllabus.map((t, i) => (
                  <li
                    key={t}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-card"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-xs font-black text-brand-700">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-ink-700">{t}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="rounded-2xl border border-dashed border-line-strong bg-brand-50/30 p-8 text-center">
                <p className="text-ink-600">
                  The detailed syllabus for this course is being finalised.{" "}
                  <Link href="/contact" className="font-semibold text-brand-600 hover:underline">
                    Ask us what it covers →
                  </Link>
                </p>
              </div>
            )}

            {/* Signed out, the lock panel above already says this. */}
            {signedIn && status !== "approved" && hasSyllabus && (
              <p className="mt-5 text-sm text-ink-400">
                🔒 Lesson videos, documentation and the AI tutor unlock once your
                reservation is approved.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- What's included ---------------- */}
      <section className="border-y border-line bg-white py-14">
        <div className="container-x">
          <SectionHeading eyebrow="What's included" title="Everything you get with your seat" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {included.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                style={{ "--i": i % 3 } as CSSProperties}
                className="seq group rounded-3xl border border-line bg-[#f7f9fd] p-7 lift hover:border-brand-200 hover:bg-brand-50/40 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-card transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-black tracking-tight text-ink-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="py-14">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-10 text-white sm:p-14">
            <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {live ? "Seats are limited." : "Start whenever you're ready."}
                </h2>
                <p className="mt-3 text-brand-100/70">
                  {live && course.startDate
                    ? `${course.title} starts ${course.startDate}${
                        course.schedule ? ` · ${course.schedule}` : ""
                      }.`
                    : `Join ${course.learners.toLocaleString("en-IN")} learners already working through ${course.title}.`}
                </p>
              </div>
              <a
                href="#enroll"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-ink-900 transition hover:-translate-y-0.5 hover:bg-brand-50"
              >
                {live ? "Reserve your seat" : "Enroll now"}
                <IconArrow className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Other classes ---------------- */}
      {others.length > 0 && (
        <section className="border-t border-line bg-white py-14">
          <div className="container-x">
            <SectionHeading eyebrow="Keep exploring" title="Other classes" />
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {others.map((c, i) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  style={{ "--i": i % 3 } as CSSProperties}
                  className="seq group rounded-2xl border border-line bg-white p-5 shadow-card lift hover:border-brand-200 hover:shadow-lift"
                >
                  <div className="text-xs font-semibold text-brand-600">
                    {c.mode === "Live" ? "Live cohort" : "Self-paced"} · {c.level}
                  </div>
                  <h3 className="mt-2 font-bold leading-snug text-ink-900 group-hover:text-brand-700">
                    {c.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-600">{c.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-600">
                    View course
                    <IconArrow className="h-4 w-4" strokeWidth={2} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
