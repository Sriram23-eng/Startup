import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Shared dark cinematic page hero (matches the home hero language).   */
/*  Near-black backdrop with emerald + teal ambient glows and a faint   */
/*  grid, staggered entrance, big headline with an optional gradient    */
/*  accent (wrap part of the title in <span className="text-gradient-   */
/*  light">). `aside` renders a page-specific panel on the right.       */
/* ------------------------------------------------------------------ */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  actions,
  aside,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="mesh absolute inset-0 opacity-55" />
        <div className="animate-drift absolute -left-40 -top-44 h-[34rem] w-[34rem] rounded-full bg-brand-500/22 blur-[150px]" />
        <div className="animate-drift absolute -right-28 top-6 h-[28rem] w-[28rem] rounded-full bg-cyan-accent/16 blur-[150px] [animation-delay:-6s]" />
        <div className="grid-lines absolute inset-0 opacity-[0.13] [mask-image:radial-gradient(80%_60%_at_50%_20%,black,transparent)]" />
      </div>

      <div
        className={`container-x relative py-20 lg:py-24 ${
          aside
            ? "grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]"
            : centered
            ? "flex flex-col items-center text-center"
            : ""
        }`}
      >
        <div className={centered && !aside ? "flex flex-col items-center" : ""}>
          {eyebrow && (
            <div className="animate-rise text-xs font-bold uppercase tracking-[0.2em] text-cyan-accent">
              {eyebrow}
            </div>
          )}
          <h1 className="animate-rise mt-4 max-w-3xl text-[2.4rem] font-black leading-[1.05] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl [animation-delay:60ms]">
            {title}
          </h1>
          {subtitle && (
            <p className="animate-rise mt-5 max-w-xl text-lg leading-relaxed text-brand-100/70 [animation-delay:120ms]">
              {subtitle}
            </p>
          )}
          {actions && (
            <div
              className={`animate-rise mt-8 flex flex-wrap items-center gap-3 [animation-delay:180ms] ${
                centered ? "justify-center" : ""
              }`}
            >
              {actions}
            </div>
          )}
        </div>

        {aside && (
          <div className="animate-rise [animation-delay:200ms]">{aside}</div>
        )}
      </div>
    </section>
  );
}
