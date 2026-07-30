"use client";

/* ------------------------------------------------------------------ */
/*  Rotating headline word (Apple / OPPO style). Crossfades through a   */
/*  list of phrases with a soft blur + slide. A hidden sizer holds the  */
/*  width of the longest phrase so nothing reflows. Honours reduced     */
/*  motion (shows the first phrase, no cycling).                       */
/* ------------------------------------------------------------------ */
import { useEffect, useState } from "react";

export default function RotatingWords({
  words,
  className = "",
  interval = 2600,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  useEffect(() => {
    if (reduced || words.length <= 1) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [reduced, words.length, interval]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className={`relative inline-grid align-baseline ${className}`}>
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
        {longest}
      </span>
      {words.map((w, idx) => (
        <span
          key={w}
          aria-hidden={idx !== i}
          className={`col-start-1 row-start-1 whitespace-nowrap transition-all duration-500 ease-out ${
            idx === i
              ? "opacity-100 translate-y-0 blur-0"
              : "opacity-0 translate-y-[0.35em] blur-[3px]"
          }`}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
