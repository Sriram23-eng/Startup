"use client";

import { useState } from "react";

type Row = { label: string; price: string; popular: boolean };

function parse(value: string): Row[] {
  if (!value?.trim()) return [];
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const p = line.split("|").map((s) => s.trim());
      return {
        label: p[0] || "",
        price: (p[1] || "").replace(/[^0-9.]/g, ""),
        popular: /^(popular|best|recommended|\*)$/i.test(p[2] || ""),
      };
    });
}

function serialize(rows: Row[]): string {
  return rows
    .filter((r) => r.label.trim())
    .map((r) => {
      const base = `${r.label.trim()} | ${r.price.trim()}`;
      return r.popular ? `${base} | popular` : base;
    })
    .join("\n");
}

export default function PriceOptionsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Keep rows in local state so empty/new rows persist (the serialized
  // string can't represent a row that has no label yet).
  const [rows, setRows] = useState<Row[]>(() => parse(value));

  function apply(next: Row[]) {
    setRows(next);
    onChange(serialize(next));
  }
  const setRow = (i: number, patch: Partial<Row>) =>
    apply(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () => apply([...rows, { label: "", price: "", popular: false }]);
  const removeRow = (i: number) => apply(rows.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2 rounded-xl border border-navy-700/10 bg-brand-50/30 p-3">
      {rows.length === 0 && (
        <div className="px-1 py-2 text-xs text-navy-700/50">
          No options yet — the single Price above is used. Add one or more buy options
          (e.g. Hardware Kit, Source Code, Documentation).
        </div>
      )}

      {rows.map((r, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-navy-700/10 bg-white p-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-50 text-xs font-bold text-brand-700">
            {i + 1}
          </span>
          <input
            value={r.label}
            onChange={(e) => setRow(i, { label: e.target.value })}
            placeholder="Label (e.g. Hardware Kit)"
            className="min-w-[140px] flex-1 rounded-lg border border-navy-700/12 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <div className="flex items-center rounded-lg border border-navy-700/12 px-2">
            <span className="text-sm text-navy-700/40">₹</span>
            <input
              value={r.price}
              onChange={(e) => setRow(i, { price: e.target.value.replace(/[^0-9.]/g, "") })}
              placeholder="Price"
              inputMode="numeric"
              className="w-20 px-1 py-2 text-sm outline-none"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-navy-700/70">
            <input
              type="checkbox"
              checked={r.popular}
              onChange={(e) => setRow(i, { popular: e.target.checked })}
              className="h-4 w-4 accent-brand-600"
            />
            ★ Most popular
          </label>
          <button
            type="button"
            onClick={() => removeRow(i)}
            title="Remove option"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-red-500 hover:bg-red-50"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="rounded-lg border border-dashed border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
      >
        + Add price option
      </button>
    </div>
  );
}
