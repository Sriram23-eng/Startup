/* ------------------------------------------------------------------ */
/*  Line icons — one consistent 24px stroke set, drawn in currentColor. */
/*                                                                     */
/*  These replace the emoji glyphs the marketing pages were using.      */
/*  Emoji render differently on every OS, can't take a brand colour and */
/*  can't be sized on a shared optical grid — which is most of why the  */
/*  old category cards read as a template.                              */
/*                                                                     */
/*  No icon dependency: ~1 kB of inline SVG, tree-shaken per import.    */
/* ------------------------------------------------------------------ */
import type { ReactNode } from "react";

type IconProps = {
  className?: string;
  strokeWidth?: number;
};

function Svg({
  children,
  className = "h-6 w-6",
  strokeWidth = 1.6,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ---------------- Domain icons (project categories) ---------------- */

export const IconSignal = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 9a13.5 13.5 0 0 1 20 0" />
    <path d="M5 12.5a9 9 0 0 1 14 0" />
    <path d="M8.5 16a5 5 0 0 1 7 0" />
    <circle cx="12" cy="19.5" r="1.1" />
  </Svg>
);

export const IconChip = (p: IconProps) => (
  <Svg {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <rect x="10.5" y="10.5" width="3" height="3" rx="0.8" />
    <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
  </Svg>
);

export const IconTower = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="9" r="2" />
    <path d="M12 11v11" />
    <path d="M8.6 12.4a5 5 0 0 1 0-6.8M15.4 5.6a5 5 0 0 1 0 6.8" />
    <path d="M5.6 15.4a9 9 0 0 1 0-12.8M18.4 2.6a9 9 0 0 1 0 12.8" />
  </Svg>
);

export const IconBrain = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5.2A3 3 0 0 0 6.6 7 3 3 0 0 0 5 12.4 3 3 0 0 0 7.4 18 3 3 0 0 0 12 19.4Z" />
    <path d="M12 5.2A3 3 0 0 1 17.4 7 3 3 0 0 1 19 12.4 3 3 0 0 1 16.6 18 3 3 0 0 1 12 19.4" />
    <path d="M12 5.2v14.2" />
  </Svg>
);

export const IconRobot = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 4.5V8" />
    <circle cx="12" cy="3.2" r="1.2" />
    <circle cx="9.2" cy="13" r="1.1" />
    <circle cx="14.8" cy="13" r="1.1" />
    <path d="M9.8 16.6h4.4" />
  </Svg>
);

export const IconBoard = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="5" width="14" height="14" rx="2.5" />
    <rect x="9" y="9" width="6" height="6" rx="1.2" />
    <path d="M9 2.5V5M15 2.5V5M9 19v2.5M15 19v2.5M2.5 9H5M2.5 15H5M19 9h2.5M19 15h2.5" />
  </Svg>
);

export const IconPlug = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 2.5V8M15 2.5V8" />
    <path d="M5.5 8h13v2.5a6.5 6.5 0 0 1-13 0Z" />
    <path d="M12 17v4.5" />
  </Svg>
);

export const IconWifi = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 10.5a12 12 0 0 1 17 0" />
    <path d="M7 14a7 7 0 0 1 10 0" />
    <circle cx="12" cy="18" r="1.4" />
    <path d="M12 3.5v1.2" />
  </Svg>
);

export const IconFactory = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 21V10.5l5.5 3.5V10.5L14 14V6.5l5.5 3.5V21Z" />
    <path d="M7 21v-3.5M12 21v-3.5M17 21v-3.5" />
  </Svg>
);

export const IconLeaf = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 20.5C3.5 12 9 5.5 20 5.5c0 10.5-6 15-14 15Z" />
    <path d="M8.5 20c1.8-5 4.8-8.2 8.5-10.2" />
  </Svg>
);

export const IconHome = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 11.2 12 4l8.5 7.2" />
    <path d="M6 10v10h12V10" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);

/* ---------------- UI / marketing icons ---------------- */

export const IconBox = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 8.5 4.6v8.8L12 21l-8.5-4.6V7.6L12 3Z" />
    <path d="m3.5 7.6 8.5 4.6 8.5-4.6M12 12.2V21" />
  </Svg>
);

export const IconCode = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 18-6-6 6-6M15 6l6 6-6 6" />
  </Svg>
);

export const IconCap = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 8.6 12 4.2l9.5 4.4-9.5 4.4Z" />
    <path d="M6.5 10.7V16c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-5.3" />
    <path d="M21.5 8.9v5.4" />
  </Svg>
);

