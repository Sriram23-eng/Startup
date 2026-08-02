/* ------------------------------------------------------------------ */
/*  Student authentication: password hashing + a signed session cookie.*/
/*  Uses Node's built-in crypto only (no bcrypt / next-auth needed).   */
/* ------------------------------------------------------------------ */
import { createHmac, timingSafeEqual } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { getUserById, type User } from "./accounts";
import { requireSecret } from "./env";

// Re-exported so existing importers of these keep working; the
// implementations moved to ./password so scripts can use them too.
export { hashPassword, verifyPassword } from "./password";

export const SESSION_COOKIE = "ms_user";

// Used to sign the session cookie. AUTH_SECRET is required in production —
// the build fails without it, and this throws rather than signing sessions
// with a secret that is public in this repo. (ADMIN_TOKEN is accepted as a
// fallback so sessions issued before AUTH_SECRET existed stay valid.)
const SECRET = requireSecret(
  "AUTH_SECRET",
  process.env.AUTH_SECRET || process.env.ADMIN_TOKEN,
  "dev-insecure-secret-change-me"
);

/* ---------------- Signed session token ---------------- */
function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function makeSessionToken(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

export function readSessionToken(token: string): string | null {
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const id = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = sign(id);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return id;
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export type SafeUser = Omit<User, "passwordHash">;

/**
 * Read the current logged-in user from the session cookie (server-side).
 *
 * Wrapped in React's `cache` so the several callers in one request — the root
 * layout's navigation, the price gate, the page itself — share a single
 * database read instead of each issuing their own.
 */
export const getCurrentUser = cache(async function getCurrentUser(): Promise<SafeUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = readSessionToken(token);
  if (!userId) return null;
  const user = await getUserById(userId);
  if (!user) return null;
  const { passwordHash: _omit, ...safe } = user;
  void _omit;
  return safe;
});
