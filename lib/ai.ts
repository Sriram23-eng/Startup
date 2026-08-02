/* ------------------------------------------------------------------ */
/*  The one place the Anthropic API key is read.                       */
/*                                                                      */
/*  Two features use it: the lesson generator (admin-side, writes       */
/*  course content into the database) and the course tutor (student-    */
/*  side, answers questions about the topic they're reading). Both go   */
/*  through the helpers here so the model, the refusal handling and     */
/*  the fallback policy are decided once.                                */
/* ------------------------------------------------------------------ */
import Anthropic from "@anthropic-ai/sdk";

/** Claude Opus 5 — thinking is on by default, so no `thinking` field is set. */
export const AI_MODEL = "claude-opus-5";

/**
 * Safety classifiers can decline a request outright. Rather than surfacing
 * that as a failure, the API re-runs the same request on Opus 4.8 server-side
 * and returns its answer. Costs nothing when it never fires.
 */
const FALLBACK_BETA = "server-side-fallback-2026-06-01";
const FALLBACKS = [{ model: "claude-opus-4-8" }];

let client: Anthropic | null = null;

/** True when ANTHROPIC_API_KEY is set — used to hide AI actions in the UI. */
export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export class AiNotConfiguredError extends Error {
  constructor() {
    super(
      "ANTHROPIC_API_KEY is not set. Add it to .env (local) or Vercel → " +
        "Settings → Environment Variables (production), then restart."
    );
    this.name = "AiNotConfiguredError";
  }
}

function getClient(): Anthropic {
  if (!isAiConfigured()) throw new AiNotConfiguredError();
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

/**
 * Ask Claude for a value matching `schema` and return it parsed.
 *
 * The schema is enforced by the API (structured outputs), so the response is
 * always valid JSON in the right shape — there is no defensive parsing or
 * "did it wrap the JSON in a code fence" cleanup to do here.
 *
 * Streams because lesson generation asks for a lot of output at once, and a
 * non-streaming request that large risks an HTTP timeout before it finishes.
 */
export async function generateJson<T>({
  system,
  prompt,
  schema,
  maxTokens = 32000,
}: {
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const stream = getClient().beta.messages.stream({
    model: AI_MODEL,
    max_tokens: maxTokens,
    betas: [FALLBACK_BETA],
    fallbacks: FALLBACKS,
    system,
    messages: [{ role: "user", content: prompt }],
    output_config: { format: { type: "json_schema", schema } },
  });

  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new Error(
      "Claude declined this request" +
        (message.stop_details?.explanation ? `: ${message.stop_details.explanation}` : ".")
    );
  }
  if (message.stop_reason === "max_tokens") {
    throw new Error(
      "The response was cut off before it finished. Try generating fewer sections at once."
    );
  }

  const text = message.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  if (!text.trim()) throw new Error("Claude returned an empty response.");
  return JSON.parse(text) as T;
}

/**
 * Stream a plain-text answer back as it is written — used by the tutor, where
 * the student should see words appear rather than wait for a whole reply.
 * Yields text deltas.
 */
export async function* streamText({
  system,
  messages,
  maxTokens = 2000,
}: {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens?: number;
}): AsyncGenerator<string> {
  const stream = getClient().beta.messages.stream({
    model: AI_MODEL,
    max_tokens: maxTokens,
    betas: [FALLBACK_BETA],
    fallbacks: FALLBACKS,
    // A tutor answering a beginner's question should reply quickly rather than
    // deliberate — the depth of a full lesson is already on the page.
    output_config: { effort: "low" },
    system,
    messages,
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }

  const final = await stream.finalMessage();
  if (final.stop_reason === "refusal") {
    yield "\n\n(I can't help with that one — try asking about the topic on this page.)";
  }
}
