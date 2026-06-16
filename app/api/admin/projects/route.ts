import { NextResponse } from "next/server";
import {
  getProjects,
  saveProjects,
  slugify,
  uniqueSlug,
  coerceProject,
  projectDefaults,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getProjects());
}

export async function POST(req: Request) {
  const body = await req.json();
  const list = await getProjects();
  const slug = uniqueSlug(
    slugify(body.title || "project"),
    list.map((p) => p.slug)
  );
  const item = { ...projectDefaults(), ...coerceProject(body), slug };
  list.unshift(item);
  await saveProjects(list);
  return NextResponse.json({ ok: true, item });
}
