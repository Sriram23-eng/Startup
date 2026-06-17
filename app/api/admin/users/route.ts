import { NextResponse } from "next/server";
import { listUsers } from "@/lib/accounts";

// Protected by middleware (matcher covers /api/admin/:path*).
export const dynamic = "force-dynamic";

export async function GET() {
  const users = await listUsers();
  // Password hashes are already excluded by listUsers — never expose them.
  return NextResponse.json({ ok: true, users });
}
