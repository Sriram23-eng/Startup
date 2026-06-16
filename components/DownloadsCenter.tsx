"use client";

import { useMemo, useState } from "react";
import { downloads, Download, categories, categoryName } from "@/lib/data";

const kinds: (Download["kind"] | "All")[] = [
  "All",
  "Source Code",
  "Documentation",
  "Datasheet",
  "GitHub",
];

const kindIcon: Record<string, string> = {
  "Source Code": "💻",
  Documentation: "📄",
  Datasheet: "📊",
  GitHub: "🐙",
};

export default function DownloadsCenter() {
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);

  const list = useMemo(
    () =>
      downloads.filter(
        (d) =>
          (kind === "All" || d.kind === kind) &&
          (cat === "all" || d.category === cat) &&
          (!freeOnly || d.free) &&
          (!query || d.name.toLowerCase().includes(query.toLowerCase()))
      ),
    [kind, cat, query, freeOnly]
  );

  return (
    <div>
      {/* Controls */}
      <div className="rounded-2xl border border-navy-700/8 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex flex-wrap gap-1 rounded-xl bg-brand-50/70 p-1">
            {kinds.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  kind === k
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-navy-700/60 hover:text-navy-800"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-700/70">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="h-4 w-4 accent-brand-600"
              />
              Free only
            </label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="rounded-lg border border-navy-700/12 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-brand-400"
            >
              <option value="all">All domains</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files…"
              className="rounded-lg border border-navy-700/12 bg-brand-50/30 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card">
        {list.length === 0 ? (
          <div className="p-16 text-center text-navy-700/55">
            No files match those filters.
          </div>
        ) : (
          <ul className="divide-y divide-navy-700/8">
            {list.map((d) => (
              <li
                key={d.name}
                className="flex flex-col gap-3 p-4 transition hover:bg-brand-50/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl">
                    {kindIcon[d.kind]}
                  </span>
                  <div>
                    <div className="font-semibold text-navy-800">{d.name}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-navy-700/50">
                      <span className="rounded bg-navy-700/5 px-2 py-0.5 font-medium">
                        {d.kind}
                      </span>
                      <span>{categoryName(d.category)}</span>
                      <span>·</span>
                      <span>{d.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {d.free ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                      Free
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
                      With purchase
                    </span>
                  )}
                  <a
                    href={d.href}
                    target={d.kind === "GitHub" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
                  >
                    {d.kind === "GitHub" ? "View repo" : "Download"}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-navy-700/45">
        {list.length} file{list.length !== 1 && "s"} · paid files unlock with the matching kit purchase
      </p>
    </div>
  );
}
