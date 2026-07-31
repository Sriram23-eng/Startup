import Image from "next/image";
import Link from "next/link";
import { Project, categoryName } from "@/lib/data";
import { formatINR } from "@/lib/site";
import { IconArrow } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  Featured kits as a stacked-cards scroll reveal (after the Jitter    */
/*  "Stacked cards" template). Pure CSS: each card is sticky at a        */
/*  slightly lower offset, so scrolling piles them into a deck. No JS.   */
/* ------------------------------------------------------------------ */
export default function StackedKits({ projects }: { projects: Project[] }) {
  const kits = projects.slice(0, 4);
  if (!kits.length) return null;

  return (
    <section className="py-16 lg:py-20">
      <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        {/* heading pinned on the left while the stack scrolls beside it */}
        <div className="reveal lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
            Featured kits
          </div>
          <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl lg:text-[2.7rem]">
            Order today, build this weekend
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-600">
            Hardware, source code, documentation and circuit diagrams in one
            box. Scroll to flip through the stack.
          </p>
          <Link
            href="/projects"
            className="mt-7 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-ink-900 shadow-card transition-colors hover:border-brand-200 hover:text-brand-600"
          >
            Browse all kits
            <IconArrow className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        {/* the stacked cards */}
        <div>
          {kits.map((k, i) => (
            <div
              key={k.slug}
              className="sticky"
              style={{ top: `${96 + i * 22}px` }}
            >
              <article className="mb-6 grid overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-lift sm:grid-cols-2">
                <div className="relative aspect-[16/11] sm:aspect-auto sm:min-h-[17rem]">
                  <Image
                    src={k.image}
                    alt={k.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-sm font-black text-ink-900 shadow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-col justify-center p-7 lg:p-8">
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {categoryName(k.category)}
                  </div>
                  <h3 className="mt-2 text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                    {k.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-600">
                    {k.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-5">
                    <Link
                      href={`/projects/${k.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 active:scale-[0.98]"
                    >
                      View kit
                      <IconArrow className="h-4 w-4" strokeWidth={2} />
                    </Link>
                    <span className="text-lg font-black tracking-tight text-ink-900">
                      {formatINR(k.price)}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
