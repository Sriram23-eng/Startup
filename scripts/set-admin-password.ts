/* ------------------------------------------------------------------ */
/*  Set the /admin sign-in.                                             */
/*                                                                      */
/*    npm run admin:password -- <username> <password>                   */
/*                                                                      */
/*  Writes to the database, so it takes effect on every deployment       */
/*  pointed at that database — including the hosted site — the moment    */
/*  it finishes. No dashboard, no redeploy.                              */
/* ------------------------------------------------------------------ */
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

// tsx doesn't read .env on its own, and DATABASE_URL lives there.
try {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
} catch {
  // No .env — rely on the ambient environment.
}

const prisma = new PrismaClient();

async function main() {
  const [username, password] = process.argv.slice(2);

  if (!username || !password) {
    throw new Error(
      "Usage: npm run admin:password -- <username> <password>\n" +
        "Wrap either in quotes if it contains spaces."
    );
  }
  if (password.length < 12) {
    throw new Error(
      `That password is ${password.length} characters. Use at least 12 — this is ` +
        "the only thing standing in front of the admin panel."
    );
  }

  const row = await prisma.adminAccount.upsert({
    where: { id: "admin" },
    update: { username: username.trim(), passwordHash: hashPassword(password) },
    create: {
      id: "admin",
      username: username.trim(),
      passwordHash: hashPassword(password),
    },
  });

  const host = (process.env.DATABASE_URL || "").match(/@([^/?]+)/)?.[1] ?? "unknown";
  console.log(`✅ Admin sign-in set to "${row.username}".`);
  console.log(`   Database: ${host}`);
  console.log(`   Every site using this database now accepts it — no redeploy needed.`);
}

main()
  .catch((e) => {
    console.error(`\n${e instanceof Error ? e.message : e}`);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
