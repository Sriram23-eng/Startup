"use client";

import { useState } from "react";
import { categories } from "@/lib/data";
import { Button } from "./ui";
import { Label, Input, Select, Textarea } from "./Field";

export default function InternshipForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [refId, setRefId] = useState("");
  const [form, setForm] = useState({
    name: "",
    college: "",
    email: "",
    phone: "",
    domain: categories[0].slug,
    duration: "4 weeks",
    mode: "Remote",
    why: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "internship", ...form }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error();
      setRefId(data.id);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done")
    return (
      <div className="rounded-2xl border border-navy-700/8 bg-white p-10 text-center shadow-card">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-3xl">
          ✓
        </div>
        <h3 className="mt-5 text-2xl font-extrabold text-navy-800">
          Application submitted!
        </h3>
        <p className="mt-2 text-navy-700/65">
          Track it with reference{" "}
          <span className="font-mono font-bold text-brand-700">{refId}</span> in
          your student dashboard. We’ll email next steps.
        </p>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card sm:p-8"
    >
      <h3 className="text-xl font-extrabold text-navy-800">
        Apply for an internship
      </h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Full name</Label>
          <Input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <Label>College</Label>
          <Input
            value={form.college}
            onChange={(e) => set("college", e.target.value)}
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div>
          <Label>Domain</Label>
          <Select
            value={form.domain}
            onChange={(e) => set("domain", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Duration</Label>
          <Select
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
          >
            <option>2 weeks</option>
            <option>4 weeks</option>
            <option>8 weeks</option>
            <option>3 months</option>
            <option>6 months</option>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label hint="optional">Why this domain?</Label>
          <Textarea
            rows={3}
            value={form.why}
            onChange={(e) => set("why", e.target.value)}
            placeholder="Tell us about your interest & any projects…"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full">
        {status === "sending" ? "Submitting…" : "Submit application →"}
      </Button>
    </form>
  );
}
