import Link from "next/link";
import type { ReactNode } from "react";
import { workshopTracks, type WorkshopTrackSlug } from "@/lib/data";
import { IconArrow, IconCap, IconFactory, IconPin, IconWifi } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  The four workshop formats as cards. Used on the /workshops hub and  */
/*  at the foot of each track page ("other formats"), so the delivery   */
/*  options are reachable from anywhere in the section.                 */
/* ------------------------------------------------------------------ */
type Glyph = (p: { className?: string; strokeWidth?: number }) => ReactNode;

const trackIcon: Record<WorkshopTrackSlug, Glyph> = {
  online: IconWifi,
  offline: IconPin,
  fdp: IconCap,
  corporate: IconFactory,
};

export default function WorkshopTrackNav({
  /** Current track — rendered as a non-link "You're here" tile. */
  active,
  /** Drop the current track instead of marking it. */
  exclude = false,
  className = "",
}: {
  active?: WorkshopTrackSlug;
  exclude?: boolean;
  className?: string;
}) {
  const tracks = exclude
    ? workshopTracks.filter((t) => t.slug !== active)
    : workshopTracks;

  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 ${
        tracks.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      } ${className}`}
    >
      {tracks.map((t) => {
        const Icon = trackIcon[t.slug];
        const isActive = !exclude && t.slug === active;

        if (isActive)
          return (
            <div
              key={t.slug}
              aria-current="page"
              className="flex flex-col rounded-2xl border border-brand-200 bg-brand-50/70 p-5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div className="mt-4 font-bold text-ink-900">{t.label}</div>
              <div className="mt-1 text-sm text-ink-600">{t.navDesc}</div>
              <span className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-600">
                You’re here
              </span>
            </div>
          );

        return (
          <Link
            key={t.slug}
            href={`/workshops/${t.slug}`}
            className="group flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card lift hover:border-brand-200 hover:shadow-lift"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <Icon className="h-5 w-5" />
            </span>
            <div className="mt-4 font-bold text-ink-900">{t.label}</div>
            <div className="mt-1 flex-1 text-sm text-ink-600">{t.navDesc}</div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600">
              Explore
              <IconArrow
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
