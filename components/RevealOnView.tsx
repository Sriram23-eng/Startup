"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Plays a time-based entrance animation on its children the first     */
/*  time the list scrolls into view (adds .is-in). Unlike the CSS       */
/*  scroll-timeline reveals, the animation runs over a fixed duration    */
/*  — so a spring/bounce actually springs instead of scrubbing with      */
/*  the scrollbar. The ".js" flag means no-JS visitors still see the     */
/*  content (items are only hidden once JS is active).                   */
/* ------------------------------------------------------------------ */
export default function RevealOnView({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const [mounted, setMounted] = useState(false);
  // "hidden" -> waiting; "in" -> play the animation; "shown" -> reveal
  // instantly with no animation (already on screen at load / reduced motion).
  const [mode, setMode] = useState<"hidden" | "in" | "shown">("hidden");

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setMode("shown");
      return;
    }

    // The observer's first callback reports the state at load. If the grid is
    // ALREADY in view then (e.g. a refresh with the scroll restored here), just
    // show it — no animation. Only a later scroll-in plays the slide.
    let initial = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (initial) {
          initial = false;
          if (entry.isIntersecting) {
            setMode("shown");
            io.disconnect();
          }
          return;
        }
        if (entry.isIntersecting) {
          setMode("in");
          io.disconnect();
        }
      },
      // Fire once the grid is well inside the viewport (its top has scrolled
      // up past ~75% of the screen), not the moment its edge peeks in.
      { threshold: 0, rootMargin: "0px 0px -25% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol
      ref={ref}
      className={`${className} spring-list${mounted ? " js" : ""}${
        mode === "in" ? " is-in" : mode === "shown" ? " is-shown" : ""
      }`}
    >
      {children}
    </ol>
  );
}
