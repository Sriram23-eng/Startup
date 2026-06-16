"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Course, categoryName } from "@/lib/data";
import { formatINR } from "@/lib/site";
import { Button } from "./ui";
import { Label, Input, Select } from "./Field";

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
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === t
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-navy-700/60 hover:text-navy-800"
              }`}
            >
              {t === "all" ? "All classes" : t === "Live" ? "🔴 Live cohorts" : "Self-paced"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-navy-700/50">Level</span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-navy-700/12 bg-white px-3 py-2 font-medium outline-none focus:border-brand-400"
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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
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
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy-800 shadow">
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
          <span className="text-navy-700/30">•</span>
          <span className="flex items-center gap-1 text-amber-500">
            ★ <span className="text-navy-700/70">{course.rating}</span>
          </span>
          <span className="text-navy-700/30">•</span>
          <span className="text-navy-700/50">
            {course.learners.toLocaleString("en-IN")} learners
          </span>
        </div>
        <h3 className="text-base font-bold leading-snug text-navy-800 group-hover:text-brand-700">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy-700/60">
          {course.blurb}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-700/55">
          <span>📚 {course.lessons} lessons</span>
          <span>⏱ {course.hours} hrs</span>
          <span>👤 {course.instructor.split(" · ")[0]}</span>
        </div>

        {live && (
          <div className="mt-3 rounded-lg bg-brand-50/70 px-3 py-2 text-xs">
            <div className="font-semibold text-navy-800">
              🗓 Starts {course.startDate}
            </div>
            <div className="text-navy-700/60">{course.schedule}</div>
            {typeof course.seatsLeft === "number" && (
              <div className="mt-1 font-bold text-red-500">
                Only {course.seatsLeft} seats left
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-navy-700/8 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-navy-800">
              {formatINR(course.price)}
            </span>
            {course.oldPrice && (
              <span className="text-sm text-navy-700/40 line-through">
                {formatINR(course.oldPrice)}
              </span>
            )}
          </div>
          <button
            onClick={onEnroll}
            className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            {live ? "Reserve seat" : "Enroll"} →
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
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const course = courses.find((c) => c.slug === selected);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "course-enroll",
          course: course?.title,
          ...form,
        }),
      });
      if (!(await res.json()).ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-navy-700/8 bg-white shadow-card">
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
                <h3 className="mt-4 text-xl font-extrabold text-navy-800">
                  You’re in! 🎉
                </h3>
                <p className="mt-2 text-sm text-navy-700/60">
                  We’ve received your enrollment for{" "}
                  <strong>{course?.title}</strong>. Our team will email payment &
                  joining details shortly.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3 className="text-lg font-bold text-navy-800">
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
                        {c.mode === "Live" ? "🔴 " : ""}
                        {c.title}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Full name</Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Phone / WhatsApp</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              {status === "error" && (
                <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}
              <Button type="submit" size="lg" className="mt-5 w-full">
                {status === "sending" ? "Reserving…" : "Confirm enrollment →"}
              </Button>
              <p className="mt-3 text-center text-xs text-navy-700/45">
                No payment now · we’ll send secure payment & joining link
              </p>
            </form>
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
