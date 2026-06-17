import { NextResponse } from "next/server";
import { listEnrollments, updateEnrollmentStatus } from "@/lib/accounts";

// Protected by middleware (matcher covers /api/admin/:path*).
export const dynamic = "force-dynamic";

export async function GET() {
  const enrollments = await listEnrollments();
  // Never leak password hashes.
  const safe = enrollments.map((e) => ({
    id: e.id,
    courseSlug: e.courseSlug,
    courseTitle: e.courseTitle,
    status: e.status,
    createdAt: e.createdAt,
    user: e.user ? { id: e.user.id, name: e.user.name, email: e.user.email } : null,
  }));
  return NextResponse.json({ ok: true, enrollments: safe });
}

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { ok: false, error: "id and a valid status are required." },
        { status: 400 }
      );
    }
    const updated = await updateEnrollmentStatus(String(id), status);
    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "Enrollment not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, enrollment: { id: updated.id, status: updated.status } });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
