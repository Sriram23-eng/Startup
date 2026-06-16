"use client";

import { useState } from "react";
import { Button } from "./ui";
import { Label, Input } from "./Field";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Stub — wire to Clerk / Auth.js. Simulate success.
    setTimeout(() => setStatus("done"), 700);
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
                {mode === "login"
                  ? "Welcome back."
                  : "Start building with us."}
              </h2>
              <p className="mt-3 text-brand-100/70">
                Your orders, downloads, courses, internship status and
                certificates — all in one place.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-brand-100/80">
                {[
                  "Track orders & custom projects",
                  "Download source code & certificates",
                  "Manage course & internship progress",
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
          {status === "done" ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-3xl">
                  ✓
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-navy-800">
                  {mode === "login" ? "Signed in!" : "Account created!"}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-navy-700/60">
                  This is a UI demo — connect Clerk or Auth.js to make it real.
                </p>
                <Button href="/dashboard" className="mt-6">
                  Go to dashboard →
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="inline-flex rounded-xl bg-brand-50/70 p-1">
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
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

              {/* Social */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-navy-700/12 py-2.5 text-sm font-semibold text-navy-700 transition hover:bg-brand-50">
                  <span>G</span> Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-navy-700/12 py-2.5 text-sm font-semibold text-navy-700 transition hover:bg-brand-50">
                  <span>🐙</span> GitHub
                </button>
              </div>

              <div className="my-5 flex items-center gap-3 text-xs text-navy-700/40">
                <span className="h-px flex-1 bg-navy-700/10" />
                or with email
                <span className="h-px flex-1 bg-navy-700/10" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                {mode === "register" && (
                  <div>
                    <Label>Full name</Label>
                    <Input required placeholder="Jane Doe" />
                  </div>
                )}
                <div>
                  <Label>Email</Label>
                  <Input type="email" required placeholder="you@email.com" />
                </div>
                <div>
                  <Label
                    hint={mode === "login" ? "Forgot?" : undefined}
                  >
                    Password
                  </Label>
                  <Input type="password" required placeholder="••••••••" />
                </div>
                {mode === "register" && (
                  <label className="flex items-start gap-2 text-xs text-navy-700/60">
                    <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-brand-600" />
                    I agree to the Terms of Service and Privacy Policy.
                  </label>
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
                      onClick={() => setMode("login")}
                      className="font-semibold text-brand-600 hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
              <p className="mt-2 text-center text-xs text-navy-700/35">
                UI demo · not connected to authentication yet
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
