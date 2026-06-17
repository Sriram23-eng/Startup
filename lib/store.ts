/* ------------------------------------------------------------------ */
/*  Data store with two backends, chosen at runtime:                   */
/*    • DATABASE_URL set   → Postgres via Prisma (persists on Vercel)  */
/*    • DATABASE_URL unset → JSON files in /data (local, zero-setup)   */
/*  The public API is identical either way, so the rest of the app     */
/*  never needs to know which backend is active.                       */
/* ------------------------------------------------------------------ */
import { promises as fs } from "fs";
import path from "path";
import {
  projects as seedProjects,
  courses as seedCourses,
  Project,
  Course,
} from "./data";

const USE_DB = !!process.env.DATABASE_URL;

/* ---------------- JSON backend helpers ---------------- */
const DIR = path.join(process.cwd(), "data");
const P_FILE = path.join(DIR, "projects.json");
const C_FILE = path.join(DIR, "courses.json");

async function readJson<T>(file: string, seed: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
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
    return false;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function strip<T>(row: any): T {
  if (!row) return row;
  const { createdAt, ...rest } = row;
  return rest as T;
}

/* ====================== PROJECTS ====================== */
export async function getProjects(): Promise<Project[]> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const rows = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((r) => strip<Project>(r));
  }
  return readJson<Project[]>(P_FILE, seedProjects);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const row = await prisma.project.findUnique({ where: { slug } });
    return row ? strip<Project>(row) : undefined;
  }
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function createProject(body: any): Promise<Project> {
  const existing = (await getProjects()).map((p) => p.slug);
  const slug = uniqueSlug(slugify(body.title || "project"), existing);
  const item: Project = { ...projectDefaults(), ...coerceProject(body), slug };
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    await prisma.project.create({ data: item });
  } else {
    const list = await getProjects();
    list.unshift(item);
    await writeJson(P_FILE, list);
  }
  return item;
}

export async function updateProject(
  slug: string,
  body: any
): Promise<Project | null> {
  const patch = coerceProject(body);
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    try {
      const row = await prisma.project.update({ where: { slug }, data: patch });
      return strip<Project>(row);
    } catch {
      return null;
    }
  }
  const list = await getProjects();
  const i = list.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch, slug };
  await writeJson(P_FILE, list);
  return list[i];
}

export async function deleteProject(slug: string): Promise<void> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    await prisma.project.delete({ where: { slug } }).catch(() => {});
    return;
  }
  const list = await getProjects();
  await writeJson(P_FILE, list.filter((p) => p.slug !== slug));
}

/* ====================== COURSES ====================== */
export async function getCourses(): Promise<Course[]> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const rows = await prisma.course.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((r) => strip<Course>(r));
  }
  return readJson<Course[]>(C_FILE, seedCourses);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    const row = await prisma.course.findUnique({ where: { slug } });
    return row ? strip<Course>(row) : undefined;
  }
  return (await getCourses()).find((c) => c.slug === slug);
}

export async function createCourse(body: any): Promise<Course> {
  const existing = (await getCourses()).map((c) => c.slug);
  const slug = uniqueSlug(slugify(body.title || "course"), existing);
  const item: Course = { ...courseDefaults(), ...coerceCourse(body), slug };
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    await prisma.course.create({ data: item });
  } else {
    const list = await getCourses();
    list.unshift(item);
    await writeJson(C_FILE, list);
  }
  return item;
}

export async function updateCourse(
  slug: string,
  body: any
): Promise<Course | null> {
  const patch = coerceCourse(body);
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    try {
      const row = await prisma.course.update({ where: { slug }, data: patch });
      return strip<Course>(row);
    } catch {
      return null;
    }
  }
  const list = await getCourses();
  const i = list.findIndex((c) => c.slug === slug);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch, slug };
  await writeJson(C_FILE, list);
  return list[i];
}

export async function deleteCourse(slug: string): Promise<void> {
  if (USE_DB) {
    const { prisma } = await import("./prisma");
    await prisma.course.delete({ where: { slug } }).catch(() => {});
    return;
  }
  const list = await getCourses();
  await writeJson(C_FILE, list.filter((c) => c.slug !== slug));
}

/* ====================== Helpers ====================== */
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

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70";

