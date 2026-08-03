"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Course, categoryName } from "@/lib/data";
import { formatINR } from "@/lib/site";
import { PriceTag } from "./ui";
import { IconBook, IconClock, IconUsers, IconStar, IconArrow } from "@/components/icons";

type Tab = "all" | "Live" | "Self-paced";

/**
 * The catalogue browses; it does not sell. Each card opens that course's own
 * page (`/courses/[slug]`), where the syllabus is laid out and the reserve
 * panel sits beside the course it actually belongs to.
 */
export default function CoursesCatalog({
  courses,
  showPrices = true,
}: {
  courses: Course[];
  /** Server-decided; figures are stripped from `courses` when false. */
  showPrices?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("all");
  const [level, setLevel] = useState<string>("all");

  const list = useMemo(
    () =>
      courses.filter(
        (c) =>
          (tab === "all" || c.mode === tab) &&
          (level === "all" || c.level === level)
      ),
    [courses, tab, level]
  );

  const counts = useMemo(
    () => ({
      all: courses.length,
      Live: courses.filter((c) => c.mode === "Live").length,
      "Self-paced": courses.filter((c) => c.mode === "Self-paced").length,
    }),
    [courses]
  );

  const filtered = tab !== "all" || level !== "all";

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
              {/* The count says whether a tab is worth opening before opening it. */}
              <span
                className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                  tab === t ? "bg-brand-50 text-brand-700" : "bg-ink-400/10 text-ink-400"
                }`}
              >
                {counts[t]}
              </span>
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
      {list.length === 0 ? (
        /* Filtering to an empty combination used to leave a blank gap with
           nothing to explain it and no way back except undoing both filters. */
        <div className="mt-8 rounded-3xl border border-dashed border-line-strong bg-brand-50/30 p-12 text-center">
          <h3 className="text-lg font-black tracking-tight text-ink-900">
            No classes match those filters
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
            Nothing is running at that level right now — try another level, or
            look at every class we teach.
          </p>
          <button
            type="button"
            onClick={() => {
              setTab("all");
              setLevel("all");
            }}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Show all classes
            <IconArrow className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <>
          {filtered && (
            <div className="mt-6 text-sm text-ink-400">
              Showing <strong className="text-ink-700">{list.length}</strong> of{" "}
              {courses.length} classes
            </div>
          )}
          <div
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
              filtered ? "mt-4" : "mt-8"
            }`}
          >
            {list.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} showPrices={showPrices} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function CourseCard({
  course,
  index = 0,
  showPrices = true,
}: {
  course: Course;
  /** Grid position, modulo the column count, for the staggered arrival. */
  index?: number;
  showPrices?: boolean;
}) {
  const live = course.mode === "Live";
  return (
    <Link
      href={`/courses/${course.slug}`}
      style={{ "--i": index % 3 } as CSSProperties}
      className="seq group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card lift hover:border-brand-200 hover:shadow-lift"
    >
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

        {/* Same cohort treatment as the reserve panel on the course page —
            accent rule, then date, schedule, and the seat count with the live
            pulse. Each line is guarded: a cohort with no date set rendered a
            bare "Starts" before. */}
        {live &&
          (course.startDate ||
            course.schedule ||
            typeof course.seatsLeft === "number") && (
            <div className="mt-3 rounded-r-lg border-l-2 border-red-400 bg-brand-50/70 px-3 py-2.5 text-xs">
              {course.startDate && (
                <div className="font-bold text-ink-900">Starts {course.startDate}</div>
              )}
              {course.schedule && (
                <div className="mt-0.5 text-ink-600">{course.schedule}</div>
              )}
              {typeof course.seatsLeft === "number" && (
                <div className="mt-1.5 flex items-center gap-1.5 font-bold text-red-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                  Only {course.seatsLeft} seats left
                </div>
              )}
            </div>
          )}

        {/* Pushed to the bottom so the CTA line sits level across the row. */}
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <div className="flex items-baseline gap-2">
            {/* PriceTag's locked state is a link to /login, and the whole card
                is already a link — so the lock is drawn inline here instead.
                Signing in is offered on the course page this card opens. */}
            {showPrices ? (
              <>
                <PriceTag
                  value={course.price}
                  className="text-lg font-black tracking-tight text-ink-900"
                />
                {course.oldPrice && (
                  <span className="text-sm text-ink-400 line-through">
                    {formatINR(course.oldPrice)}
                  </span>
                )}
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="h-3.5 w-3.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
                  <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                </svg>
                Sign in for price
              </span>
            )}
          </div>
          {/* A span, not a button — the whole card is already the link. */}
          <span className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-bold text-white transition group-hover:bg-brand-700">
            View course
            <IconArrow className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
