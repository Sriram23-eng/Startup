"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui";
import { formatINR } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  The reserve panel that sits at the top of a course page.           */
/*                                                                      */
/*  Everything it needs is resolved on the server and handed down: who  */
/*  the visitor is, whether they already hold a seat, and whether they  */
/*  may see the fee. So the panel renders its final state in the first  */
/*  paint — no /api/auth/me round-trip, no flash of the wrong button.   */
/* ------------------------------------------------------------------ */

export type EnrollStatus = "none" | "pending" | "approved" | "rejected";

export default function CourseEnroll({
  courseSlug,
  live,
  price,
  oldPrice,
  startDate,
  schedule,
  seatsLeft,
  signedIn,
  initialStatus,
}: {
  courseSlug: string;
  live: boolean;
  /**
   * Already resolved against the price gate — `null` locks the figure.
   * Never pass the real number alongside a "hidden" flag: this is a client
   * component, so anything passed is serialised into the page payload.
   */
  price: number | null;
  oldPrice?: number | null;
  startDate?: string | null;
  schedule?: string | null;
  seatsLeft?: number | null;
  signedIn: boolean;
  initialStatus: EnrollStatus;
}) {
  const [status, setStatus] = useState<EnrollStatus>(initialStatus);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const loginHref = `/login?next=/courses/${courseSlug}`;

  async function reserve() {
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      if (res.status === 401) {
        window.location.href = loginHref;
        return;
      }
      const data = await res.json();
      if (!data.ok) throw new Error();
      // Trust the status the API reports rather than assuming "pending" —
      // a seat reserved and approved elsewhere comes back already approved.
      setStatus(data.status === "approved" ? "approved" : "pending");
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      id="enroll"
      className="scroll-mt-24 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-7"
    >
      {/* ---------- Fee ---------- */}
      {price != null ? (
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="text-4xl font-black tracking-tight text-ink-900">
            {formatINR(price)}
          </span>
          {oldPrice != null && oldPrice > price && (
            <>
              <span className="text-lg text-ink-400 line-through">
                {formatINR(oldPrice)}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-bold text-emerald-600">
                -{Math.round((1 - price / oldPrice) * 100)}% off
              </span>
            </>
          )}
        </div>
      ) : (
        <Link
          href={loginHref}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-100"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          </svg>
          Sign in to see the fee →
        </Link>
      )}

      {/* ---------- When it runs ---------- */}
      {live ? (
        (startDate || schedule || typeof seatsLeft === "number") && (
          <div className="mt-5 space-y-2 rounded-2xl bg-brand-50/70 p-4 text-sm">
            {startDate && (
              <div className="font-bold text-ink-900">Starts {startDate}</div>
            )}
            {schedule && <div className="text-ink-600">{schedule}</div>}
            {typeof seatsLeft === "number" && (
              <div className="flex items-center gap-1.5 font-bold text-red-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                Only {seatsLeft} seats left
              </div>
            )}
          </div>
        )
      ) : (
        /* A self-paced course has no dates, so without this the panel jumps
           straight from the fee to the button saying nothing about how it
           runs — which reads as missing rather than as "whenever you like". */
        <div className="mt-5 rounded-2xl bg-brand-50/70 p-4 text-sm">
          <div className="font-bold text-ink-900">Start straight away</div>
          <div className="text-ink-600">Go at your own pace · lifetime access</div>
        </div>
      )}

      {/* ---------- Action ---------- */}
      <div className="mt-6">
        {!signedIn ? (
          <>
            <Button href={loginHref} size="lg" className="w-full">
              Sign in to reserve →
            </Button>
            <p className="mt-3 text-center text-xs text-ink-400">
              Create a free account to reserve your seat
            </p>
          </>
        ) : status === "approved" ? (
          <>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
              ✓ Your access is confirmed
            </div>
            <Button href={`/learn/${courseSlug}`} size="lg" className="mt-3 w-full">
              Go to your course →
            </Button>
          </>
        ) : status === "pending" ? (
          <>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-700">
              Seat reserved — awaiting approval
            </div>
            <p className="mt-3 text-center text-xs text-ink-400">
              We&apos;ll confirm your access shortly. Track it on your{" "}
              <Link href="/dashboard" className="font-semibold text-brand-600 hover:underline">
                dashboard
              </Link>
              .
            </p>
          </>
        ) : status === "rejected" ? (
          <>
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
              This reservation wasn&apos;t approved
            </div>
            <Button href="/contact" variant="outline" size="lg" className="mt-3 w-full">
              Contact us →
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" className="w-full" onClick={reserve}>
              {busy ? "Reserving…" : live ? "Reserve your seat →" : "Enroll now →"}
            </Button>
            {failed && (
              <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">
                Something went wrong. Please try again.
              </p>
            )}
            <p className="mt-3 text-center text-xs text-ink-400">
              No payment now · we&apos;ll confirm access after payment
            </p>
          </>
        )}
      </div>
    </div>
  );
}
