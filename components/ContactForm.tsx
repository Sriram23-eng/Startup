"use client";

import { useState } from "react";
import { Button } from "./ui";
import { Label, Input, Textarea, Select } from "./Field";

const topics = [
  "Buy a project kit",
  "Custom project / quote",
  "Workshop / training",
  "Online course",
  "Internship",
  "Partnership",
  "Something else",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: topics[0],
    message: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...form }),
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
          Message sent!
        </h3>
        <p className="mt-2 text-navy-700/65">
          Thanks for reaching out — we’ll get back to you within one business
          day.
        </p>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card sm:p-8"
    >
      <h3 className="text-xl font-extrabold text-navy-800">Send us a message</h3>
      <p className="mt-1 text-sm text-navy-700/55">
        We usually reply within a few hours.
      </p>
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
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div>
          <Label hint="optional">Phone</Label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <Label>I’m interested in</Label>
          <Select value={form.topic} onChange={(e) => set("topic", e.target.value)}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>Message</Label>
          <Textarea
            rows={5}
            required
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us a bit about what you need…"
          />
        </div>
      </div>
      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
      <Button type="submit" size="lg" className="mt-6 w-full">
        {status === "sending" ? "Sending…" : "Send message →"}
      </Button>
    </form>
  );
}
