"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type Enrollment = {
  id: string;
  courseSlug: string;
  courseTitle: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  user: { id: string; name: string; email: string } | null;
};

const badge: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-600",
};

export default function AdminEnrollments() {
  const [rows, setRows] = useState<Enrollment[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/enrollments");
    const data = await res.json();
    setRows(data.enrollments ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: Enrollment["status"]) {
    setBusy(id);
    try {
      await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, status } : r)) ?? rs);
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminShell title="Reservations">
      <p className="mb-5 text-sm text-navy-700/60">
        Approve a reservation to unlock the course&apos;s recorded classes and AI
        tutor for that student (do this after they&apos;ve paid).
      </p>

      {rows === null ? (
        <div className="rounded-2xl border border-navy-700/8 bg-white p-10 text-center text-navy-700/50 shadow-card">
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-700/15 bg-white p-10 text-center text-navy-700/55">
          No reservations yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-brand-50/50 text-left text-xs font-bold uppercase tracking-wide text-navy-700/50">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/8">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-navy-800">
                      {r.user?.name ?? "—"}
                    </div>
                    <div className="text-xs text-navy-700/50">
                      {r.user?.email ?? ""}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-navy-700/80">{r.courseTitle}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                        badge[r.status]
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      {r.status !== "approved" && (
                        <button
                          disabled={busy === r.id}
                          onClick={() => setStatus(r.id, "approved")}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button
                          disabled={busy === r.id}
                          onClick={() => setStatus(r.id, "rejected")}
                          className="rounded-lg border border-navy-700/12 px-3 py-1.5 text-xs font-bold text-navy-700/70 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
