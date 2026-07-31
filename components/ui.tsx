import Link from "next/link";
import { ReactNode } from "react";

/* ---------- Button ---------- */
type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "white" | "outline" | "outline-light";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<string, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_12px_28px_-12px_rgba(35,165,43,0.8)] hover:bg-brand-700 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-14px_rgba(35,165,43,0.9)]",
  white:
    "bg-white text-ink-900 shadow-card hover:-translate-y-0.5 hover:shadow-lift ring-1 ring-line",
  outline:
    "border border-line-strong text-ink-900 hover:border-brand-500 hover:text-brand-600 bg-white/60",
  // For dark sections. Passing `bg-transparent` via className can't override
  // `outline`'s bg-white/60 — same specificity, so source order in the
  // generated stylesheet decides. This variant sets the background itself.
  "outline-light":
    "border border-white/35 bg-white/5 text-white hover:border-cyan-accent hover:bg-white/12 hover:-translate-y-0.5",
  ghost: "text-navy-700 hover:bg-brand-50",
};

const sizes: Record<string, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* ---------- Badge ---------- */
export function Badge({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "cyan" | "navy" | "soft";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-700 ring-brand-200",
    cyan: "bg-cyan-accent/10 text-[#0b7c8c] ring-cyan-accent/30",
    navy: "bg-navy-800 text-white ring-navy-700",
    soft: "bg-white/70 text-navy-700 ring-navy-700/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`reveal ${center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}>
      {eyebrow && (
        <div
          className={`mb-3.5 text-xs font-bold uppercase tracking-[0.2em] ${
            light ? "text-cyan-accent" : "text-brand-600"
          }`}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className={`reveal-focus text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.7rem] ${
          light ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg leading-relaxed text-pretty ${
            light ? "text-brand-100/80" : "text-ink-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ---------- Card ---------- */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
