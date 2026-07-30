"use client";

/* ------------------------------------------------------------------ */
/*  Animated hero showcase: real kit photos crossfading with a slow    */
/*  Ken-Burns zoom. Auto-advances, pauses on hover, and honours        */
/*  prefers-reduced-motion (no auto-rotate, no zoom).                  */
/* ------------------------------------------------------------------ */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconStar, IconShield, IconCheck } from "@/components/icons";
import { formatINR } from "@/lib/site";

export type ShowcaseKit = {
  slug: string;
  image: string;
  title: string;
  price: number;
  rating: number;
};

const ROTATE_MS = 4500;

export default function HeroShowcase({ kits }: { kits: ShowcaseKit[] }) {
  const slides = kits.slice(0, 5);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Read the motion preference once, synchronously, to avoid a first-frame flash.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || paused || reduced) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [slides.length, paused, reduced]);

  if (!slides.length) return null;
  const current = slides[active];

  return (
    <div
      className="relative animate-rise [animation-delay:120ms]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="absolute inset-8 -z-10 rounded-[2.4rem] bg-brand-500/20 blur-3xl"
      />

      <div className="ring-gradient rounded-[1.9rem] bg-white/70 p-2.5 shadow-lift backdrop-blur-xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.55rem] bg-navy-900">
          {/* Stacked, crossfading photos */}
          {slides.map((k, i) => (
            <div
              key={k.slug}
              aria-hidden={i !== active}
              className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={k.image}
                alt={k.title}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className={`object-cover transition-transform ease-out ${
                  i === active
                    ? "scale-[1.08] duration-[6000ms]"
                    : "scale-100 duration-700"
                }`}
              />
            </div>
          ))}

          {/* Legibility gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />

          {/* Rating chip */}
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-ink-900 shadow-card backdrop-blur">
            <IconStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {current.rating} rating
          </div>

          {/* Slide indicators */}
          <div className="absolute right-4 top-4 flex items-center gap-1.5">
            {slides.map((k, i) => (
              <button
                key={k.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${k.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Caption, re-animates on slide change */}
          <div
            key={current.slug}
            className="animate-rise absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white"
          >
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-200">
                Featured kit
              </div>
              <Link
                href={`/projects/${current.slug}`}
                className="mt-0.5 block truncate text-base font-bold underline-offset-2 hover:underline"
              >
                {current.title}
              </Link>
            </div>
            <div className="shrink-0 text-xl font-black tracking-tight">
              {formatINR(current.price)}
            </div>
          </div>
        </div>
      </div>

      {/* Floating fact chips, kept clear of the caption so nothing overlaps */}
      <div className="animate-floaty absolute -right-4 -top-6 hidden rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-card backdrop-blur md:block">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <IconShield className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <div>
            <div className="text-[11px] font-medium text-ink-400">
              Source and docs
            </div>
            <div className="text-sm font-black text-ink-900">Included</div>
          </div>
        </div>
      </div>

      <div className="animate-floaty absolute -left-5 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-line bg-white/95 p-4 shadow-card backdrop-blur sm:block [animation-delay:-3s]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <IconCheck className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <div>
            <div className="text-sm font-bold text-ink-900">Ships assembled</div>
            <div className="text-xs text-ink-400">Tested on our bench</div>
          </div>
        </div>
      </div>
    </div>
  );
}
