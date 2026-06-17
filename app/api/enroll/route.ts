import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createEnrollment, getEnrollment } from "@/lib/accounts";
import { getCourseBySlug } from "@/lib/store";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "login_required" },
      { status: 401 }
    );
  }

  try {
    const { courseSlug } = await req.json();
    if (!courseSlug) {
      return NextResponse.json(
        { ok: false, error: "Course is required." },
        { status: 400 }
      );
    }

    const course = await getCourseBySlug(String(courseSlug));
    if (!course) {
      return NextResponse.json(
        { ok: false, error: "Course not found." },
        { status: 404 }
      );
    }

    // Don't create duplicate reservations for the same course.
    const existing = await getEnrollment(user.id, course.slug);
    if (existing) {
      return NextResponse.json({ ok: true, status: existing.status, duplicate: true });
    }

    const enrollment = await createEnrollment({
      userId: user.id,
      courseSlug: course.slug,
      courseTitle: course.title,
    });

    return NextResponse.json({ ok: true, status: enrollment.status });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
