/* ------------------------------------------------------------------ */
/*  Student authentication: password hashing + a signed session cookie.*/
/*  Uses Node's built-in crypto only (no bcrypt / next-auth needed).   */
/* ------------------------------------------------------------------ */
import { scryptSync, randomBytes, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getUserById, type User } from "./accounts";

export const SESSION_COOKIE = "ms_user";

// Used to sign the session cookie. Set AUTH_SECRET in production.
const SECRET =
  process.env.AUTH_SECRET || process.env.ADMIN_TOKEN || "dev-insecure-secret-change-me";

/* ---------------- Password hashing (scrypt) ---------------- */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

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

/** Read the current logged-in user from the session cookie (server-side). */
export async function getCurrentUser(): Promise<SafeUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = readSessionToken(token);
  if (!userId) return null;
  const user = await getUserById(userId);
  if (!user) return null;
  const { passwordHash: _omit, ...safe } = user;
  void _omit;
  return safe;
}
