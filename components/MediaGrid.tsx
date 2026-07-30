import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  Media grid with a highlighted centre tile (after the Jitter grid    */
/*  template). A 3x3 gallery of kit photos; the centre tile is ringed    */
/*  and each reveals its title on hover.                                 */
/* ------------------------------------------------------------------ */
export default function MediaGrid({ projects }: { projects: Project[] }) {
  const items = projects.slice(0, 6);
  if (items.length < 3) return null;

  return (
    <section className="border-y border-line bg-white py-12 lg:py-16">
      <div className="container-x">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              The catalogue
            </div>
            <h2 className="text-[1.8rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-3xl lg:text-4xl">
              A build for every domain
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-sm font-bold text-brand-600 hover:underline"
          >
            View all kits →
          </Link>
        </div>

        <div className="reveal-late mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((p, idx) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className={`group relative aspect-[4/3] overflow-hidden rounded-2xl ${
                idx === 1
                  ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-white"
                  : ""
              }`}
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-x-3 bottom-3 translate-y-1 text-sm font-bold text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                {p.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
