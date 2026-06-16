"use client";

import { useState } from "react";
import { Button } from "./ui";
import { Input } from "./Field";

// Demo registry — replace with a DB lookup / signed-credential check.
const registry: Record<string, { name: string; program: string; date: string }> =
  {
    "INV-2026-IOT-0421": {
      name: "Sneha Kulkarni",
      program: "IoT with ESP32 — Bootcamp",
      date: "Feb 2026",
    },
    "INV-2026-AI-1187": {
      name: "Rahul Verma",
      program: "Edge AI & Computer Vision",
      date: "Apr 2026",
    },
  };

export default function CertVerify() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<
    null | { ok: true; data: (typeof registry)[string] } | { ok: false }
  >(null);

  function verify(e: React.FormEvent) {
    e.preventDefault();
    const key = id.trim().toUpperCase();
    const data = registry[key];
    setResult(data ? { ok: true, data } : { ok: false });
  }

  return (
    <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card sm:p-8">
      <form onSubmit={verify} className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter Certificate ID (e.g. INV-2026-IOT-0421)"
          className="flex-1"
        />
        <Button type="submit" size="lg">
          Verify
        </Button>
      </form>

      {result && result.ok && (
        <div className="mt-5 flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
            ✓
          </span>
          <div>
            <div className="font-bold text-emerald-800">Valid certificate</div>
            <div className="mt-1 text-sm text-emerald-900/80">
              Issued to <strong>{result.data.name}</strong> for{" "}
              <strong>{result.data.program}</strong> · {result.data.date}
            </div>
          </div>
        </div>
      )}
      {result && !result.ok && (
        <div className="mt-5 flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-500 text-white">
            ✕
          </span>
          <div className="text-sm text-red-800">
            No certificate found for that ID. Try{" "}
            <button
              type="button"
              onClick={() => setId("INV-2026-IOT-0421")}
              className="font-semibold underline"
            >
              a sample ID
            </button>
            .
          </div>
        </div>
      )}
    </div>
  );
}
