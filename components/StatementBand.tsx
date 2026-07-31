import type { CSSProperties, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Statement band — the chapter break both reference sites lean on:    */
/*  a small eyebrow over a short, punchy headline that lands in two     */
/*  lines ("Capture Motion. / Without Missing a Beat", "All the         */
/*  must-haves. / All on iPhone.").                                     */
/*                                                                      */
/*  The two lines arrive on their own beats rather than as one block —  */
/*  that split is what gives the pattern its rhythm. Optional tiles      */
/*  below pick up the same sequence, continuing the count so the whole   */
/*  band reads as one cascade.                                          */
/* ------------------------------------------------------------------ */
export default function StatementBand({
  eyebrow,
  lineOne,
  lineTwo,
  /** Accent applies to the second line, where the emphasis usually sits. */
  accent = true,
  tone = "light",
  tiles,
  children,
}: {
  eyebrow: string;
  lineOne: ReactNode;
  lineTwo: ReactNode;
  accent?: boolean;
  tone?: "light" | "dark";
  tiles?: { title: string; desc: string }[];
  children?: ReactNode;
}) {
  const dark = tone === "dark";

  return (
    <section
      className={`relative overflow-clip py-20 lg:py-24 ${
        dark ? "bg-navy-900 text-white" : "border-y border-line bg-white"
      }`}
    >
      {dark && (
        <div aria-hidden className="parallax pointer-events-none absolute inset-0">
          <div className="mesh absolute inset-0 opacity-25" />
          <div className="grid-lines absolute inset-0 opacity-[0.1]" />
        </div>
      )}

      <div className="container-x relative">
        <div
          className={`seq text-xs font-bold uppercase tracking-[0.2em] ${
            dark ? "text-cyan-accent" : "text-brand-600"
          }`}
          style={{ "--i": 0 } as CSSProperties}
        >
          {eyebrow}
        </div>

        <h2
          className={`mt-4 max-w-4xl text-[2.1rem] font-black leading-[1.03] tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl ${
            dark ? "text-white" : "text-ink-900"
          }`}
        >
          <span className="reveal-focus block">{lineOne}</span>
          <span
            className={`seq block ${
              accent ? (dark ? "text-gradient-light" : "text-gradient") : ""
            }`}
            style={{ "--i": 1 } as CSSProperties}
          >
            {lineTwo}
          </span>
        </h2>

        {children && (
          <div className="seq mt-8" style={{ "--i": 2 } as CSSProperties}>
            {children}
          </div>
        )}

        {tiles && tiles.length > 0 && (
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((t, i) => (
              <li
                key={t.title}
                className={`seq rounded-2xl border p-5 ${
                  dark
                    ? "border-white/10 bg-white/[0.06] backdrop-blur"
                    : "border-line bg-white shadow-card"
                }`}
                /* Continue the count from the headline so the tiles feel
                   like the tail of one cascade, not a second animation. */
                style={{ "--i": i + 2 } as CSSProperties}
              >
                <h3
                  className={`text-[15px] font-bold ${
                    dark ? "text-white" : "text-ink-900"
                  }`}
                >
                  {t.title}
                </h3>
                <p
                  className={`mt-1.5 text-[13px] leading-relaxed ${
                    dark ? "text-brand-100/70" : "text-ink-600"
                  }`}
                >
                  {t.desc}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
