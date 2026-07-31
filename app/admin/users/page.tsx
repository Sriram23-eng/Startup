"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { formatDate } from "@/lib/site";

type User = {
  id: string;
  name: string;
  email: string;
  accountType: string;
  college?: string | null;
  createdAt?: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .catch(() => setUsers([]));
  }, []);

  async function remove(u: User) {
    if (
      !confirm(
        `Delete "${u.name}" (${u.email})?\n\nThis permanently removes the user and all their reservations from the database. This cannot be undone.`
      )
    )
      return;
    setBusy(u.id);
    try {
      await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      setUsers((list) => (list ?? []).filter((x) => x.id !== u.id));
    } finally {
      setBusy(null);
    }
  }

  const filtered = (users ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase()) ||
      (u.college ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AdminShell title="Users">
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        🔒 Passwords are stored encrypted (hashed) and cannot be shown — not even
        here. To help a user who forgot theirs, use a password reset (ask me to add
        that button).
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email or college…"
          className="w-72 rounded-xl border border-navy-700/12 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {users === null ? (
        <div className="rounded-2xl border border-navy-700/8 bg-white p-10 text-center text-navy-700/50 shadow-card">
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-700/15 bg-white p-10 text-center text-navy-700/55">
          No users found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-brand-50/50 text-left text-xs font-bold uppercase tracking-wide text-navy-700/50">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Username (email)</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">College</th>
                <th className="px-5 py-3">Password</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/8">
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3 font-semibold text-navy-800">{u.name}</td>
                  <td className="px-5 py-3 text-navy-700/80">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                        u.accountType === "college"
                          ? "bg-cyan-accent/15 text-[#0b7c8c]"
                          : "bg-brand-50 text-brand-700"
                      }`}
                    >
                      {u.accountType}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-navy-700/70">{u.college || "—"}</td>
                  <td className="px-5 py-3 text-navy-700/40">•••••••• (encrypted)</td>
                  <td className="px-5 py-3 text-navy-700/55">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <button
                        disabled={busy === u.id}
                        onClick={() => remove(u)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {busy === u.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-navy-700/45">{filtered.length} user(s)</p>
    </AdminShell>
  );
}