export function coerceProject(b: any): Partial<Project> {
  const o: any = {};
  if (b.title !== undefined) o.title = String(b.title);
  if (b.category !== undefined) o.category = String(b.category);
  if (b.size !== undefined) o.size = b.size;
  if (b.price !== undefined) o.price = Number(b.price) || 0;
  if (b.rating !== undefined) o.rating = Number(b.rating) || 0;
  if (b.reviews !== undefined) o.reviews = Number(b.reviews) || 0;
  if (b.image !== undefined) o.image = String(b.image) || FALLBACK_IMG;
  if (b.youtube !== undefined) o.youtube = b.youtube ? String(b.youtube) : null;
  if (b.summary !== undefined) o.summary = String(b.summary);
  if (b.features !== undefined) o.features = toArray(b.features);
  if (b.components !== undefined) o.components = toArray(b.components);
  if (b.readyMade !== undefined) o.readyMade = Boolean(b.readyMade);
  if (b.tags !== undefined) o.tags = toArray(b.tags);
  // Rich product fields
  if (b.badge !== undefined) o.badge = String(b.badge || "");
  if (b.originalPrice !== undefined)
    o.originalPrice =
      b.originalPrice === "" || b.originalPrice == null ? null : Number(b.originalPrice);
  if (b.currency !== undefined) o.currency = String(b.currency || "INR");
  if (b.priceOptions !== undefined) o.priceOptions = String(b.priceOptions || "");
  if (b.priceMultiSelect !== undefined) o.priceMultiSelect = Boolean(b.priceMultiSelect);
  if (b.status !== undefined) o.status = String(b.status || "PUBLISHED");
  if (b.featured !== undefined) o.featured = Boolean(b.featured);
  if (b.order !== undefined) o.order = Number(b.order) || 0;
  if (b.about !== undefined) o.about = String(b.about || "");
  if (b.included !== undefined) o.included = toArray(b.included);
  if (b.specs !== undefined) o.specs = String(b.specs || "[]");
  if (b.requirements !== undefined) o.requirements = toArray(b.requirements);
  if (b.gallery !== undefined) o.gallery = toArray(b.gallery);
  if (b.license !== undefined) o.license = String(b.license || "");
  if (b.version !== undefined) o.version = String(b.version || "");
  if (b.sku !== undefined) o.sku = String(b.sku || "");
  if (b.checkoutUrl !== undefined) o.checkoutUrl = String(b.checkoutUrl || "");
  if (b.demoUrl !== undefined) o.demoUrl = String(b.demoUrl || "");
  if (b.metaTitle !== undefined) o.metaTitle = String(b.metaTitle || "");
  if (b.metaDescription !== undefined) o.metaDescription = String(b.metaDescription || "");
  if (b.ogImage !== undefined) o.ogImage = String(b.ogImage || "");
  if (b.publishDate !== undefined) o.publishDate = b.publishDate ? String(b.publishDate) : null;
  return o;
}

/** Parse price options from lines "Label | price" → [{label, price}]. */
export function parsePriceOptions(s?: string): { label: string; price: number }[] {
  if (!s) return [];
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, price] = line.split("|");
      return {
        label: (label || "").trim(),
        price: Number((price || "").replace(/[^0-9.]/g, "")) || 0,
      };
    })
    .filter((o) => o.label);
}

/** Parse a project's specs JSON string into [{label,value}] (safe). */
export function parseSpecs(specs?: string): { label: string; value: string }[] {
  try {
    const arr = JSON.parse(specs || "[]");
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x: any) => x && typeof x.label === "string")
      .map((x: any) => ({ label: String(x.label), value: String(x.value ?? "") }));
  } catch {
    return [];
  }
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
  if (b.oldPrice !== undefined) o.oldPrice = b.oldPrice ? Number(b.oldPrice) : null;
  if (b.image !== undefined) o.image = String(b.image) || FALLBACK_IMG;
  if (b.blurb !== undefined) o.blurb = String(b.blurb);
  if (b.highlights !== undefined) o.highlights = toArray(b.highlights);
  if (b.startDate !== undefined) o.startDate = b.startDate ? String(b.startDate) : null;
  if (b.schedule !== undefined) o.schedule = b.schedule ? String(b.schedule) : null;
  if (b.seatsLeft !== undefined)
    o.seatsLeft =
      b.seatsLeft === "" || b.seatsLeft == null ? null : Number(b.seatsLeft);
  if (b.topics !== undefined) o.topics = toArray(b.topics);
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
    topics: [],
  };
}
