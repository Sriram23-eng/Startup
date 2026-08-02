// Admin auth config. Both secrets are REQUIRED in production — the build
// fails (scripts/check-env.mjs) and, as a backstop, importing this module
// throws if they are unset. The dev fallbacks below are public: they exist
// only so `npm run dev` works with no .env file.
//
// This module is imported by middleware.ts, which runs on the Edge runtime —
// keep it free of `node:` imports. The constant-time credential check lives in
// the auth route, which runs on Node.
import { requireSecret } from "./env";

/**
 * Who signs in. Not a secret — it is half of a credential pair, and treating
 * it as one would mean a forgotten username locks the panel just as hard as a
 * forgotten password. Defaults so an existing deploy keeps working after this
 * change rather than locking its owner out.
 */
export const ADMIN_USER = process.env.ADMIN_USER?.trim() || "admin";

/**
 * Trimmed because these are pasted into a hosting dashboard by hand, and a
 * value that picks up a trailing newline there fails to match a correctly
 * typed password with nothing on screen to explain why. A password whose
 * meaning depends on surrounding whitespace isn't worth that failure mode.
 */
export const ADMIN_PASSWORD = requireSecret(
  "ADMIN_PASSWORD",
  process.env.ADMIN_PASSWORD?.trim(),
  "admin123"
);

export const ADMIN_TOKEN = requireSecret(
  "ADMIN_TOKEN",
  process.env.ADMIN_TOKEN,
  "ms-admin-session-ok"
);

export const ADMIN_COOKIE = "ms_admin";
