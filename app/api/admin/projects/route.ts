import { NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getProjects());
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await createProject(body);
  return NextResponse.json({ ok: true, item });
}
