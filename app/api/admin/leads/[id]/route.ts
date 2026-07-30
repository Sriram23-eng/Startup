import { NextResponse } from "next/server";
import { deleteLead } from "@/lib/leads";

// Protected by middleware (matcher covers /api/admin/:path*).
export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!(await deleteLead(id))) {
    return NextResponse.json(
      { ok: false, error: "Lead not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
