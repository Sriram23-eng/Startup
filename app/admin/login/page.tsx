"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Label, Input } from "@/components/Field";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setStatus("idle");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-navy-900 p-4">
      <div className="mesh pointer-events-none fixed inset-0 opacity-40" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-glow"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-navy-800 text-white">
            <span className="text-sm font-black">MS</span>
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-accent" />
          </span>
          <div>
            <div className="font-extrabold text-navy-800">MS Admin</div>
            <div className="text-xs text-navy-700/50">Sign in to continue</div>
          </div>
        </div>

        <div className="mt-6">
          <Label>Password</Label>
          <Input
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-5 w-full">
          {status === "sending" ? "Signing in…" : "Sign in"}
        </Button>

        <p className="mt-4 text-center text-xs text-navy-700/40">
          Default password: <span className="font-mono font-bold">admin123</span>{" "}
          — change it via the <span className="font-mono">ADMIN_PASSWORD</span> env var.
        </p>
      </form>
    </div>
  );
}
