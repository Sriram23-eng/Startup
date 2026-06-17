import { NextResponse } from "next/server";
import { updateModule, deleteModule } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = await updateModule(slug, await req.json());
  if (!item)
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deleteModule(slug);
  return NextResponse.json({ ok: true });
}
