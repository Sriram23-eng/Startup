"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Label, Input, Textarea, Select } from "@/components/Field";
import { Button } from "@/components/ui";
import PriceOptionsEditor from "@/components/admin/PriceOptionsEditor";

export type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "checkbox" | "list" | "priceOptions";
  options?: { value: string; label: string }[];
  hint?: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
};

export type Column = {
  key: string;
  label: string;
  render?: (item: Record<string, unknown>) => ReactNode;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CrudManager({
  endpoint,
  fields,
  columns,
  newLabel,
  titleKey = "title",
  defaults,
}: {
  endpoint: string;
  fields: Field[];
  columns: Column[];
  newLabel: string;
  titleKey?: string;
  defaults: Record<string, any>;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(endpoint, { cache: "no-store" });
    setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((it) =>
        String(it[titleKey] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [items, search, titleKey]
  );

  function formFromItem(item: any) {
    const f: Record<string, any> = {};
    for (const fld of fields) {
      const v = item?.[fld.name];
      if (fld.type === "list") f[fld.name] = Array.isArray(v) ? v.join("\n") : v ?? "";
      else if (fld.type === "checkbox") f[fld.name] = Boolean(v);
      else f[fld.name] = v ?? "";
    }
    return f;
  }

  function openNew() {
    setIsNew(true);
    setEditingSlug(null);
    setForm(formFromItem(defaults));
    setError("");
    setOpen(true);
  }
  function openEdit(item: any) {
    setIsNew(false);
    setEditingSlug(item.slug);
    setForm(formFromItem(item));
    setError("");
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isNew ? endpoint : `${endpoint}/${editingSlug}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Save failed");
      setOpen(false);
      await load();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: any) {
    if (!confirm(`Delete “${item[titleKey]}”? This cannot be undone.`)) return;
    await fetch(`${endpoint}/${item.slug}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-56 rounded-xl border border-navy-700/12 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <Button onClick={openNew}>+ {newLabel}</Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card">
        {loading ? (
          <div className="p-12 text-center text-navy-700/50">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-navy-700/50">
            Nothing yet. Click “{newLabel}”.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700/8 bg-brand-50/40 text-left text-xs font-bold uppercase tracking-wide text-navy-700/50">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/8">
              {filtered.map((item) => (
                <tr key={item.slug} className="hover:bg-brand-50/20">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-navy-800">
                      {c.render ? c.render(item) : String(item[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(item)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-3 text-xs text-navy-700/45">
        {filtered.length} item{filtered.length !== 1 && "s"} · changes reflect on
        the live site immediately.
      </p>

      {/* Editor modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-glow sm:p-8"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-navy-800">
                {isNew ? `New ${newLabel.replace(/^Add /, "")}` : "Edit"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg text-navy-700/50 hover:bg-brand-50"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((fld) => (
                <div
                  key={fld.name}
                  className={
                    fld.full ||
                    fld.type === "textarea" ||
                    fld.type === "list" ||
                    fld.type === "priceOptions"
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  {fld.type === "checkbox" ? (
                    <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-navy-800">
                      <input
                        type="checkbox"
                        checked={!!form[fld.name]}
                        onChange={(e) =>
                          setForm({ ...form, [fld.name]: e.target.checked })
                        }
                        className="h-4 w-4 accent-brand-600"
                      />
                      {fld.label}
                    </label>
                  ) : (
                    <>
                      <Label hint={fld.hint}>{fld.label}</Label>
                      {fld.type === "priceOptions" ? (
                        <PriceOptionsEditor
                          value={form[fld.name] ?? ""}
                          onChange={(v) => setForm({ ...form, [fld.name]: v })}
                        />
                      ) : fld.type === "textarea" || fld.type === "list" ? (
                        <Textarea
                          rows={fld.type === "list" ? 4 : 3}
                          required={fld.required}
                          placeholder={
                            fld.placeholder ||
                            (fld.type === "list" ? "One per line…" : "")
                          }
                          value={form[fld.name] ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, [fld.name]: e.target.value })
                          }
                        />
                      ) : fld.type === "select" ? (
                        <Select
                          value={form[fld.name] ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, [fld.name]: e.target.value })
                          }
                        >
                          {fld.options?.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Input
                          type={fld.type === "number" ? "number" : "text"}
                          required={fld.required}
                          placeholder={fld.placeholder}
                          value={form[fld.name] ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, [fld.name]: e.target.value })
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
