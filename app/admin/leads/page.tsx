"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

/* Types are declared locally rather than imported from lib/leads.ts — that
   module pulls in fs/crypto and must not reach the client bundle. */
type LeadStatus = "new" | "contacted" | "closed";

type Lead = {
  id: string;
  ref: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  org: string;
  subject: string;
  message: string;
  details: string;
  status: LeadStatus;
  createdAt?: string;
};

const STATUS_BADGE: Record<LeadStatus, string> = {
  new: "bg-amber-50 text-amber-700",
  contacted: "bg-sky-50 text-sky-700",
  closed: "bg-emerald-50 text-emerald-700",
};

const TYPE_LABEL: Record<string, string> = {
  contact: "Contact",
  workshop: "Workshop",
  internship: "Internship",
  "custom-project": "Custom project",
  general: "General",
};

const label = (type: string) => TYPE_LABEL[type] ?? type;

function parseDetails(details?: string): { label: string; value: string }[] {
  try {
    const obj = JSON.parse(details || "{}");
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];
    return Object.entries(obj)
      .filter(([, v]) => v !== "" && v != null)
      .map(([k, v]) => ({ label: k, value: String(v) }));
  } catch {
    return [];
  }
}

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []))
      .catch(() => setLeads([]));
  }, []);

  async function setStatus(id: string, status: LeadStatus) {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) return;
      setLeads((ls) => ls?.map((l) => (l.id === id ? { ...l, status } : l)) ?? ls);
    } finally {
      setBusy(null);
    }
  }

  async function remove(lead: Lead) {
    if (
      !confirm(
        `Delete enquiry ${lead.ref} from ${lead.name || lead.email || "unknown"}?\n\nThis cannot be undone.`
      )
    )
      return;
    setBusy(lead.id);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setLeads((ls) => (ls ?? []).filter((l) => l.id !== lead.id));
    } finally {
      setBusy(null);
    }
  }

  const types = useMemo(
    () => Array.from(new Set((leads ?? []).map((l) => l.type))).sort(),
    [leads]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (leads ?? []).filter((l) => {
      if (typeFilter !== "all" && l.type !== typeFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!needle) return true;
      return [l.ref, l.name, l.email, l.phone, l.org, l.subject, l.message]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [leads, q, typeFilter, statusFilter]);

  const newCount = (leads ?? []).filter((l) => l.status === "new").length;

  /** Export the current (filtered) view so it can be opened in Excel. */
  function exportCsv() {
    const cols = [
      "ref",
      "createdAt",
      "type",
      "status",
      "name",
      "email",
      "phone",
      "org",
      "subject",
      "message",
    ] as const;

    const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      cols.join(","),
      ...filtered.map((l) => cols.map((c) => cell(l[c])).join(",")),
    ].join("\r\n");

    // The BOM makes Excel read it as UTF-8.
    const url = URL.createObjectURL(
      new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell title="Enquiries">
      <p className="mb-5 text-sm text-navy-700/60">
        Every submission from the contact, workshop, internship and
        custom-project forms lands here. Mark one <strong>Contacted</strong> once
        you&apos;ve replied, and <strong>Closed</strong> when it&apos;s finished.
      </p>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone, reference…"
          className="w-72 rounded-xl border border-navy-700/12 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-navy-700/12 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400"
        >
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {label(t)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-navy-700/12 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>

        {newCount > 0 && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            {newCount} new
          </span>
        )}

        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="ml-auto rounded-xl border border-navy-700/12 bg-white px-3.5 py-2.5 text-sm font-bold text-navy-700/75 transition hover:bg-brand-50 disabled:opacity-40"
        >
          ⬇ Export CSV
        </button>
      </div>

      {leads === null ? (
        <div className="rounded-2xl border border-navy-700/8 bg-white p-10 text-center text-navy-700/50 shadow-card">
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-700/15 bg-white p-10 text-center text-navy-700/55">
          {leads.length === 0
            ? "No enquiries yet. Submissions from the website forms will appear here."
            : "No enquiries match this filter."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-brand-50/50 text-left text-xs font-bold uppercase tracking-wide text-navy-700/50">
              <tr>
                <th className="px-5 py-3">Received</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">From</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/8">
              {filtered.map((l) => {
                const expanded = open === l.id;
                return (
                  <Fragment key={l.id}>
                    <tr
                      className={`cursor-pointer align-top transition hover:bg-brand-50/30 ${
                        l.status === "new" ? "bg-amber-50/25" : ""
                      }`}
                      onClick={() => setOpen(expanded ? null : l.id)}
                    >
                      <td className="px-5 py-3 whitespace-nowrap text-navy-700/60">
                        {fmtDate(l.createdAt)}
                        <div className="font-mono text-[11px] text-navy-700/40">
                          {l.ref}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                          {label(l.type)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-navy-800">
                          {l.name || "—"}
                        </div>
                        {l.org && (
                          <div className="text-xs text-navy-700/50">{l.org}</div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {l.email && (
                          <a
                            href={`mailto:${l.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block text-brand-600 hover:underline"
                          >
                            {l.email}
                          </a>
                        )}
                        {l.phone && (
                          <a
                            href={`tel:${l.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block text-xs text-navy-700/60 hover:underline"
                          >
                            {l.phone}
                          </a>
                        )}
                      </td>
                      <td className="max-w-[16rem] px-5 py-3 text-navy-700/80">
                        <div className="truncate">{l.subject || "—"}</div>
                        {l.message && (
                          <div className="truncate text-xs text-navy-700/45">
                            {l.message}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                            STATUS_BADGE[l.status]
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div
                          className="flex justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {l.status !== "contacted" && (
                            <button
                              disabled={busy === l.id}
                              onClick={() => setStatus(l.id, "contacted")}
                              className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-sky-700 disabled:opacity-50"
                            >
                              Contacted
                            </button>
                          )}
                          {l.status !== "closed" && (
                            <button
                              disabled={busy === l.id}
                              onClick={() => setStatus(l.id, "closed")}
                              className="rounded-lg border border-navy-700/12 px-3 py-1.5 text-xs font-bold text-navy-700/70 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                            >
                              Close
                            </button>
                          )}
                          <button
                            disabled={busy === l.id}
                            onClick={() => remove(l)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expanded && (
                      <tr className="bg-[#f8fafc]">
                        <td colSpan={7} className="px-5 py-5">
                          {l.message && (
                            <div className="mb-4">
                              <div className="text-xs font-bold uppercase tracking-wide text-navy-700/45">
                                Message
                              </div>
                              <p className="mt-1 whitespace-pre-wrap text-navy-700/85">
                                {l.message}
                              </p>
                            </div>
                          )}
                          <div className="text-xs font-bold uppercase tracking-wide text-navy-700/45">
                            All submitted fields
                          </div>
                          <dl className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                            {parseDetails(l.details).map((d) => (
                              <div key={d.label} className="flex gap-2 text-[13px]">
                                <dt className="shrink-0 font-semibold capitalize text-navy-700/55">
                                  {d.label}:
                                </dt>
                                <dd className="min-w-0 whitespace-pre-wrap break-words text-navy-800">
                                  {d.value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-navy-700/45">
        {filtered.length} enquir{filtered.length === 1 ? "y" : "ies"} shown
        {leads && leads.length !== filtered.length ? ` of ${leads.length}` : ""} ·
        click a row for full details
      </p>
    </AdminShell>
  );
}
