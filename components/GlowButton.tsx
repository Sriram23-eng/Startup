"use client";

/* ------------------------------------------------------------------ */
/*  Glow button (after the Jitter "Get moving" template): a solid brand */
/*  button with a soft radial highlight that tracks the cursor. Honours */
/*  reduced-motion implicitly (the glow only moves on hover).           */
/* ------------------------------------------------------------------ */
import Link from "next/link";
import { useRef, type ReactNode } from "react";

export default function GlowButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function move(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={move}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_12px_28px_-12px_rgba(35,165,43,0.8)] transition-all duration-200 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(130px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.4), transparent 60%)",
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Link>
  );
}
