/* ------------------------------------------------------------------ */
/*  Fills in a course's empty lesson pages with AI-written content.     */
/*                                                                      */
/*    npm run gen:lessons -- <course-slug>              # every empty   */
/*    npm run gen:lessons -- <course-slug> --limit 2    # the first 2   */
/*    npm run gen:lessons -- <course-slug> --force      # rewrite all   */
/*                                                                      */
/*  Lessons are written one at a time, in course order, so each one     */
/*  can be told what has already been taught. That is slower than       */
/*  firing them off in parallel and it is the point: lesson 9 should    */
/*  not re-explain what lesson 3 covered.                                */
/*                                                                      */
/*  Safe to re-run — anything already written is skipped unless you     */
/*  pass --force, so an interrupted run picks up where it stopped.      */
/* ------------------------------------------------------------------ */
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { generateTopicContent } from "../lib/course-gen";

// tsx doesn't read .env on its own, and the API key lives there.
try {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
} catch {
  // No .env — rely on the ambient environment.
}

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const courseSlug = args.find((a) => !a.startsWith("--"));
const force = args.includes("--force");
const limitArg = args.indexOf("--limit");
const limit = limitArg >= 0 ? Number(args[limitArg + 1]) : Infinity;

async function main() {
  if (!courseSlug) {
    throw new Error("Usage: npm run gen:lessons -- <course-slug> [--limit N] [--force]");
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env, then run this again."
    );
  }

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) throw new Error(`No course with slug "${courseSlug}".`);

  const modules = await prisma.courseModule.findMany({
    where: { courseSlug },
    orderBy: { order: "asc" },
    include: { topics: { orderBy: { order: "asc" } } },
  });

  const all = modules.flatMap((m) =>
    m.topics.map((t) => ({ topic: t, moduleTitle: m.title }))
  );
  if (all.length === 0) {
    throw new Error(
      `"${course.title}" has no lessons yet. Seed the outline first (npm run seed:arduino).`
    );
  }

  const syllabus = all.map((e) => e.topic.title);
  const pending = all.filter((e) => force || !e.topic.theory.trim()).slice(0, limit);
  const skipped = all.length - all.filter((e) => force || !e.topic.theory.trim()).length;

  console.log(`Course: ${course.title}`);
  console.log(`Lessons: ${all.length} total, ${skipped} already written.`);
  if (pending.length === 0) {
    console.log("Nothing to do. Pass --force to rewrite existing lessons.");
    return;
  }
  if (Number.isFinite(limit) && pending.length < all.length - skipped) {
    console.log(
      `Writing ${pending.length} of ${all.length - skipped} — ` +
        `${all.length - skipped - pending.length} left after this run.`
    );
  }
  console.log("");

  let done = 0;
  let failed = 0;

  for (const [i, entry] of pending.entries()) {
    const label = `[${i + 1}/${pending.length}] ${entry.topic.title}`;
    const started = Date.now();
    process.stdout.write(`${label} … `);

    try {
      const g = await generateTopicContent({
        courseTitle: course.title,
        moduleTitle: entry.moduleTitle,
        topicTitle: entry.topic.title,
        kind: entry.topic.kind,
        syllabus,
      });

      await prisma.topic.update({
        where: { id: entry.topic.id },
        data: {
          theory: g.theory,
          components: g.components,
          exampleCode: g.exampleCode,
          codeExplanation: g.codeExplanation,
          videoScript: JSON.stringify(g.videoScript),
          videoPoints: g.videoPoints.join("\n"),
          documentation: g.documentation,
          quiz: g.quiz,
          exercise: g.exercise,
          miniProject: g.miniProject,
        },
      });

      const secs = Math.round((Date.now() - started) / 1000);
      console.log(
        `ok (${g.videoScript.length} slides, ${g.videoPoints.length} points, ${secs}s)`
      );
      done++;
    } catch (err) {
      // One bad lesson shouldn't lose the run — record it and carry on.
      console.log(`FAILED — ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }
  }

  console.log("");
  console.log(`✅ Wrote ${done} lesson(s).${failed ? ` ${failed} failed.` : ""}`);
  if (failed) console.log("   Re-run the same command to retry the failures.");
}

main()
  .catch((e) => {
    console.error(`\n${e instanceof Error ? e.message : e}`);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
