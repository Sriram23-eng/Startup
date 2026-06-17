import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/accounts";
import {
  verifyPassword,
  makeSessionToken,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user || !verifyPassword(String(password), user.passwordHash)) {
      return NextResponse.json(
        { ok: false, error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
    res.cookies.set(SESSION_COOKIE, makeSessionToken(user.id), SESSION_COOKIE_OPTIONS);
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
