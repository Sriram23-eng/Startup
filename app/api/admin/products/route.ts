import { NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listProducts());
}

export async function POST(req: Request) {
  const item = await createProduct(await req.json());
  return NextResponse.json({ ok: true, item });
}
