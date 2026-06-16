import { NextResponse } from "next/server";

/**
 * Lead intake endpoint.
 * In production: validate, persist to DB (Postgres/Prisma), push to CRM,
 * and trigger email/WhatsApp notification. For now it logs & echoes back.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.email && !body?.phone) {
      return NextResponse.json(
        { ok: false, error: "Email or phone is required." },
        { status: 400 }
      );
    }

    const lead = {
      id: `LEAD-${Math.floor(100000 + Math.abs(hash(JSON.stringify(body))) % 900000)}`,
      type: body.type ?? "general",
      ...body,
    };

    // TODO: persist + notify. Logged server-side for now.
    console.log("[lead]", lead);

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}
