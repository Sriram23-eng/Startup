/* ------------------------------------------------------------------ */
/*  Decorative field of gently floating dots (after the Jitter "About   */
/*  us" template's scattered-dots motif). Purely ambient; aria-hidden.  */
/* ------------------------------------------------------------------ */
const DOTS: { top: number; left: number; s: number; accent?: boolean }[] = [
  { top: 8, left: 62, s: 4 },
  { top: 14, left: 88, s: 12 },
  { top: 22, left: 74, s: 6, accent: true },
  { top: 18, left: 97, s: 5 },
  { top: 34, left: 66, s: 3 },
  { top: 40, left: 84, s: 16 },
  { top: 46, left: 95, s: 7 },
  { top: 52, left: 71, s: 10, accent: true },
  { top: 58, left: 60, s: 4 },
  { top: 62, left: 90, s: 6 },
  { top: 70, left: 78, s: 14 },
  { top: 74, left: 66, s: 5 },
  { top: 80, left: 94, s: 8, accent: true },
  { top: 86, left: 72, s: 4 },
  { top: 90, left: 84, s: 11 },
  { top: 30, left: 92, s: 4 },
  { top: 64, left: 98, s: 3 },
  { top: 44, left: 62, s: 6 },
];

export default function DotField({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="animate-floaty absolute rounded-full"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: `${d.s}px`,
            height: `${d.s}px`,
            background: d.accent
              ? "var(--color-brand-500)"
              : "rgba(33,37,41,0.55)",
            animationDelay: `${-(i % 6) * 1.1}s`,
            animationDuration: `${5 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}
