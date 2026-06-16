/* ------------------------------------------------------------------ */
/*  Writable JSON data store (server-only).                            */
/*  Seeds from lib/data.ts on first run, then persists edits to disk.  */
/*  NOTE: works on any server with a writable FS (local, Railway,      */
/*  a VPS, Docker). On Vercel's read-only serverless FS use Postgres   */
/*  instead — swap the read/write fns below for Prisma queries.        */
/* ------------------------------------------------------------------ */
import { promises as fs } from "fs";
import path from "path";
import {
  projects as seedProjects,
  courses as seedCourses,
  Project,
  Course,
} from "./data";

const DIR = path.join(process.cwd(), "data");
const P_FILE = path.join(DIR, "projects.json");
const C_FILE = path.join(DIR, "courses.json");

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70";

async function readJson<T>(file: string, seed: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    // Seed file missing (first run). Try to create it — but if the filesystem
    // is read-only (e.g. Vercel serverless), just fall back to the in-memory
    // seed so public reads still work instead of throwing a 500.
    try {
      await fs.mkdir(DIR, { recursive: true });
      await fs.writeFile(file, JSON.stringify(seed, null, 2), "utf8");
    } catch {
      /* read-only FS — serve seed from memory */
    }
    return seed;
  }
}

async function writeJson(file: string, data: unknown): Promise<boolean> {
  try {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch {
    // Read-only FS (e.g. Vercel) — admin edits can't persist here.
    // Use a writable host (Railway/VPS) or swap to Postgres for production.
    return false;
  }
}

/* ---------------- Projects ---------------- */
export async function getProjects(): Promise<Project[]> {
  return readJson<Project[]>(P_FILE, seedProjects);
}
export async function saveProjects(list: Project[]) {
  await writeJson(P_FILE, list);
}
export async function getProjectBySlug(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

/* ---------------- Courses ---------------- */
export async function getCourses(): Promise<Course[]> {
  return readJson<Course[]>(C_FILE, seedCourses);
}
export async function saveCourses(list: Course[]) {
  await writeJson(C_FILE, list);
}
export async function getCourseBySlug(slug: string) {
  return (await getCourses()).find((c) => c.slug === slug);
}

/* ---------------- Helpers ---------------- */
export function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
}

export function uniqueSlug(base: string, existing: string[]) {
  let slug = base;
  let n = 2;
  while (existing.includes(slug)) slug = `${base}-${n++}`;
  return slug;
}

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string")
    return v.split("\n").map((s) => s.trim()).filter(Boolean);
  return [];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function coerceProject(b: any): Partial<Project> {
  const o: any = {};
  if (b.title !== undefined) o.title = String(b.title);
  if (b.category !== undefined) o.category = String(b.category);
  if (b.size !== undefined) o.size = b.size;
  if (b.price !== undefined) o.price = Number(b.price) || 0;
  if (b.rating !== undefined) o.rating = Number(b.rating) || 0;
  if (b.reviews !== undefined) o.reviews = Number(b.reviews) || 0;
  if (b.image !== undefined) o.image = String(b.image) || FALLBACK_IMG;
  if (b.youtube !== undefined) o.youtube = b.youtube ? String(b.youtube) : undefined;
  if (b.summary !== undefined) o.summary = String(b.summary);
  if (b.features !== undefined) o.features = toArray(b.features);
  if (b.components !== undefined) o.components = toArray(b.components);
  if (b.readyMade !== undefined) o.readyMade = Boolean(b.readyMade);
  if (b.tags !== undefined) o.tags = toArray(b.tags);
  return o;
}

export function projectDefaults(): Project {
  return {
    slug: "",
    title: "Untitled project",
    category: "iot",
    size: "Medium",
    price: 0,
    rating: 4.8,
    reviews: 0,
    image: FALLBACK_IMG,
    summary: "",
    features: [],
    components: [],
    readyMade: true,
    tags: [],
  };
}

export function coerceCourse(b: any): Partial<Course> {
  const o: any = {};
  if (b.title !== undefined) o.title = String(b.title);
  if (b.mode !== undefined) o.mode = b.mode;
  if (b.level !== undefined) o.level = b.level;
  if (b.category !== undefined) o.category = String(b.category);
  if (b.instructor !== undefined) o.instructor = String(b.instructor);
  if (b.rating !== undefined) o.rating = Number(b.rating) || 0;
  if (b.learners !== undefined) o.learners = Number(b.learners) || 0;
  if (b.lessons !== undefined) o.lessons = Number(b.lessons) || 0;
  if (b.hours !== undefined) o.hours = Number(b.hours) || 0;
  if (b.price !== undefined) o.price = Number(b.price) || 0;
  if (b.oldPrice !== undefined)
    o.oldPrice = b.oldPrice ? Number(b.oldPrice) : undefined;
  if (b.image !== undefined) o.image = String(b.image) || FALLBACK_IMG;
  if (b.blurb !== undefined) o.blurb = String(b.blurb);
  if (b.highlights !== undefined) o.highlights = toArray(b.highlights);
  if (b.startDate !== undefined)
    o.startDate = b.startDate ? String(b.startDate) : undefined;
  if (b.schedule !== undefined)
    o.schedule = b.schedule ? String(b.schedule) : undefined;
  if (b.seatsLeft !== undefined)
    o.seatsLeft = b.seatsLeft === "" || b.seatsLeft == null ? undefined : Number(b.seatsLeft);
  return o;
}

export function courseDefaults(): Course {
  return {
    slug: "",
    title: "Untitled course",
    mode: "Self-paced",
    level: "Beginner",
    category: "iot",
    instructor: "",
    rating: 4.8,
    learners: 0,
    lessons: 0,
    hours: 0,
    price: 0,
    image: FALLBACK_IMG,
    blurb: "",
    highlights: [],
  };
}
