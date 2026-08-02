/* ------------------------------------------------------------------ */
/*  Build-time environment gate.                                       */
/*                                                                     */
/*  Runs first in `npm run build`. If a required secret is missing —   */
/*  or is still one of the public defaults from this repo — the build   */
/*  fails here, instead of deploying an admin panel that anyone who has */
/*  read the source can sign into.                                      */
/*                                                                     */
/*  Plain Node does not read .env files the way Next.js does, so we     */
/*  load them ourselves (.env then .env.local; real env wins over both).*/
/* ------------------------------------------------------------------ */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function loadEnvFile(file) {
  const path = join(ROOT, file);
  if (!existsSync(path)) return;

  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq < 0) continue;

    const key = line.slice(0, eq).trim();
    const value = line
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, ""); // strip surrounding quotes

    // A value already in the real environment (Vercel) always wins.
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

// The public defaults that lib/env.ts hands out in development. Shipping any
// of these to production is the exact failure this script exists to catch.
const PUBLIC_DEFAULTS = new Set([
  "admin123",
  "ms-admin-session-ok",
  "dev-insecure-secret-change-me",
  "choose-a-strong-password",
  "any-long-random-string",
  "another-long-random-string",
]);

const REQUIRED = [
  {
    name: "ADMIN_PASSWORD",
    what: "the password for the /admin panel",
    // Unlike the token and the HMAC key, this one is typed by a human, so a
    // long random string isn't realistic — but 12 characters is.
    warnShorterThan: 12,
  },
  {
    name: "ADMIN_TOKEN",
    what: "the admin session cookie value checked by middleware.ts",
    warnShorterThan: 24,
  },
  {
    name: "AUTH_SECRET",
    what: "the HMAC key that signs student login sessions",
    warnShorterThan: 32,
  },
];

const errors = [];
const warnings = [];

for (const { name, what, warnShorterThan } of REQUIRED) {
  const value = process.env[name];

  if (!value) {
    errors.push(`${name} is not set — ${what}.`);
    continue;
  }
  if (PUBLIC_DEFAULTS.has(value)) {
    errors.push(
      `${name} is still a placeholder value from this repo — ${what}. Choose a real secret.`
    );
    continue;
  }
  if (warnShorterThan && value.length < warnShorterThan) {
    warnings.push(
      `${name} is only ${value.length} characters; ${warnShorterThan}+ random characters is recommended.`
    );
  }
}

// Not fatal: the app deliberately falls back to the JSON store in /data. But
// on Vercel that filesystem is read-only, so writes are silently lost.
if (!process.env.DATABASE_URL) {
  warnings.push(
    "DATABASE_URL is not set — the app will use the JSON store in /data, which does NOT persist on Vercel."
  );
}

for (const w of warnings) console.warn(`⚠  [check-env] ${w}`);

if (errors.length > 0) {
  console.error("\n✖  Build stopped: required secrets are missing.\n");
  for (const e of errors) console.error(`   • ${e}`);
  console.error(
    "\nSet them in Vercel → Project → Settings → Environment Variables " +
      "(values take NO quotes), or in a local .env file. See .env.example.\n"
  );
  process.exit(1);
}

console.log("✓  [check-env] required secrets present");
