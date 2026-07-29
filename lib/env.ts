/* ------------------------------------------------------------------ */
/*  Required-secret access.                                            */
/*                                                                     */
/*  In production a missing secret is a hard error, so a misconfigured  */
/*  deploy fails loudly instead of silently falling back to a value     */
/*  that is public in this repo. In development the zero-setup          */
/*  defaults still apply, so `npm run dev` works with no .env file.     */
/*                                                                     */
/*  `scripts/check-env.mjs` runs the same rules at build time — that is */
/*  what actually stops a bad deploy from shipping. This module is the  */
/*  runtime backstop.                                                   */
/* ------------------------------------------------------------------ */

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Return `value`, or throw in production when it is missing.
 *
 * Pass `process.env.X` in directly rather than looking it up by name — the
 * Edge runtime (middleware) inlines only static `process.env.X` reads, so
 * dynamic `process.env[name]` lookups would come back undefined there.
 */
export function requireSecret(
  name: string,
  value: string | undefined,
  devFallback: string
): string {
  if (value) return value;

  if (IS_PROD) {
    throw new Error(
      `[env] Missing required environment variable ${name}. ` +
        `Set it in Vercel → Project → Settings → Environment Variables ` +
        `(values take no quotes), then redeploy.`
    );
  }

  return devFallback;
}
