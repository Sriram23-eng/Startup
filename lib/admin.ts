// Admin auth config. Both secrets are REQUIRED in production — the build
// fails (scripts/check-env.mjs) and, as a backstop, importing this module
// throws if they are unset. The dev fallbacks below are public: they exist
// only so `npm run dev` works with no .env file.
import { requireSecret } from "./env";

export const ADMIN_PASSWORD = requireSecret(
  "ADMIN_PASSWORD",
  process.env.ADMIN_PASSWORD,
  "admin123"
);

export const ADMIN_TOKEN = requireSecret(
  "ADMIN_TOKEN",
  process.env.ADMIN_TOKEN,
  "ms-admin-session-ok"
);

export const ADMIN_COOKIE = "ms_admin";
