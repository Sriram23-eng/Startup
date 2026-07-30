import { NextResponse } from "next/server";
import { listLeads, updateLeadStatus, LEAD_STATUSES, type LeadStatus } from "@/lib/leads";

// Protected by middleware (matcher covers /api/admin/:path*).
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, leads: await listLeads() });
}

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !LEAD_STATUSES.includes(status)) {
      return NextResponse.json(
        { ok: false, error: "id and a valid status are required." },
        { status: 400 }
      );
    }

    const updated = await updateLeadStatus(String(id), status as LeadStatus);
    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      lead: { id: updated.id, status: updated.status },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
