import type { Metadata } from "next";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import { sizeBands } from "@/lib/data";
import { getProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoT Project Kits & Catalogue",
  description:
    "Browse ready-made IoT, embedded, LoRa, AI/ML and robotics project kits. Filter by domain, size and price.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const projects = await getProjects();

  return (
    <>
      <section className="relative overflow-hidden border-b border-navy-700/8">
        <div className="mesh pointer-events-none absolute inset-0 opacity-70" />
        <div className="container-x relative py-14">
          <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
            Project kits & catalogue
          </h1>
          <p className="mt-3 max-w-2xl text-navy-700/70">
            Every kit ships with hardware, source code, documentation, circuit
            diagrams and a setup guide. Filter to find your build.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {sizeBands.map((b) => (
              <div
                key={b.size}
                className="rounded-xl border border-navy-700/8 bg-white/70 px-4 py-2 backdrop-blur"
              >
                <div className="text-xs font-bold uppercase tracking-wide text-brand-600">
                  {b.size}
                </div>
                <div className="text-sm font-semibold text-navy-800">
                  {b.range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-x">
          <ProjectsExplorer projects={projects} initialCat={cat ?? "all"} />
        </div>
      </section>
    </>
  );
}
