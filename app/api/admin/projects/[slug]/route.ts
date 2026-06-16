import { NextResponse } from "next/server";
import { getProjects, saveProjects, coerceProject } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const list = await getProjects();
  const i = list.findIndex((p) => p.slug === slug);
  if (i < 0)
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  list[i] = { ...list[i], ...coerceProject(body), slug };
  await saveProjects(list);
  return NextResponse.json({ ok: true, item: list[i] });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const list = await getProjects();
  const next = list.filter((p) => p.slug !== slug);
  await saveProjects(next);
  return NextResponse.json({ ok: true });
}
