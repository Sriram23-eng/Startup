import Image from "next/image";
import Link from "next/link";
import { IconArrow } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  Editorial offset image collage (after the Jitter "Blend modes"      */
/*  template): overlapping photos with a green accent block and a rule   */
/*  header, beside a short statement.                                    */
/* ------------------------------------------------------------------ */
export default function ImageCollage({ images }: { images: string[] }) {
  const [a, b] = images;
  if (!a) return null;

  return (
    <section className="overflow-hidden py-16 lg:py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-400">
          <span>In the field</span>
          <span className="hidden sm:inline">Elektron Nexus / Real builds</span>
        </div>

        <div className="relative mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Overlapping image stack */}
          <div className="relative h-[22rem] sm:h-[26rem]">
            <div className="absolute left-0 top-0 h-[68%] w-[68%] overflow-hidden rounded-2xl shadow-card ring-1 ring-line">
              <Image src={a} alt="" fill sizes="40vw" className="object-cover" />
            </div>
            {b && (
              <div className="absolute bottom-0 right-0 h-[64%] w-[58%] overflow-hidden rounded-2xl shadow-lift ring-4 ring-white">
                <Image src={b} alt="" fill sizes="35vw" className="object-cover" />
              </div>
            )}
            <div
              aria-hidden
              className="absolute bottom-8 left-[44%] h-14 w-14 rounded-xl bg-brand-500 shadow-glow"
            />
          </div>

          {/* Statement */}
          <div className="reveal">
            <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-balance text-ink-900 sm:text-4xl lg:text-[2.7rem]">
              Built to run in the real world
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-600">
              Bench-tested, documented and shipped, these are the same builds
              running on campuses and factory floors, not demos that only work
              on a slide.
            </p>
            <Link
              href="/projects"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline"
            >
              See the catalogue
              <IconArrow className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
