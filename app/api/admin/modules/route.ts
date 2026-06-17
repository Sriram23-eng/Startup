import { NextResponse } from "next/server";
import { listModules, createModule } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listModules());
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await createModule(body);
  return NextResponse.json({ ok: true, item });
}
