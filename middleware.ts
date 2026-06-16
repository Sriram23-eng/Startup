import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_TOKEN } from "@/lib/admin";

export function middleware(req: NextRequest) {
  const authed = req.cookies.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;
  const { pathname } = req.nextUrl;

  // Protect admin API (except the auth endpoint itself)
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth")) {
    if (!authed)
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    return NextResponse.next();
  }

  // Protect admin pages (except the login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
