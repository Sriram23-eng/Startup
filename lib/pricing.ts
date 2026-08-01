import { getCurrentUser } from "./auth";
import type { Project, Course } from "./data";

/* ------------------------------------------------------------------ */
/*  Price visibility gate.                                             */
/*                                                                      */
/*  Prices are shown only to signed-in accounts — student or college,   */
/*  both count. Everyone else sees a sign-in prompt in their place.      */
/*                                                                      */
/*  Two rules make this real rather than cosmetic:                      */
/*                                                                      */
/*  1. Any page that calls this MUST be dynamically rendered. A         */
/*     prerendered page is cached and served to everyone, so a          */
/*     logged-in visitor's copy would leak prices to logged-out ones.   */
/*  2. Data crossing into a client component MUST be stripped, not      */
/*     merely hidden in JSX. Props are serialised into the HTML         */
/*     payload, so an unstripped price is readable in view-source even  */
/*     when nothing renders it.                                         */
/* ------------------------------------------------------------------ */

/** True when the current visitor may see prices. */
export async function canSeePrices(): Promise<boolean> {
  return Boolean(await getCurrentUser());
}

/**
 * Remove price figures from projects before they are serialised to the
 * client. `price` stays a number for type compatibility — callers must
 * pair this with `showPrices={false}` so nothing renders the zero.
 */
export function stripProjectPrices(rows: Project[]): Project[] {
  return rows.map((p) => ({
    ...p,
    price: 0,
    originalPrice: null,
    priceOptions: "",
  }));
}

/** Same for courses. `oldPrice` is optional here, so drop it entirely. */
export function stripCoursePrices(rows: Course[]): Course[] {
  return rows.map(({ oldPrice: _drop, ...c }) => {
    void _drop;
    return { ...c, price: 0 };
  });
}
