import Link from "next/link";
import { ReactNode } from "react";

/* ---------- Button ---------- */
type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "white" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<string, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_10px_30px_-10px_rgba(29,71,219,0.7)] hover:bg-brand-700 hover:-translate-y-0.5",
  white:
    "bg-white text-navy-800 shadow-card hover:-translate-y-0.5 hover:shadow-glow",
  outline:
    "border border-navy-700/20 text-navy-800 hover:border-brand-500 hover:text-brand-600 bg-white/60",
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
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && (
        <div
          className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${
            light ? "text-cyan-accent" : "text-brand-600"
          }`}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-navy-800"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? "text-brand-100/80" : "text-navy-700/70"
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
      className={`rounded-2xl border border-navy-700/8 bg-white shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
