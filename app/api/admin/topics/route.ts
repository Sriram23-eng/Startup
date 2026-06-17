import { NextResponse } from "next/server";
import { listTopics, createTopic } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listTopics());
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await createTopic(body);
  return NextResponse.json({ ok: true, item });
}