export const IconSparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.8c.6 4.8 2.3 6.5 7.1 7.1-4.8.6-6.5 2.3-7.1 7.1-.6-4.8-2.3-6.5-7.1-7.1 4.8-.6 6.5-2.3 7.1-7.1Z" />
    <path d="M18.5 15.5c.25 2 .95 2.7 2.95 2.95-2 .25-2.7.95-2.95 2.95-.25-2-.95-2.7-2.95-2.95 2-.25 2.7-.95 2.95-2.95Z" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const IconArrow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const IconShield = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 7.5 3v6c0 4.6-3.2 8.3-7.5 9.3C7.7 20.3 4.5 16.6 4.5 12V6Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Svg>
);

export const IconTruck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6.5h11v10H3z" />
    <path d="M14 10h3.8l3.2 3.2v3.3H14z" />
    <circle cx="7" cy="18.5" r="1.9" />
    <circle cx="17.5" cy="18.5" r="1.9" />
  </Svg>
);

export const IconUsers = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9.2" cy="8.2" r="3.4" />
    <path d="M2.8 19.2a6.4 6.4 0 0 1 12.8 0" />
    <path d="M16.4 5.2a3.2 3.2 0 0 1 0 6.2" />
    <path d="M18.2 19.2a5.7 5.7 0 0 0-1.8-4.2" />
  </Svg>
);

export const IconClock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 6.8v5.6l3.6 2.1" />
  </Svg>
);

export const IconStar = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3.5 2.6 5.4 5.9.85-4.25 4.15 1 5.9L12 17.05 6.75 19.8l1-5.9L3.5 9.75l5.9-.85Z" />
  </Svg>
);

export const IconTarget = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="12" cy="12" r="1" />
  </Svg>
);

export const IconEye = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 12S6.2 5.8 12 5.8 21.5 12 21.5 12 17.8 18.2 12 18.2 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const IconInfinity = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 8.5c-2 0-3.6 1.6-3.6 3.5S5 15.5 7 15.5c4 0 6-7 10-7 2 0 3.6 1.6 3.6 3.5S19 15.5 17 15.5c-4 0-6-7-10-7Z" />
  </Svg>
);

export const IconBolt = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.2 2.5 5 13.6h5.6L9.8 21.5 18.5 10h-6Z" />
  </Svg>
);

export const IconBook = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 4.5h5.5A2.5 2.5 0 0 1 12 7v12.5a2.2 2.2 0 0 0-2.2-2H4Z" />
    <path d="M20 4.5h-5.5A2.5 2.5 0 0 0 12 7v12.5a2.2 2.2 0 0 1 2.2-2H20Z" />
  </Svg>
);

export const IconAward = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="9" r="5.4" />
    <path d="m8.6 13.4-1.4 7.1 4.8-2.4 4.8 2.4-1.4-7.1" />
  </Svg>
);

export const IconMail = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.4" />
    <path d="m3.8 7.2 8.2 5.6 8.2-5.6" />
  </Svg>
);

export const IconPhone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.2 3h2.9l1.5 3.9-2 1.5a12.2 12.2 0 0 0 6 6l1.5-2 3.9 1.5v2.9a2 2 0 0 1-2.2 2A17.2 17.2 0 0 1 5.2 5.2 2 2 0 0 1 7.2 3Z" />
  </Svg>
);

export const IconPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21.2s7-5.9 7-11.2a7 7 0 1 0-14 0c0 5.3 7 11.2 7 11.2Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const IconPlay = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6.8 17 12l-8 5.2Z" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/*  Category slug → icon. Falls back to the generic signal glyph so a   */
/*  new category added in lib/data.ts still renders something sane.     */
/* ------------------------------------------------------------------ */
const byCategory: Record<string, (p: IconProps) => ReactNode> = {
  iot: IconSignal,
  embedded: IconChip,
  lora: IconTower,
  "ai-ml": IconBrain,
  robotics: IconRobot,
  "raspberry-pi": IconBoard,
  arduino: IconPlug,
  esp32: IconWifi,
  industrial: IconFactory,
  agri: IconLeaf,
  "smart-home": IconHome,
};

export function CategoryIcon({
  slug,
  className,
  strokeWidth,
}: { slug: string } & IconProps) {
  const Glyph = byCategory[slug] ?? IconSignal;
  return <>{Glyph({ className, strokeWidth })}</>;
}
