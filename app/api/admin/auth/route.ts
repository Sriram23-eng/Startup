import { NextResponse } from "next/server";
import { ADMIN_PASSWORD, ADMIN_TOKEN, ADMIN_COOKIE } from "@/lib/admin";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Incorrect password" },
      { status: 401 }
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
