/* ------------------------------------------------------------------ */
/*  Lead (enquiry) store. Same dual-backend pattern as lib/accounts.ts:*/
/*    • DATABASE_URL set   → Postgres via Prisma (persists on Vercel)  */
/*    • DATABASE_URL unset → JSON file in /data (local dev only)       */
/*  NOTE: the JSON backend does NOT persist on Vercel's read-only FS.  */
/* ------------------------------------------------------------------ */
import { promises as fs } from "fs";
import path from "path";
import { randomUUID, randomInt } from "crypto";

const USE_DB = !!process.env.DATABASE_URL;

const DIR = path.join(process.cwd(), "data");
const L_FILE = path.join(DIR, "leads.json");

export type LeadStatus = "new" | "contacted" | "closed";

export type Lead = {
  id: string;
  ref: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  org: string;
  subject: string;
  message: string;
  details: string; // JSON string of the full submitted payload
  status: LeadStatus;
  createdAt?: string;
};

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

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

/**
 * A short customer-facing reference. Crypto-random over 36^6 (~2.2 billion),
 * so collisions are not a practical concern at this volume. Ambiguous
 * characters are excluded so the code survives being read out over the phone.
 */
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
export function makeLeadRef(): string {
  let out = "";
  for (let i = 0; i < 6; i++) out += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `LEAD-${out}`;
}

/* ====================== WRITE ====================== */
export async function createLead(data: {
  type: string;
  name: string;
  email: string;
  phone: string;
  org: string;
  subject: string;
  message: string;
  details: string;
}): Promise<Lead> {
  const ref = makeLeadRef();

  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const row = await prisma.lead.create({ data: { ...data, ref } });
    return stripDate<Lead>(row);
  }

  const list = await readJson<Lead[]>(L_FILE, []);
  const lead: Lead = {
    id: randomUUID(),
    ref,
    ...data,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  list.push(lead);
  await writeJson(L_FILE, list);
  return lead;
}

/* ====================== READ ====================== */
/** All leads, newest first (admin list). */
export async function listLeads(): Promise<Lead[]> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const rows = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((r) => stripDate<Lead>(r));
  }
  return (await readJson<Lead[]>(L_FILE, [])).slice().reverse();
}

/** Count of leads still marked "new" — shown on the admin dashboard. */
export async function countNewLeads(): Promise<number> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    return prisma.lead.count({ where: { status: "new" } });
  }
  return (await readJson<Lead[]>(L_FILE, [])).filter((l) => l.status === "new").length;
}

/* ====================== UPDATE / DELETE ====================== */
export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead | null> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    try {
      const row = await prisma.lead.update({ where: { id }, data: { status } });
      return stripDate<Lead>(row);
    } catch {
      return null;
    }
  }
  const list = await readJson<Lead[]>(L_FILE, []);
  const i = list.findIndex((l) => l.id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], status };
  await writeJson(L_FILE, list);
  return list[i];
}

/** Returns false when there was no such lead to delete. */
export async function deleteLead(id: string): Promise<boolean> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    try {
      await prisma.lead.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
  const list = await readJson<Lead[]>(L_FILE, []);
  if (!list.some((l) => l.id === id)) return false;
  await writeJson(
    L_FILE,
    list.filter((l) => l.id !== id)
  );
  return true;
}

/** Parse a lead's stored payload back into label/value pairs (safe). */
export function parseLeadDetails(details?: string): { label: string; value: string }[] {
  try {
    const obj = JSON.parse(details || "{}");
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];
    return Object.entries(obj)
      .filter(([, v]) => v !== "" && v != null)
      .map(([label, v]) => ({ label, value: String(v) }));
  } catch {
    return [];
  }
}
