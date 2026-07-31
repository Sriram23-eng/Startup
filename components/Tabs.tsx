"use client";

import { useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Native, on-brand tabs with a sliding underline indicator — the      */
/*  MUI "styled tabs" look rebuilt in Tailwind (brand-green indicator,   */
/*  no MUI/Emotion dependency). Equal-width tabs so the indicator can    */
/*  slide by translateX without measuring the DOM.                       */
/* ------------------------------------------------------------------ */
export default function Tabs({
  tabs,
}: {
  tabs: { label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  const n = tabs.length || 1;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Dashboard sections"
        className="relative border-b border-line"
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {tabs.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              type="button"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`px-4 py-3 text-sm font-bold transition-colors ${
                i === active
                  ? "text-brand-700"
                  : "text-ink-400 hover:text-ink-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* sliding indicator */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-0.5 rounded-full bg-brand-500 transition-transform duration-300 ease-out"
          style={{
            width: `${100 / n}%`,
            transform: `translateX(${active * 100}%)`,
          }}
        />
      </div>

      <div role="tabpanel" className="pt-8">
        {tabs[active]?.content}
      </div>
    </div>
  );
}
