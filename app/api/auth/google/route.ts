import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildGoogleAuthUrl, isGoogleConfigured } from "@/lib/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Only allow same-site relative paths as the post-login destination. */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

// GET /api/auth/google — start the Google OAuth flow.
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;

  if (!isGoogleConfigured()) {
    return NextResponse.redirect(
      new URL("/login?error=google_unavailable", origin)
    );
  }

  const next = safeNext(req.nextUrl.searchParams.get("next"));
  const state = randomBytes(16).toString("hex");
  const redirectUri = `${origin}/api/auth/google/callback`;

  const res = NextResponse.redirect(buildGoogleAuthUrl({ redirectUri, state }));
  const secure = process.env.NODE_ENV === "production";
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 600, // 10 minutes to complete the round-trip
  };
  // CSRF: the callback must see this exact state back from Google.
  res.cookies.set("g_state", state, opts);
  res.cookies.set("g_next", next, opts);
  return res;
}
