"use client";

import { useState } from "react";
import { categories, sizeBands } from "@/lib/data";
import { Button } from "./ui";
import { Label, Input, Textarea, Select } from "./Field";

const steps = ["Your details", "Project scope", "Budget & timeline"];

export default function CustomProjectForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [refId, setRefId] = useState("");
  const [form, setForm] = useState({
    name: "",
    org: "",
    email: "",
    phone: "",
    domain: categories[0].slug,
    title: "",
    description: "",
    budget: "Medium",
    deadline: "",
    purpose: "Academic",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canNext =
    step === 0
      ? form.name && (form.email || form.phone)
      : step === 1
      ? form.title && form.description
      : true;

  async function submit() {
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "custom-project", ...form }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error();
      setRefId(data.id);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-navy-700/8 bg-white p-10 text-center shadow-card">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-3xl">
          ✓
        </div>
        <h3 className="mt-5 text-2xl font-extrabold text-navy-800">
          Request received!
        </h3>
        <p className="mt-2 text-navy-700/65">
          Your reference is{" "}
          <span className="font-mono font-bold text-brand-700">{refId}</span>.
          Our team will review your requirement and send a quotation within{" "}
          <strong>24–48 hours</strong>.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <StatusFlow active={0} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card sm:p-8">
      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                i <= step
                  ? "bg-brand-600 text-white"
                  : "bg-brand-50 text-navy-700/40"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              className={`hidden text-sm font-semibold sm:block ${
                i <= step ? "text-navy-800" : "text-navy-700/40"
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 rounded ${
                  i < step ? "bg-brand-600" : "bg-brand-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Full name *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div className="sm:col-span-2">
            <Label hint="optional">College / Company</Label>
            <Input
              value={form.org}
              onChange={(e) => set("org", e.target.value)}
              placeholder="VNR VJIET / Acme Pvt Ltd"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91 …"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Project domain</Label>
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
            <Label>Purpose</Label>
            <Select
              value={form.purpose}
              onChange={(e) => set("purpose", e.target.value)}
            >
              <option>Academic</option>
              <option>Commercial</option>
              <option>Research</option>
              <option>Hobby</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Project title *</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Solar-powered LoRa cattle tracker"
            />
          </div>
          <div className="sm:col-span-2">
            <Label hint="the more detail, the better the quote">
              Requirements / description *
            </Label>
            <Textarea
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe what it should do, key features, target users, constraints…"
            />
          </div>
          <div className="sm:col-span-2">
            <Label hint="PDF / DOC / image">Upload document</Label>
            <div className="rounded-xl border border-dashed border-navy-700/15 bg-brand-50/30 p-6 text-center text-sm text-navy-700/55">
              📎 Drag a file here or{" "}
              <span className="font-semibold text-brand-600">browse</span>
              <input type="file" className="sr-only" />
              <div className="mt-1 text-xs text-navy-700/40">
                (Upload wiring is stubbed — connect to S3 / UploadThing)
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Budget range</Label>
            <div className="grid grid-cols-3 gap-2">
              {sizeBands.map((b) => (
                <button
                  key={b.size}
                  onClick={() => set("budget", b.size)}
                  className={`rounded-xl border p-3 text-left transition ${
                    form.budget === b.size
                      ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                      : "border-navy-700/12 hover:border-brand-300"
                  }`}
                >
                  <div className="text-sm font-bold text-navy-800">
                    {b.size}
                  </div>
                  <div className="text-[11px] text-navy-700/55">{b.range}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2 rounded-xl bg-brand-50/50 p-4 text-sm text-navy-700/70">
            <strong className="text-navy-800">Review:</strong> {form.title || "—"}{" "}
            · {form.purpose} · {form.budget} budget
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={step === 0 ? "invisible" : ""}
        >
          ← Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => canNext && setStep((s) => s + 1)}>
            Continue →
          </Button>
        ) : (
          <Button onClick={submit}>
            {status === "sending" ? "Submitting…" : "Submit request"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function StatusFlow({ active = 0 }: { active?: number }) {
  const stages = [
    "Request submitted",
    "Requirement review",
    "Quotation sent",
    "Approval",
    "Development",
    "Delivery",
  ];
  return (
    <ol className="space-y-3">
      {stages.map((s, i) => (
        <li key={s} className="flex items-center gap-3">
          <span
            className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
              i <= active
                ? "bg-brand-600 text-white"
                : "bg-brand-50 text-navy-700/40"
            }`}
          >
            {i + 1}
          </span>
          <span
            className={`text-sm font-medium ${
              i <= active ? "text-navy-800" : "text-navy-700/45"
            }`}
          >
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}
