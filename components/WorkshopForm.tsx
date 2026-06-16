"use client";

import { useState } from "react";
import { workshops } from "@/lib/data";
import { Button } from "./ui";
import { Label, Input, Textarea, Select } from "./Field";

export default function WorkshopForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [form, setForm] = useState({
    org: "",
    contact: "",
    email: "",
    phone: "",
    participants: "20-40",
    mode: "Offline",
    topic: workshops[0].title,
    duration: "",
    budget: "",
    date: "",
    notes: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "workshop", ...form }),
      });
      if (!(await res.json()).ok) throw new Error();
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
          Booking request sent!
        </h3>
        <p className="mt-2 text-navy-700/65">
          Our training team will reach out with a customised proposal shortly.
        </p>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card sm:p-8"
    >
      <h3 className="text-xl font-extrabold text-navy-800">
        Book a workshop / training
      </h3>
      <p className="mt-1 text-sm text-navy-700/55">
        Share your needs — we’ll send a tailored proposal & quote.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Organization name</Label>
          <Input
            required
            value={form.org}
            onChange={(e) => set("org", e.target.value)}
            placeholder="College / Company"
          />
        </div>
        <div>
          <Label>Contact person</Label>
          <Input
            required
            value={form.contact}
            onChange={(e) => set("contact", e.target.value)}
            placeholder="Coordinator name"
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
          <Label>Mode</Label>
          <Select value={form.mode} onChange={(e) => set("mode", e.target.value)}>
            <option>Online</option>
            <option>Offline</option>
            <option>Field workshop</option>
            <option>Internship</option>
            <option>Corporate training</option>
            <option>College workshop</option>
            <option>FDP</option>
          </Select>
        </div>
        <div>
          <Label>Participants</Label>
          <Select
            value={form.participants}
            onChange={(e) => set("participants", e.target.value)}
          >
            <option>Under 20</option>
            <option>20-40</option>
            <option>40-80</option>
            <option>80+</option>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>Topic / program</Label>
          <Select value={form.topic} onChange={(e) => set("topic", e.target.value)}>
            {workshops.map((w) => (
              <option key={w.slug}>{w.title}</option>
            ))}
            <option>Custom topic (mention below)</option>
          </Select>
        </div>
        <div>
          <Label hint="optional">Duration</Label>
          <Input
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="e.g. 3 days"
          />
        </div>
        <div>
          <Label hint="optional">Preferred date</Label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label hint="optional">Budget</Label>
          <Input
            value={form.budget}
            onChange={(e) => set("budget", e.target.value)}
            placeholder="Indicative budget"
          />
        </div>
        <div className="sm:col-span-2">
          <Label hint="optional">Notes</Label>
          <Textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Anything specific you'd like covered…"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" className="w-full">
          {status === "sending" ? "Sending…" : "Request proposal →"}
        </Button>
      </div>
    </form>
  );
}
