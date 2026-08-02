/* ------------------------------------------------------------------ */
/*  Password hashing — scrypt, from Node's own crypto.                 */
/*                                                                      */
/*  Split out of lib/auth.ts so it can be used away from a request:     */
/*  that module reads `next/headers`, which only exists inside Next,    */
/*  so importing it from a CLI script fails at the import.              */
/* ------------------------------------------------------------------ */
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/** Hash a password for storage. Returns "salt:hash", both hex. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** Check a password against a stored "salt:hash". Constant-time. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
