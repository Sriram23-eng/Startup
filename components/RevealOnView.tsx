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
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol
      ref={ref}
      className={`${className} spring-list${mounted ? " js" : ""}${
        shown ? " is-in" : ""
      }`}
    >
      {children}
    </ol>
  );
}
