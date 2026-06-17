"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui";
import { Label, Input } from "./Field";

export default function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Something went wrong.");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-navy-700/8 bg-white shadow-glow">
      <div className="grid md:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden bg-navy-800 p-10 text-white md:block">
          <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-2.5">
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <span className="text-[13px] font-black">MS</span>
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-accent" />
              </span>
              <span className="font-extrabold">MS Project &amp; Tech Solution</span>
            </div>
            <div className="mt-auto">
              <h2 className="text-3xl font-black leading-tight">
                {mode === "login" ? "Welcome back." : "Start learning with us."}
              </h2>
              <p className="mt-3 text-brand-100/70">
                Reserve a seat, watch recorded classes, and chat with the
                course AI tutor — all in one place.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-brand-100/80">
                {[
                  "Reserve a seat in any course",
                  "Watch recorded class videos",
                  "Ask the course AI tutor anything",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-accent/20 text-[11px] text-cyan-accent">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          {/* Tabs */}
          <div className="inline-flex rounded-xl bg-brand-50/70 p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition ${
                  mode === m
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-navy-700/60 hover:text-navy-800"
                }`}
              >
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          <h3 className="mt-6 text-2xl font-extrabold text-navy-800">
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </h3>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div>
                <Label>Full name</Label>
                <Input
                  required
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                required
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full">
              {status === "sending"
                ? "Please wait…"
                : mode === "login"
                ? "Sign in"
                : "Create account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-navy-700/55">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
