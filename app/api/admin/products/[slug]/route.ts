import { NextResponse } from "next/server";
import { updateProduct, deleteProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = await updateProduct(slug, await req.json());
  if (!item)
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deleteProduct(slug);
  return NextResponse.json({ ok: true });
}
