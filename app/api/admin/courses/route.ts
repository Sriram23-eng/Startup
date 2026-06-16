import { NextResponse } from "next/server";
import { getCourses, createCourse } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCourses());
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await createCourse(body);
  return NextResponse.json({ ok: true, item });
}
