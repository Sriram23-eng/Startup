import { NextResponse } from "next/server";
import {
  getCourses,
  saveCourses,
  slugify,
  uniqueSlug,
  coerceCourse,
  courseDefaults,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCourses());
}

export async function POST(req: Request) {
  const body = await req.json();
  const list = await getCourses();
  const slug = uniqueSlug(
    slugify(body.title || "course"),
    list.map((c) => c.slug)
  );
  const item = { ...courseDefaults(), ...coerceCourse(body), slug };
  list.unshift(item);
  await saveCourses(list);
  return NextResponse.json({ ok: true, item });
}
