"use client";

/* ------------------------------------------------------------------ */
/*  Featured showcase slider (after the Jitter "Mountains are calling"  */
/*  template): a big changing headline beside a large image, with       */
/*  numbered 01·02·03·04 pagination. Auto-advances, pauses on hover.    */
/* ------------------------------------------------------------------ */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project, categoryName } from "@/lib/data";
import { formatINR } from "@/lib/site";
import { IconArrow } from "@/components/icons";

export default function FeaturedSlider({ projects }: { projects: Project[] }) {
  const items = projects.slice(0, 4);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  if (!items.length) return null;
  const cur = items[i];

  return (
    <section className="py-16 lg:py-24">
      <div
        className="container-x"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          Featured kits
        </div>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Changing title + meta */}
          <div key={cur.slug} className="animate-rise order-2 lg:order-1">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              {categoryName(cur.category)}
            </div>
            <h2 className="mt-2 text-4xl font-black leading-[1.02] tracking-[-0.03em] text-balance text-ink-900 sm:text-5xl lg:text-6xl">
              {cur.title}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-600">
              {cur.summary}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <Link
                href={`/projects/${cur.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 active:scale-[0.98]"
              >
                View kit
                <IconArrow className="h-4 w-4" strokeWidth={2} />
              </Link>
              <span className="text-lg font-black tracking-tight text-ink-900">
                {formatINR(cur.price)}
              </span>
            </div>
          </div>

          {/* Crossfading images */}
          <div className="relative order-1 aspect-[16/11] overflow-hidden rounded-3xl bg-navy-900 lg:order-2">
            {items.map((s, idx) => (
              <Image
                key={s.slug}
                src={s.image}
                alt={s.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={`object-cover transition-opacity duration-700 ${
                  idx === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Numbered pagination */}
        <div className="mt-8 flex items-center justify-end gap-4">
          {items.map((s, idx) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show ${s.title}`}
              className="flex items-center gap-3"
            >
              {idx === i && (
                <span className="h-px w-8 bg-brand-500 sm:w-12" />
              )}
              <span
                className={`text-sm font-black tabular-nums transition-colors ${
                  idx === i ? "text-brand-600" : "text-ink-400 hover:text-ink-700"
                }`}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
