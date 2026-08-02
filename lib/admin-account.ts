/* ------------------------------------------------------------------ */
/*  The stored /admin credential.                                       */
/*                                                                      */
/*  Checked before the environment variables, so whoever runs           */
/*  `npm run admin:password` sets the password for every deployment     */
/*  pointed at this database — no dashboard, no redeploy.               */
/*                                                                      */
/*  When the table is empty the environment still decides, so a deploy  */
/*  that has never run the script keeps the sign-in it already had.     */
/* ------------------------------------------------------------------ */
import { prisma } from "./prisma";
import { hashPassword, verifyPassword } from "./password";

const ROW_ID = "admin";

export type AdminCheck =
  | { source: "database"; ok: boolean }
  | { source: "environment" };

/**
 * Verify a username/password pair against the stored credential.
 *
 * Returns `{ source: "environment" }` when no credential is stored, meaning
 * the caller should fall back to ADMIN_USER / ADMIN_PASSWORD. Any database
 * error also falls back rather than throwing: a database that is briefly
 * unreachable should not be able to lock an administrator out of the panel.
 */
export async function checkStoredAdmin(
  username: string,
  password: string
): Promise<AdminCheck> {
  let row;
  try {
    row = await prisma.adminAccount.findUnique({ where: { id: ROW_ID } });
  } catch {
    return { source: "environment" };
  }

  if (!row) return { source: "environment" };

  // Both halves are always evaluated so a wrong username doesn't return
  // faster than a wrong password.
  const userOk = row.username === username;
  const passOk = verifyPassword(password, row.passwordHash);
  return { source: "database", ok: userOk && passOk };
}

/** Set (or replace) the stored credential. */
export async function setStoredAdmin(username: string, password: string) {
  const data = { username: username.trim(), passwordHash: hashPassword(password) };
  return prisma.adminAccount.upsert({
    where: { id: ROW_ID },
    update: data,
    create: { id: ROW_ID, ...data },
  });
}

/** Who is stored, if anyone. Never returns the password or its hash. */
export async function getStoredAdminUsername(): Promise<string | null> {
  try {
    const row = await prisma.adminAccount.findUnique({
      where: { id: ROW_ID },
      select: { username: true },
    });
    return row?.username ?? null;
  } catch {
    return null;
  }
}
