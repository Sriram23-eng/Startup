"use client";

import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import { CategoryIcon } from "@/components/icons";
import { categories, sizeBands, Size, Project } from "@/lib/data";

export default function ProjectsExplorer({
  projects,
  initialCat = "all",
  initialQuery = "",
}: {
  projects: Project[];
  initialCat?: string;
  initialQuery?: string;
}) {
  const [cat, setCat] = useState(initialCat);
  const [size, setSize] = useState<Size | "all">("all");
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<"popular" | "low" | "high">("popular");

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      const okCat = cat === "all" || p.category === cat;
      const okSize = size === "all" || p.size === size;
      const okQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.includes(query.toLowerCase()));
      return okCat && okSize && okQuery;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [cat, size, query, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* ---------------- Sidebar filters ---------------- */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <label className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              ⌕
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-xl border border-line-strong bg-brand-50/30 py-2.5 pl-9 pr-3 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>

          <FilterGroup title="Project size">
            <Chip active={size === "all"} onClick={() => setSize("all")}>
              Any size
            </Chip>
            {sizeBands.map((b) => (
              <Chip
                key={b.size}
                active={size === b.size}
                onClick={() => setSize(b.size)}
              >
                {b.size}{" "}
                <span className="text-[10px] opacity-60">{b.range}</span>
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup title="Category">
            <Chip active={cat === "all"} onClick={() => setCat("all")}>
              All domains
            </Chip>
            {categories.map((c) => (
              <Chip
                key={c.slug}
                active={cat === c.slug}
                onClick={() => setCat(c.slug)}
              >
                <CategoryIcon slug={c.slug} className="h-3.5 w-3.5" /> {c.name}
              </Chip>
            ))}
          </FilterGroup>
        </div>
      </aside>

      {/* ---------------- Results ---------------- */}
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink-600">
            <span className="font-bold text-ink-900">{filtered.length}</span>{" "}
            project{filtered.length !== 1 && "s"} found
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-ink-400">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-lg border border-line-strong bg-white px-3 py-2 font-medium text-ink-900 outline-none focus:border-brand-400"
            >
              <option value="popular">Most popular</option>
              <option value="low">Price: low → high</option>
              <option value="high">Price: high → low</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong bg-white p-16 text-center">
            <p className="font-black tracking-tight text-ink-900">No matches</p>
            <p className="mt-1 text-sm text-ink-600">
              Try clearing filters or request a custom build.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 border-t border-line pt-4">
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">
        {title}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-brand-600 text-white shadow-[0_6px_16px_-8px_rgba(29,71,219,0.8)]"
          : "bg-brand-50/60 text-ink-700 hover:bg-brand-100"
      }`}
    >
      {children}
    </button>
  );
}
