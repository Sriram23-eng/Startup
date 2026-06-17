/* ------------------------------------------------------------------ */
/*  Users & enrollments store. Same dual-backend pattern as lib/store: */
/*    • DATABASE_URL set   → Postgres via Prisma (persists on Vercel)  */
/*    • DATABASE_URL unset → JSON files in /data (local dev only)      */
/*  NOTE: the JSON backend does NOT persist on Vercel's read-only FS.  */
/*  For real accounts in production you must set DATABASE_URL.         */
/* ------------------------------------------------------------------ */
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const USE_DB = !!process.env.DATABASE_URL;

const DIR = path.join(process.cwd(), "data");
const U_FILE = path.join(DIR, "users.json");
const E_FILE = path.join(DIR, "enrollments.json");

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  accountType: string; // student | college
  college?: string | null; // institution name (college accounts)
  createdAt?: string;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseSlug: string;
  courseTitle: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
};

/* ---------------- JSON helpers ---------------- */
async function readJson<T>(file: string, seed: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return seed;
  }
}

async function writeJson(file: string, data: unknown): Promise<boolean> {
  try {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function stripDate<T>(row: any): T {
  if (!row) return row;
  const { createdAt, ...rest } = row;
  return { ...rest, createdAt: createdAt?.toISOString?.() ?? createdAt } as T;
}

export const normalizeEmail = (e: string) => String(e || "").trim().toLowerCase();

/* ====================== USERS ====================== */
export async function getUserByEmail(email: string): Promise<User | null> {
  const e = normalizeEmail(email);
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.findUnique({ where: { email: e } });
    return row ? stripDate<User>(row) : null;
  }
  const list = await readJson<User[]>(U_FILE, []);
  return list.find((u) => u.email === e) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? stripDate<User>(row) : null;
  }
  const list = await readJson<User[]>(U_FILE, []);
  return list.find((u) => u.id === id) ?? null;
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  accountType?: string;
  college?: string | null;
}): Promise<User> {
  const email = normalizeEmail(data.email);
  const accountType = data.accountType === "college" ? "college" : "student";
  const college = accountType === "college" ? data.college || null : null;
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.create({
      data: { name: data.name, email, passwordHash: data.passwordHash, accountType, college },
    });
    return stripDate<User>(row);
  }
  const list = await readJson<User[]>(U_FILE, []);
  const user: User = {
    id: randomUUID(),
    name: data.name,
    email,
    passwordHash: data.passwordHash,
    role: "student",
    accountType,
    college,
    createdAt: new Date().toISOString(),
  };
  list.push(user);
  await writeJson(U_FILE, list);
  return user;
}

/** All users, newest first, WITHOUT password hashes (admin list). */
export async function listUsers(): Promise<Omit<User, "passwordHash">[]> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const rows = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((r) => {
      const { passwordHash: _pw, ...rest } = stripDate<User>(r);
      void _pw;
      return rest;
    });
  }
  const list = await readJson<User[]>(U_FILE, []);
  return list
    .slice()
    .reverse()
    .map(({ passwordHash: _pw, ...rest }) => {
      void _pw;
      return rest;
    });
}

/** Permanently delete a user and all their reservations. */
export async function deleteUser(id: string): Promise<void> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    await prisma.enrollment.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.user.delete({ where: { id } }).catch(() => {});
    return;
  }
  const users = await readJson<User[]>(U_FILE, []);
  await writeJson(U_FILE, users.filter((u) => u.id !== id));
  const ens = await readJson<Enrollment[]>(E_FILE, []);
  await writeJson(E_FILE, ens.filter((e) => e.userId !== id));
}

/* ====================== ENROLLMENTS ====================== */
export async function getEnrollment(
  userId: string,
  courseSlug: string
): Promise<Enrollment | null> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const row = await prisma.enrollment.findFirst({
      where: { userId, courseSlug },
    });
    return row ? stripDate<Enrollment>(row) : null;
  }
  const list = await readJson<Enrollment[]>(E_FILE, []);
  return list.find((e) => e.userId === userId && e.courseSlug === courseSlug) ?? null;
}

export async function createEnrollment(data: {
  userId: string;
  courseSlug: string;
  courseTitle: string;
}): Promise<Enrollment> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const row = await prisma.enrollment.create({ data });
    return stripDate<Enrollment>(row);
  }
  const list = await readJson<Enrollment[]>(E_FILE, []);
  const enrollment: Enrollment = {
    id: randomUUID(),
    ...data,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  list.push(enrollment);
  await writeJson(E_FILE, list);
  return enrollment;
}

export async function getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const rows = await prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => stripDate<Enrollment>(r));
  }
  const list = await readJson<Enrollment[]>(E_FILE, []);
  return list.filter((e) => e.userId === userId).reverse();
}

export async function listEnrollments(): Promise<(Enrollment & { user?: User })[]> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const rows = await prisma.enrollment.findMany({ orderBy: { createdAt: "desc" } });
    const stripped = rows.map((r) => stripDate<Enrollment>(r));
    const users = await Promise.all(stripped.map((e) => getUserById(e.userId)));
    return stripped.map((e, i) => ({ ...e, user: users[i] ?? undefined }));
  }
  const list = (await readJson<Enrollment[]>(E_FILE, [])).slice().reverse();
  const users = await readJson<User[]>(U_FILE, []);
  return list.map((e) => ({ ...e, user: users.find((u) => u.id === e.userId) }));
}

export async function updateEnrollmentStatus(
  id: string,
  status: Enrollment["status"]
): Promise<Enrollment | null> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    try {
      const row = await prisma.enrollment.update({ where: { id }, data: { status } });
      return stripDate<Enrollment>(row);
    } catch {
      return null;
    }
  }
  const list = await readJson<Enrollment[]>(E_FILE, []);
  const i = list.findIndex((e) => e.id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], status };
  await writeJson(E_FILE, list);
  return list[i];
}

/** Approved access check used to gate course content / AI tutor. */
export async function hasApprovedAccess(
  userId: string,
  courseSlug: string
): Promise<boolean> {
  const e = await getEnrollment(userId, courseSlug);
  return e?.status === "approved";
}
