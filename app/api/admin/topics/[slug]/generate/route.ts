import { NextResponse } from "next/server";
import { generateAndSaveTopic } from "@/lib/course-gen";
import { isAiConfigured } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Writing a whole lesson takes a while; the platform default would cut it off.
export const maxDuration = 300;

/**
 * POST /api/admin/topics/:id/generate — write this topic's lesson with AI.
 *
 * Behind the admin cookie via middleware, same as the rest of /api/admin.
 * `slug` is the topic id (listTopics aliases id → slug for CrudManager).
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ANTHROPIC_API_KEY isn't set. Add it in Vercel → Settings → " +
          "Environment Variables (or .env locally) and redeploy.",
      },
      { status: 503 }
    );
  }

  const { slug } = await params;

  try {
    const topic = await generateAndSaveTopic(slug);
    return NextResponse.json({ ok: true, topic });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Generation failed." },
      { status: 500 }
    );
  }
}
