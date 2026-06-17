import { NextResponse } from "next/server";
import { createUser, getUserByEmail, normalizeEmail } from "@/lib/accounts";
import {
  hashPassword,
  makeSessionToken,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, error: "Name, email and password are required." },
        { status: 400 }
      );
    }
    if (String(password).length < 6) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await createUser({
      name: String(name).trim(),
      email: normalizeEmail(email),
      passwordHash: hashPassword(String(password)),
    });

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
