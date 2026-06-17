import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categoryName } from "@/lib/data";
import { getProjects, getProjectBySlug, parseSpecs } from "@/lib/store";
import { formatMoney } from "@/lib/site";
import { Badge } from "@/components/ui";
import BuyActions from "@/components/BuyActions";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

const FALLBACK = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.metaTitle || p.title,
    description: p.metaDescription || p.summary,
    openGraph: p.ogImage ? { images: [p.ogImage] } : undefined,
  };
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

  const currency = project.currency || "INR";
  const off =
    project.originalPrice && project.originalPrice > project.price
      ? Math.round((1 - project.price / project.originalPrice) * 100)
      : 0;
  const save =
    project.originalPrice && project.originalPrice > project.price
      ? project.originalPrice - project.price
      : 0;
  const specs = parseSpecs(project.specs);
  const gallery = project.gallery?.length ? project.gallery : [project.image || FALLBACK];

  return (
    <>
      <div className="container-x pt-8 text-sm text-navy-700/50">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <Link href="/projects" className="hover:text-brand-600">Projects</Link> /{" "}
        <span className="text-navy-700/80">{project.title}</span>
      </div>

      <section className="container-x grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Media */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-navy-700/8 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[0] || FALLBACK} alt={project.title} className="aspect-[16/10] w-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.slice(1, 7).map((g, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-navy-700/8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g} alt={`${project.title} ${i + 2}`} className="aspect-video w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info / purchase */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            {project.badge && <Badge tone="brand">{project.badge}</Badge>}
            <Badge tone="cyan">{categoryName(project.category)}</Badge>
            <Badge tone="soft">{project.size} project</Badge>
            {project.readyMade && <Badge tone="soft">Ready-made kit</Badge>}
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-navy-800">{project.title}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="font-semibold text-amber-500">★ {project.rating}</span>
            <span className="text-navy-700/50">{project.reviews} verified reviews</span>
          </div>
          {project.summary && (
            <p className="mt-4 leading-relaxed text-navy-700/70">{project.summary}</p>
          )}

          <div className="mt-6 rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="text-3xl font-black text-navy-800">
                {formatMoney(project.price, currency)}
              </span>
              {off > 0 && (
                <>
                  <span className="text-lg text-navy-700/40 line-through">
                    {formatMoney(project.originalPrice!, currency)}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-bold text-emerald-600">
                    -{off}% off
                  </span>
                </>
              )}
            </div>
            {save > 0 && (
              <div className="mt-1 text-sm font-semibold text-emerald-600">
                You save {formatMoney(save, currency)}
              </div>
            )}
            <div className="mt-1 text-xs text-navy-700/45">
              Inclusive of hardware, source code & documentation
            </div>
            <div className="mt-5">
              <BuyActions title={project.title} price={project.price} />
            </div>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block rounded-xl border border-navy-700/15 py-2.5 text-center text-sm font-bold text-navy-800 transition hover:bg-brand-50"
              >
                ▶ Live demo
              </a>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            {[
              ["📦", "Hardware kit"],
              ["💻", "Source code"],
              ["📄", "Documentation"],
            ].map(([i, t]) => (
              <div key={t} className="rounded-xl border border-navy-700/8 bg-brand-50/40 p-3">
                <div className="text-xl">{i}</div>
                <div className="mt-1 font-semibold text-navy-700/70">{t}</div>
              </div>
            ))}
          </div>

          {(project.license || project.version) && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {project.license && <MetaBox k="License" v={project.license} />}
              {project.version && <MetaBox k="Version" v={project.version} />}
            </div>
          )}

          <div className="mt-4 rounded-xl bg-navy-800 p-4 text-sm text-brand-100/80">
            Need this customised or in bulk for your college?{" "}
            <Link href="/custom-project" className="font-semibold text-cyan-accent hover:underline">
              Request a custom quote →
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      {project.about && (
        <section className="container-x pb-8">
          <h2 className="text-xl font-extrabold text-navy-800">About this product</h2>
          <div className="mt-3 max-w-3xl whitespace-pre-wrap leading-relaxed text-navy-700/80">
            {project.about}
          </div>
        </section>
      )}

      {/* Features / included / components / specs */}
      <section className="container-x grid gap-6 pb-8 md:grid-cols-2">
        {project.features.length > 0 && (
          <SpecCard title="Key highlights">
            <CheckList items={project.features} tone="emerald" />
          </SpecCard>
        )}
        {project.included && project.included.length > 0 && (
          <SpecCard title="What's included">
            <CheckList items={project.included} tone="brand" />
          </SpecCard>
        )}
        {project.components.length > 0 && (
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
          </SpecCard>
        )}
        {specs.length > 0 && (
          <SpecCard title="Specifications">
            <dl className="divide-y divide-navy-700/8">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 py-2 text-sm">
                  <dt className="font-semibold text-navy-700/60">{s.label}</dt>
                  <dd className="text-right text-navy-800">{s.value}</dd>
                </div>
              ))}
            </dl>
          </SpecCard>
        )}
      </section>

      {/* System requirements */}
      {project.requirements && project.requirements.length > 0 && (
        <section className="container-x pb-10">
          <SpecCard title="System requirements">
            <ul className="grid gap-2 sm:grid-cols-2">
              {project.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-navy-700/75">
                  <span className="text-brand-500">•</span> {r}
                </li>
              ))}
            </ul>
          </SpecCard>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-800">Related projects</h2>
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

function CheckList({ items, tone }: { items: string[]; tone: "emerald" | "brand" }) {
  const cls = tone === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-700";
  return (
    <ul className="space-y-3">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-3 text-sm">
          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] ${cls}`}>
            ✓
          </span>
          <span className="text-navy-700/80">{f}</span>
        </li>
      ))}
    </ul>
  );
}

function MetaBox({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-navy-700/8 bg-brand-50/40 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-navy-700/45">{k}</div>
      <div className="mt-0.5 font-semibold text-navy-800">{v}</div>
    </div>
  );
}

function SpecCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-lg font-bold text-navy-800">{title}</h3>
      {children}
    </div>
  );
}
