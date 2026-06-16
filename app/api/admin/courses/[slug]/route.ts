import { NextResponse } from "next/server";
import { getCourses, saveCourses, coerceCourse } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const list = await getCourses();
  const i = list.findIndex((c) => c.slug === slug);
  if (i < 0)
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  list[i] = { ...list[i], ...coerceCourse(body), slug };
  await saveCourses(list);
  return NextResponse.json({ ok: true, item: list[i] });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const list = await getCourses();
  const next = list.filter((c) => c.slug !== slug);
  await saveCourses(next);
  return NextResponse.json({ ok: true });
}
