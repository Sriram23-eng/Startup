"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui";
import { Label, Input } from "./Field";

const OAUTH_ERRORS: Record<string, string> = {
  google_unavailable: "Google sign-in isn’t set up yet. Use email and password.",
  google_denied: "Google sign-in was cancelled.",
  oauth_state: "That sign-in link expired. Please try again.",
  google_email: "Your Google account email isn’t verified.",
  google_failed: "Google sign-in failed. Please try again.",
};

export default function AuthForm({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [accountType, setAccountType] = useState<"student" | "college">("student");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(OAUTH_ERRORS[params.get("error") || ""] || "");
  const [form, setForm] = useState({ name: "", email: "", password: "", college: "" });

  function continueWithGoogle() {
    setGoogleLoading(true);
    window.location.href = `/api/auth/google?next=${encodeURIComponent(next)}`;
  }

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
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              accountType,
              college: accountType === "college" ? form.college : undefined,
            };
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
              <span className="font-extrabold">Elektron Nexus</span>
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

          {googleEnabled && (
            <>
              <button
                type="button"
                onClick={continueWithGoogle}
                disabled={googleLoading}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-navy-700/15 bg-white px-4 py-3 text-sm font-semibold text-navy-800 shadow-sm transition hover:bg-brand-50/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GoogleG className="h-5 w-5" />
                {googleLoading ? "Redirecting…" : "Continue with Google"}
              </button>
              <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-navy-700/40">
                <span className="h-px flex-1 bg-navy-700/10" />
                or
                <span className="h-px flex-1 bg-navy-700/10" />
              </div>
            </>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div>
                <Label>I am a…</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["student", "college"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAccountType(t)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition ${
                        accountType === t
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-navy-700/12 text-navy-700/60 hover:bg-brand-50/50"
                      }`}
                    >
                      {t === "student" ? "🎓 Student" : "🏫 College"}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {mode === "register" && (
              <div>
                <Label>{accountType === "college" ? "Contact person name" : "Full name"}</Label>
                <Input
                  required
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
            )}
            {mode === "register" && accountType === "college" && (
              <div>
                <Label>College / Institution name</Label>
                <Input
                  required
                  placeholder="e.g. ABC Institute of Technology"
                  value={form.college}
                  onChange={(e) => set("college", e.target.value)}
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

/* Official multi-colour Google "G" mark. */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}
