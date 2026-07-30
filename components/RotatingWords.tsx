"use client";

/* ------------------------------------------------------------------ */
/*  Rotating headline word (Apple / OPPO style). Only ONE word is ever  */
/*  rendered, positioned over an invisible sizer that holds the width   */
/*  of the longest phrase so nothing reflows and nothing can overlap.   */
/*  Each swap re-runs a blur + slide entrance. Reduced-motion aware.    */
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
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      {/* Invisible sizer holds the box; nothing is painted for it. */}
      <span className="invisible" aria-hidden>
        {longest}
      </span>
      {/* The single visible word, re-animated on each change via key. */}
      <span
        key={i}
        className={`text-gradient-light absolute left-0 top-0 ${
          reduced ? "" : "animate-word-in"
        }`}
      >
        {words[i]}
      </span>
    </span>
  );
}
