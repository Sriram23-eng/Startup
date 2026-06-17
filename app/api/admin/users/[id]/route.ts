import { NextResponse } from "next/server";
import { deleteUser } from "@/lib/accounts";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteUser(id);
  return NextResponse.json({ ok: true });
}
