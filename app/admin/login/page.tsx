"use client";

import { useState } from "react";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui";
import { Label, Input } from "@/components/Field";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Sign in failed");

      // A full load, not router.push. Signing in sets the cookie that
      // middleware checks, and a client-side push would carry the pre-auth
      // router cache into /admin.
      window.location.assign("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setStatus("idle");
      setPassword("");
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-navy-900 p-4">
      <div className="mesh pointer-events-none fixed inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none fixed -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand-500/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-cyan-accent/10 blur-[140px]"
      />

      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white p-8 shadow-glow"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-brand-400">
            <LogoMark className="h-6 w-6" />
          </span>
          <div>
            <div className="text-[15px] font-extrabold tracking-tight text-ink-900">
              Elektron <span className="text-brand-600">Nexus</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">
              Admin Console
            </div>
          </div>
        </div>

        <h1 className="mt-6 text-xl font-extrabold text-navy-800">Sign in</h1>
        <p className="mt-1 text-sm text-navy-700/55">
          Manage courses, lessons, enrolments and enquiries.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <Label>Username</Label>
            <Input
              autoFocus
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={reveal ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) =>
                  setCapsOn(e.getModifierState?.("CapsLock") ?? false)
                }
                placeholder="••••••••"
                className="pr-16"
              />
              <button
                type="button"
                onClick={() => setReveal((v) => !v)}
                aria-label={reveal ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-navy-700/50 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {reveal ? "Hide" : "Show"}
              </button>
            </div>
            {capsOn && (
              <p className="mt-1.5 text-xs font-semibold text-amber-600">
                ⚠ Caps Lock is on
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-6 w-full">
          {status === "sending" ? "Signing in…" : "Sign in"}
        </Button>

        <p className="mt-5 border-t border-line pt-4 text-center text-xs text-navy-700/40">
          Staff access only. Sessions expire after 8 hours.
        </p>
      </form>
    </div>
  );
}
