"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 overflow-hidden rounded-2xl border border-navy-700/10 bg-white shadow-glow animate-rise">
          <div className="bg-navy-800 p-4 text-white">
            <div className="font-bold">Chat with us 👋</div>
            <div className="text-xs text-brand-100/70">
              Typically replies in a few minutes
            </div>
          </div>
          <div className="space-y-2 p-4 text-sm">
            <a
              href={`https://wa.me/${site.whatsapp.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <span className="text-lg">🟢</span> WhatsApp us
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 rounded-xl bg-brand-50 p-3 font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              <span className="text-lg">✉️</span> Email support
            </a>
            <a
              href="/custom-project"
              className="flex items-center gap-3 rounded-xl bg-navy-700/5 p-3 font-semibold text-navy-700 transition hover:bg-navy-700/10"
            >
              <span className="text-lg">📝</span> Request a quote
            </a>
          </div>
        </div>
      )}
      <button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-2xl text-white shadow-glow transition hover:scale-105 hover:bg-brand-700"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
