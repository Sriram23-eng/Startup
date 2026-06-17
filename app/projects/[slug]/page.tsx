import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { categoryName } from "@/lib/data";
import { getProjects, getProjectBySlug } from "@/lib/store";
import { Badge, Button } from "@/components/ui";
import BuyActions from "@/components/BuyActions";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return { title: "Project not found" };
  return { title: p.title, description: p.summary };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = (await getProjects())
    .filter((p) => p.category === project.category && p.slug !== project.slug)
    .slice(0, 3);

  return (
    <>
      <div className="container-x pt-8 text-sm text-navy-700/50">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/projects" className="hover:text-brand-600">
          Projects
        </Link>{" "}
        / <span className="text-navy-700/80">{project.title}</span>
      </div>

      <section className="container-x grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Media */}
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-navy-700/8 shadow-card">
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Info / purchase */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{categoryName(project.category)}</Badge>
            <Badge tone="cyan">{project.size} project</Badge>
            {project.readyMade && <Badge tone="soft">Ready-made kit</Badge>}
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-navy-800">
            {project.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="font-semibold text-amber-500">
              ★ {project.rating}
            </span>
            <span className="text-navy-700/50">
              {project.reviews} verified reviews
            </span>
          </div>
          <p className="mt-4 leading-relaxed text-navy-700/70">
            {project.summary}
          </p>

          <div className="mt-6 rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
            <div className="text-sm text-navy-700/50">Kit price</div>
            <div className="text-3xl font-black text-navy-800">
              ₹{project.price.toLocaleString("en-IN")}
            </div>
            <div className="mt-1 text-xs text-navy-700/45">
              Inclusive of hardware, source code & documentation
            </div>
            <div className="mt-5">
              <BuyActions title={project.title} price={project.price} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            {[
              ["📦", "Hardware kit"],
              ["💻", "Source code"],
              ["📄", "Documentation"],
            ].map(([i, t]) => (
              <div
                key={t}
                className="rounded-xl border border-navy-700/8 bg-brand-50/40 p-3"
              >
                <div className="text-xl">{i}</div>
                <div className="mt-1 font-semibold text-navy-700/70">{t}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-navy-800 p-4 text-sm text-brand-100/80">
            Need this customised or in bulk for your college?{" "}
            <Link
              href="/custom-project"
              className="font-semibold text-cyan-accent hover:underline"
            >
              Request a custom quote →
            </Link>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="container-x grid gap-6 pb-8 md:grid-cols-2">
        <SpecCard title="Key features">
          <ul className="space-y-3">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-[11px] text-emerald-600">
                  ✓
                </span>
                <span className="text-navy-700/80">{f}</span>
              </li>
            ))}
          </ul>
        </SpecCard>
        <SpecCard title="Components used">
          <div className="flex flex-wrap gap-2">
            {project.components.map((c) => (
              <span
                key={c}
                className="rounded-lg border border-navy-700/10 bg-brand-50/40 px-3 py-1.5 text-sm font-medium text-navy-700/80"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-dashed border-navy-700/15 p-4 text-sm text-navy-700/60">
            📐 Includes full circuit diagram, BOM, wiring guide and a step-by-step
            setup PDF.
          </div>
        </SpecCard>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-800">
              Related projects
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function SpecCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-lg font-bold text-navy-800">{title}</h3>
      {children}
    </div>
  );
}
