"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Course, categoryName } from "@/lib/data";
import { formatINR } from "@/lib/site";
import { Button } from "./ui";
import { Label, Select } from "./Field";
import { IconBook, IconClock, IconUsers, IconStar, IconArrow } from "@/components/icons";

type Tab = "all" | "Live" | "Self-paced";

export default function CoursesCatalog({ courses }: { courses: Course[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [level, setLevel] = useState<string>("all");
  const [selected, setSelected] = useState(courses[0]?.slug ?? "");
  const enrollRef = useRef<HTMLDivElement>(null);

  const list = useMemo(
    () =>
      courses.filter(
        (c) =>
          (tab === "all" || c.mode === tab) &&
          (level === "all" || c.level === level)
      ),
    [courses, tab, level]
  );

  function enroll(slug: string) {
    setSelected(slug);
    enrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-brand-50/70 p-1">
          {(["all", "Live", "Self-paced"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === t
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-ink-400 hover:text-ink-900"
              }`}
            >
              {t === "Live" && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              )}
              {t === "all" ? "All classes" : t === "Live" ? "Live cohorts" : "Self-paced"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-400">Level</span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-line-strong bg-white px-3 py-2 font-medium text-ink-900 outline-none focus:border-brand-400"
          >
            <option value="all">Any</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <CourseCard key={c.slug} course={c} onEnroll={() => enroll(c.slug)} />
        ))}
      </div>

      {/* Enroll */}
      <div ref={enrollRef} id="enroll" className="mt-16 scroll-mt-24">
        <EnrollForm courses={courses} selected={selected} onSelect={setSelected} />
      </div>
    </>
  );
}

function CourseCard({
  course,
  onEnroll,
}: {
  course: Course;
  onEnroll: () => void;
}) {
  const live = course.mode === "Live";
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card lift hover:border-brand-200 hover:shadow-lift">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-950/60 to-transparent" />
        <div className="absolute left-3 top-3">
          {live ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE COHORT
            </span>
          ) : (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ink-900 shadow">
              Self-paced
            </span>
          )}
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-navy-800/85 px-2.5 py-1 text-[11px] font-bold text-cyan-accent backdrop-blur">
          {course.level}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-brand-600">
          <span>{categoryName(course.category)}</span>
          <span className="text-ink-400/50">•</span>
          <span className="flex items-center gap-1">
            <IconStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-ink-700">{course.rating}</span>
          </span>
          <span className="text-ink-400/50">•</span>
          <span className="text-ink-400">
            {course.learners.toLocaleString("en-IN")} learners
          </span>
        </div>
        <h3 className="text-base font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">
          {course.blurb}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <IconBook className="h-3.5 w-3.5" /> {course.lessons} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconClock className="h-3.5 w-3.5" /> {course.hours} hrs
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconUsers className="h-3.5 w-3.5" /> {course.instructor.split(" · ")[0]}
          </span>
        </div>

        {live && (
          <div className="mt-3 rounded-lg bg-brand-50/70 px-3 py-2 text-xs">
            <div className="font-semibold text-ink-900">
              Starts {course.startDate}
            </div>
            <div className="text-ink-600">{course.schedule}</div>
            {typeof course.seatsLeft === "number" && (
              <div className="mt-1 font-bold text-red-500">
                Only {course.seatsLeft} seats left
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black tracking-tight text-ink-900">
              {formatINR(course.price)}
            </span>
            {course.oldPrice && (
              <span className="text-sm text-ink-400 line-through">
                {formatINR(course.oldPrice)}
              </span>
            )}
          </div>
          <button
            onClick={onEnroll}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            {live ? "Reserve seat" : "Enroll"}
            <IconArrow className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EnrollForm({
  courses,
  selected,
  onSelect,
}: {
  courses: Course[];
  selected: string;
  onSelect: (s: string) => void;
}) {
  const [me, setMe] = useState<{ name: string } | null | undefined>(undefined);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const course = courses.find((c) => c.slug === selected);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user ?? null))
      .catch(() => setMe(null));
  }, []);

  async function reserve() {
    if (!course) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug }),
      });
      if (res.status === 401) {
        window.location.href = "/login?next=/courses";
        return;
      }
      if (!(await res.json()).ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <div className="grid md:grid-cols-2">
        {/* Summary */}
        <div className="relative overflow-hidden bg-navy-800 p-8 text-white">
          <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-accent">
              Enroll now
            </span>
            <h3 className="mt-3 text-2xl font-extrabold">
              {course?.title ?? "Pick a class"}
            </h3>
            {course && (
              <>
                <p className="mt-2 text-sm text-brand-100/70">{course.blurb}</p>
                <div className="mt-5 space-y-2 text-sm">
                  {course.mode === "Live" && (
                    <Row k="Starts" v={`${course.startDate} · ${course.schedule}`} />
                  )}
                  <Row k="Format" v={course.mode} />
                  <Row k="Lessons" v={`${course.lessons} · ${course.hours} hrs`} />
                  <Row k="Instructor" v={course.instructor} />
                </div>
                <div className="mt-6 flex items-baseline gap-2 border-t border-white/10 pt-5">
                  <span className="text-3xl font-black">
                    {formatINR(course.price)}
                  </span>
                  {course.oldPrice && (
                    <span className="text-brand-100/50 line-through">
                      {formatINR(course.oldPrice)}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {status === "done" ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-3xl">
                  ✓
                </div>
                <h3 className="mt-4 text-xl font-black tracking-tight text-ink-900">
                  Seat reserved!
                </h3>
                <p className="mt-2 text-sm text-ink-600">
                  Your reservation for <strong>{course?.title}</strong> is in.
                  We&apos;ll confirm your access shortly — track it on your{" "}
                  <a
                    href="/dashboard"
                    className="font-semibold text-brand-600 hover:underline"
                  >
                    dashboard
                  </a>
                  .
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-black tracking-tight text-ink-900">
                Reserve your spot
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <Label>Choose a class</Label>
                  <Select
                    value={selected}
                    onChange={(e) => onSelect(e.target.value)}
                  >
                    {courses.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.mode === "Live" ? "● " : ""}
                        {c.title}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {status === "error" && (
                <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}

              {me === undefined ? (
                <Button size="lg" className="mt-5 w-full">
                  Loading…
                </Button>
              ) : me === null ? (
                <>
                  <Button
                    href="/login?next=/courses"
                    size="lg"
                    className="mt-5 w-full"
                  >
                    Sign in to reserve →
                  </Button>
                  <p className="mt-3 text-center text-xs text-ink-400">
                    Create a free account to reserve your seat
                  </p>
                </>
              ) : (
                <>
                  <Button size="lg" className="mt-5 w-full" onClick={reserve}>
                    {status === "sending" ? "Reserving…" : "Reserve seat →"}
                  </Button>
                  <p className="mt-3 text-center text-xs text-ink-400">
                    No payment now · we&apos;ll confirm access after payment
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-brand-100/55">{k}</span>
      <span className="text-right font-semibold text-white">{v}</span>
    </div>
  );
}
