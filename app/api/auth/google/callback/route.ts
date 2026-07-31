import { NextRequest, NextResponse } from "next/server";
import {
  exchangeGoogleCode,
  verifyGoogleIdToken,
  isGoogleConfigured,
} from "@/lib/google";
import { findOrCreateGoogleUser } from "@/lib/accounts";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  makeSessionToken,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeNext(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

const fail = (origin: string, code: string) =>
  NextResponse.redirect(new URL(`/login?error=${code}`, origin));

// GET /api/auth/google/callback — Google redirects back here with ?code&state.
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const sp = req.nextUrl.searchParams;

  if (!isGoogleConfigured()) return fail(origin, "google_unavailable");
  if (sp.get("error")) return fail(origin, "google_denied");

  const code = sp.get("code");
  const state = sp.get("state");
  const cookieState = req.cookies.get("g_state")?.value;

  // CSRF check: state from Google must match the cookie we set.
  if (!code || !state || !cookieState || state !== cookieState) {
    return fail(origin, "oauth_state");
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const tokens = await exchangeGoogleCode({ code, redirectUri });
    const claims = verifyGoogleIdToken(tokens.id_token);

    const verified =
      claims.email_verified === true || claims.email_verified === "true";
    if (!claims.email || !verified) return fail(origin, "google_email");

    const user = await findOrCreateGoogleUser({
      googleId: claims.sub,
      email: claims.email,
      name: claims.name || claims.email.split("@")[0],
      image: claims.picture ?? null,
    });

    const next = safeNext(req.cookies.get("g_next")?.value);
    const res = NextResponse.redirect(new URL(next, origin));
    res.cookies.set(SESSION_COOKIE, makeSessionToken(user.id), {
      ...SESSION_COOKIE_OPTIONS,
      secure: process.env.NODE_ENV === "production",
    });
    // one-time flags — clear them
    res.cookies.delete("g_state");
    res.cookies.delete("g_next");
    return res;
  } catch {
    return fail(origin, "google_failed");
  }
}
