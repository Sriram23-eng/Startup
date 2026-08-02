/* ------------------------------------------------------------------ */
/*  W3Schools-style course content: modules + rich topic pages.        */
/*  Stored in Postgres (Prisma). Edited via the admin panel.           */
/* ------------------------------------------------------------------ */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "./prisma";

// Text fields a topic carries (the W3Schools-style sections).
const TOPIC_FIELDS = [
  "theory",
  "diagramUrl",
  "components",
  "exampleCode",
  "codeExplanation",
  "outputImageUrl",
  "videoUrl",
  "videoScript",
  "videoPoints",
  "documentation",
  "quiz",
  "exercise",
  "simulationUrl",
  "miniProject",
  "downloads",
] as const;

/* ====================== MODULES ====================== */
export async function listModules(courseSlug?: string) {
  const rows = await prisma.courseModule.findMany({
    where: courseSlug ? { courseSlug } : undefined,
    orderBy: [{ courseSlug: "asc" }, { order: "asc" }],
    include: { _count: { select: { topics: true } } },
  });
  return rows.map((r) => ({
    slug: r.id, // alias so CrudManager can address it
    id: r.id,
    courseSlug: r.courseSlug,
    title: r.title,
    band: r.band,
    order: r.order,
    topicCount: r._count.topics,
  }));
}

export async function createModule(b: any) {
  const m = await prisma.courseModule.create({
    data: {
      courseSlug: String(b.courseSlug || ""),
      title: String(b.title || "Untitled module"),
      band: String(b.band || "Beginner"),
      order: Number(b.order) || 0,
    },
  });
  return { ...m, slug: m.id };
}

export async function updateModule(id: string, b: any) {
  const data: any = {};
  if (b.courseSlug !== undefined) data.courseSlug = String(b.courseSlug);
  if (b.title !== undefined) data.title = String(b.title);
  if (b.band !== undefined) data.band = String(b.band);
  if (b.order !== undefined) data.order = Number(b.order) || 0;
  try {
    const m = await prisma.courseModule.update({ where: { id }, data });
    return { ...m, slug: m.id };
  } catch {
    return null;
  }
}

export async function deleteModule(id: string) {
  await prisma.courseModule.delete({ where: { id } }).catch(() => {});
}

/* ====================== TOPICS ====================== */
export async function listTopics(moduleId?: string) {
  const rows = await prisma.topic.findMany({
    where: moduleId ? { moduleId } : undefined,
    orderBy: [{ order: "asc" }],
    include: { module: { select: { title: true } } },
  });
  return rows.map((r) => ({ ...r, slug: r.id, moduleTitle: r.module.title }));
}

export async function createTopic(b: any) {
  const data: any = {
    moduleId: String(b.moduleId || ""),
    title: String(b.title || "Untitled topic"),
    kind: String(b.kind || "topic"),
    order: Number(b.order) || 0,
  };
  for (const f of TOPIC_FIELDS) if (b[f] !== undefined) data[f] = String(b[f] || "");
  const t = await prisma.topic.create({ data });
  return { ...t, slug: t.id };
}

export async function updateTopic(id: string, b: any) {
  const data: any = {};
  if (b.moduleId !== undefined) data.moduleId = String(b.moduleId);
  if (b.title !== undefined) data.title = String(b.title);
  if (b.kind !== undefined) data.kind = String(b.kind);
  if (b.order !== undefined) data.order = Number(b.order) || 0;
  for (const f of TOPIC_FIELDS) if (b[f] !== undefined) data[f] = String(b[f] || "");
  try {
    const t = await prisma.topic.update({ where: { id }, data });
    return { ...t, slug: t.id };
  } catch {
    return null;
  }
}

export async function deleteTopic(id: string) {
  await prisma.topic.delete({ where: { id } }).catch(() => {});
}

/* ====================== STUDENT VIEWER ====================== */
/** Modules + their topic stubs (id/title/kind), ordered — for the sidebar. */
export async function getCourseOutline(courseSlug: string) {
  return prisma.courseModule.findMany({
    where: { courseSlug },
    orderBy: { order: "asc" },
    include: {
      topics: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, kind: true },
      },
    },
  });
}

/** Full topic content — only if it belongs to the given course. */
export async function getTopicForCourse(courseSlug: string, topicId: string) {
  const t = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { module: { select: { courseSlug: true, title: true } } },
  });
  if (!t || t.module.courseSlug !== courseSlug) return null;
  return t;
}

/** First topic id of a course (the default landing topic). */
export async function getFirstTopicId(courseSlug: string): Promise<string | null> {
  const m = await prisma.courseModule.findFirst({
    where: { courseSlug },
    orderBy: { order: "asc" },
    include: { topics: { orderBy: { order: "asc" }, take: 1, select: { id: true } } },
  });
  return m?.topics[0]?.id ?? null;
}
