"use client";

/* ------------------------------------------------------------------ */
/*  Animated search bar (after the Jitter "Animated Search Bar"         */
/*  template): a real search input whose placeholder types out kit      */
/*  ideas with a blinking cursor. Submitting jumps to the catalogue,    */
/*  pre-filtered by the query. Reduced-motion shows a static prompt.    */
/* ------------------------------------------------------------------ */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TERMS = [
  "ESP32 smart home hub",
  "LoRa gateway",
  "edge AI camera",
  "line-follower robot",
  "air-quality monitor",
  "Modbus to MQTT gateway",
];

export default function AnimatedSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [typed, setTyped] = useState("");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setTyped(TERMS[0]);
      return;
    }
    let term = 0;
    let ch = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = TERMS[term];
      if (!deleting) {
        ch++;
        setTyped(word.slice(0, ch));
        if (ch === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1500);
          return;
        }
        timer = setTimeout(tick, 65);
      } else {
        ch--;
        setTyped(word.slice(0, ch));
        if (ch === 0) {
          deleting = false;
          term = (term + 1) % TERMS.length;
          timer = setTimeout(tick, 350);
          return;
        }
        timer = setTimeout(tick, 35);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [reduced]);

  const showAnim = !focused && value === "";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/projects?q=${encodeURIComponent(q)}` : "/projects");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-xl">
      <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.06] py-2 pl-4 pr-2 backdrop-blur transition-colors focus-within:border-brand-400 focus-within:bg-white/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5 shrink-0 text-brand-100/60"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" strokeLinecap="round" />
        </svg>

        <div className="relative flex-1">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search kits"
            className="w-full bg-transparent py-1.5 text-sm text-white outline-none placeholder:text-transparent sm:text-base"
          />
          {showAnim && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-sm text-brand-100/55 sm:text-base"
            >
              Search {typed}
              <span className="ml-0.5 inline-block h-[1.1em] w-px animate-pulse bg-brand-300" />
            </span>
          )}
        </div>

        <button
          type="submit"
          className="shrink-0 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700 active:scale-[0.97]"
        >
          Search
        </button>
      </div>
    </form>
  );
}
