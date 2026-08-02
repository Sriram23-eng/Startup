import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { ADMIN_USER, ADMIN_PASSWORD, ADMIN_TOKEN, ADMIN_COOKIE } from "@/lib/admin";
import { checkStoredAdmin } from "@/lib/admin-account";

export const runtime = "nodejs";

/**
 * Compare two strings without leaking how much of them matched.
 *
 * A plain `!==` returns as soon as it hits a differing byte, so how long the
 * comparison took tells an attacker how many leading characters they guessed
 * right. Hashing first also makes both sides a fixed 32 bytes, so the length
 * of the real password doesn't leak either — `timingSafeEqual` throws on
 * mismatched lengths, which would otherwise be its own signal.
 */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  // The stored credential wins when there is one. It lives in the database
  // every environment shares, so it is the same password locally and on the
  // hosted site — the environment variables can only disagree with each other.
  const stored = await checkStoredAdmin(username, password);

  let granted: boolean;
  if (stored.source === "database") {
    granted = stored.ok;
  } else {
    // Nothing stored yet: fall back to the environment, which is how a deploy
    // that has never run `npm run admin:password` keeps working.
    // Both are always checked, even when the username is already wrong, so a
    // valid username can't be identified by a faster rejection.
    const userOk = safeEqual(username, ADMIN_USER);
    const passOk = safeEqual(password, ADMIN_PASSWORD);
    granted = userOk && passOk;
  }

  if (!granted) {
    // One message for both cases — saying which half was wrong would confirm a
    // valid username to someone guessing.
    return NextResponse.json(
      { ok: false, error: "Incorrect username or password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
