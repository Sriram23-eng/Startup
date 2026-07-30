import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Elektron Nexus logo. A chip mark (pins + an "E" traced from circuit  */
/*  lines with a node) drawn in currentColor, plus the wordmark. Used    */
/*  in the navbar, footer and admin shell.                              */
/* ------------------------------------------------------------------ */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      {/* pins */}
      <g stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
        <path d="M15 3.5v5.5M20 3.5v5.5M25 3.5v5.5" />
        <path d="M15 31v5.5M20 31v5.5M25 31v5.5" />
        <path d="M3.5 15h5.5M3.5 20h5.5M3.5 25h5.5" />
        <path d="M31 15h5.5M31 20h5.5M31 25h5.5" />
      </g>
      {/* chip body */}
      <rect
        x="9"
        y="9"
        width="22"
        height="22"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="2.3"
      />
      {/* "E" traced from circuit lines */}
      <path
        d="M16 15h8.5M16 15v10M16 25h8.5M16 20h6"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="20" r="1.7" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  href = "/",
  markClassName = "h-9 w-9 text-brand-600",
  className = "",
  light = false,
}: {
  href?: string;
  markClassName?: string;
  className?: string;
  /** Light wordmark for dark backgrounds. */
  light?: boolean;
}) {
  return (
    <Link href={href} className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      <span className="flex flex-col leading-none">
        <span
          className={`text-[15px] font-extrabold tracking-tight ${
            light ? "text-white" : "text-ink-900"
          }`}
        >
          Elektron <span className="text-brand-600">Nexus</span>
        </span>
        <span
          className={`mt-0.5 text-[9px] font-bold uppercase tracking-[0.22em] ${
            light ? "text-brand-100/60" : "text-ink-400"
          }`}
        >
          Core Electronics Hub
        </span>
      </span>
    </Link>
  );
}
