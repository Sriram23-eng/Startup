import Link from "next/link";
import Image from "next/image";
import { Project, categoryName } from "@/lib/data";
import { formatMoney } from "@/lib/site";

export default function ProjectCard({ project }: { project: Project }) {
  const currency = project.currency || "INR";
  const off =
    project.originalPrice && project.originalPrice > project.price
      ? Math.round((1 - project.price / project.originalPrice) * 100)
      : 0;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-950/50 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {project.badge && (
            <span className="rounded-full bg-navy-800/90 px-2.5 py-1 text-[11px] font-bold text-cyan-accent shadow">
              {project.badge}
            </span>
          )}
          {project.readyMade && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy-800 shadow">
              Ready-made kit
            </span>
          )}
          {off > 0 && (
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
              -{off}%
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-navy-800/85 px-2.5 py-1 text-[11px] font-bold text-cyan-accent backdrop-blur">
          {project.size}
        </div>
        {project.youtube && (
          <div className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-600 shadow opacity-0 transition group-hover:opacity-100">
            ▶
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-brand-600">
          <span>{categoryName(project.category)}</span>
          <span className="text-navy-700/30">•</span>
          <span className="flex items-center gap-1 text-amber-500">
            ★ <span className="text-navy-700/70">{project.rating}</span>
            <span className="font-normal text-navy-700/40">({project.reviews})</span>
          </span>
        </div>
        <h3 className="text-base font-bold leading-snug text-navy-800 group-hover:text-brand-700">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy-700/60">
          {project.summary}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-navy-700/8 pt-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-navy-700/40">
              Starting at
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-lg font-extrabold text-navy-800">
                {formatMoney(project.price, currency)}
              </div>
              {off > 0 && (
                <span className="text-xs text-navy-700/40 line-through">
                  {formatMoney(project.originalPrice!, currency)}
                </span>
              )}
            </div>
          </div>
          <span className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
