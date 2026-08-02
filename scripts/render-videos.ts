/* ------------------------------------------------------------------ */
/*  Render lesson scripts into real MP4 files.                          */
/*                                                                      */
/*    npm run render:videos -- <course-slug>                            */
/*    npm run render:videos -- <course-slug> --limit 2                  */
/*    npm run render:videos -- <course-slug> --dry-run                  */
/*    npm run render:videos -- <course-slug> --force                    */
/*                                                                      */
/*  Renders one lesson at a time and saves each finished URL onto the    */
/*  topic as it lands, so an interrupted run keeps everything it has     */
/*  already paid to render.                                             */
/*                                                                      */
/*  --dry-run prints the movie JSON for the first lesson and stops. It   */
/*  needs no API key and spends no credits — use it to check the         */
/*  composition before committing render minutes to 24 lessons.          */
/* ------------------------------------------------------------------ */
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { parseVideoScript } from "../lib/course-gen";
import { buildMovie, renderLessonVideo } from "../lib/video-render";

// tsx doesn't read .env on its own.
try {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
} catch {
  /* rely on the ambient environment */
}

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const courseSlug = args.find((a) => !a.startsWith("--"));
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const limitIdx = args.indexOf("--limit");
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : Infinity;

async function main() {
  if (!courseSlug) {
    throw new Error(
      "Usage: npm run render:videos -- <course-slug> [--limit N] [--force] [--dry-run]"
    );
  }
  if (!dryRun && !process.env.JSON2VIDEO_API_KEY) {
    throw new Error(
      "JSON2VIDEO_API_KEY is not set. Add it to .env, or pass --dry-run to " +
        "inspect the movie JSON without rendering."
    );
  }

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) throw new Error(`No course with slug "${courseSlug}".`);

  const modules = await prisma.courseModule.findMany({
    where: { courseSlug },
    orderBy: { order: "asc" },
    include: { topics: { orderBy: { order: "asc" } } },
  });
  const all = modules.flatMap((m) => m.topics);

  const scripted = all.filter((t) => parseVideoScript(t.videoScript).length > 0);
  if (scripted.length === 0) {
    throw new Error(
      `None of the ${all.length} lessons in "${course.title}" has a video script yet.\n` +
        `Write them first:  npm run gen:lessons -- ${courseSlug} --limit 2`
    );
  }

  // A lesson that already has a URL has already been rendered and paid for.
  const pending = scripted.filter((t) => force || !t.videoUrl.trim());

  console.log(`Course: ${course.title}`);
  console.log(
    `Lessons: ${all.length} total, ${scripted.length} with a script, ` +
      `${scripted.length - pending.length} already rendered.`
  );

  if (pending.length === 0) {
    console.log("Nothing to render. Pass --force to re-render.");
    return;
  }

  if (dryRun) {
    const t = pending[0];
    const movie = buildMovie(parseVideoScript(t.videoScript), t.title);
    console.log(`\n--- movie JSON for "${t.title}" (not sent anywhere) ---\n`);
    console.log(JSON.stringify(movie, null, 2));
    console.log(
      `\n${movie.scenes.length} scenes. ${pending.length} lesson(s) would render.`
    );
    return;
  }

  const queue = pending.slice(0, limit);
  let done = 0;
  let failed = 0;

  for (const [i, topic] of queue.entries()) {
    const scenes = parseVideoScript(topic.videoScript);
    const started = Date.now();
    process.stdout.write(
      `[${i + 1}/${queue.length}] ${topic.title} (${scenes.length} scenes) … `
    );

    try {
      const { url, durationSeconds } = await renderLessonVideo(scenes, topic.title);
      await prisma.topic.update({ where: { id: topic.id }, data: { videoUrl: url } });

      const mins = Math.round((Date.now() - started) / 1000);
      console.log(
        `ok (${durationSeconds ? `${Math.round(durationSeconds)}s video, ` : ""}${mins}s to render)`
      );
      done++;
    } catch (err) {
      console.log(`FAILED — ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }
  }

  console.log("");
  console.log(`✅ Rendered ${done} video(s).${failed ? ` ${failed} failed.` : ""}`);
  if (done > 0) {
    console.log(
      "   The lesson pages now play these instead of the in-browser slides.\n" +
        "   Hosted render URLs are not guaranteed to live forever — download the\n" +
        "   files and re-upload them somewhere you control before you rely on them."
    );
  }
  if (failed) console.log("   Re-run the same command to retry the failures.");
}

main()
  .catch((e) => {
    console.error(`\n${e instanceof Error ? e.message : e}`);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
