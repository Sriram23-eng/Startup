import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";

/**
 * Public lead intake — the contact, workshop, internship and custom-project
 * forms all post here. Submissions are persisted (see lib/leads.ts) and shown
 * in the admin panel at /admin/leads.
 *
 * The four forms send different field sets, so the fields the admin table needs
 * are mapped to columns below and the complete payload is stored alongside as
 * JSON. Nothing the customer typed is discarded.
 */
export const dynamic = "force-dynamic";

/* ---------------- Field limits ---------------- */
// Long enough for a genuine enquiry, short enough that the endpoint can't be
// used to push megabytes into the database.
const MAX_FIELD = 400;
const MAX_MESSAGE = 5000;
const MAX_FIELDS = 40;

// Strip control characters, keeping tab (9), newline (10) and carriage return
// (13) — the textarea fields are meant to be multi-line. Compared by char code
// so that no literal control bytes need to appear in this source file.
const KEEP_CONTROL = new Set([9, 10, 13]);

function stripControl(s: string): string {
  let out = "";
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    if (code === 127) continue;
    if (code < 32 && !KEEP_CONTROL.has(code)) continue;
    out += ch;
  }
  return out;
}

const clean = (v: unknown, max = MAX_FIELD) =>
  stripControl(String(v ?? ""))
    .trim()
    .slice(0, max);

/* ---------------- Best-effort rate limit ----------------
 * Per-instance and in-memory, so on serverless this throttles a burst from one
 * IP hitting one warm instance rather than enforcing a global quota. It is a
 * spam speed bump, not a guarantee — a durable limit needs shared state.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again in a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { ok: false, error: "Invalid request." },
        { status: 400 }
      );
    }

    const email = clean(body.email);
    const phone = clean(body.phone);
    if (!email && !phone) {
      return NextResponse.json(
        { ok: false, error: "Email or phone is required." },
        { status: 400 }
      );
    }

    // Keep every submitted field, trimmed and capped.
    const details: Record<string, string> = {};
    for (const [key, value] of Object.entries(body).slice(0, MAX_FIELDS)) {
      if (typeof value === "object" && value !== null) continue;
      const v = clean(value, MAX_MESSAGE);
      if (v) details[clean(key, 60)] = v;
    }

    const lead = await createLead({
      type: clean(body.type, 40) || "general",
      // The workshop form calls the person "contact" and the organisation
      // "org"; the internship form uses "college" for the institution.
      name: clean(body.name) || clean(body.contact),
      email,
      phone,
      org: clean(body.org) || clean(body.college),
      subject: clean(body.title) || clean(body.topic) || clean(body.domain),
      message:
        clean(body.message, MAX_MESSAGE) ||
        clean(body.description, MAX_MESSAGE) ||
        clean(body.notes, MAX_MESSAGE) ||
        clean(body.why, MAX_MESSAGE),
      details: JSON.stringify(details),
    });

    // `id` is the customer-facing reference the forms show back to the user.
    return NextResponse.json({ ok: true, id: lead.ref });
  } catch (err) {
    // A failure here means a real enquiry was about to be lost — make sure it
    // is at least recoverable from the server logs.
    console.error("[leads] failed to save enquiry", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your enquiry. Please try again." },
      { status: 500 }
    );
  }
}
