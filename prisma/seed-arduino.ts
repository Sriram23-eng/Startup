/* ------------------------------------------------------------------ */
/*  Seeds the "Arduino for Absolute Beginners" outline — the 24         */
/*  lessons, in teaching order, as empty topic pages.                   */
/*                                                                      */
/*  The outline is written by hand rather than generated: the order a   */
/*  beginner meets these ideas in is the whole design of the course,    */
/*  and it costs nothing to state it directly. The lesson *content*     */
/*  is what the generator writes — run scripts/generate-lessons.ts      */
/*  afterwards to fill these pages in.                                  */
/*                                                                      */
/*  Run with:  npm run seed:arduino                                     */
/*  Idempotent: wipes and re-creates this course's modules each run.    */
/* ------------------------------------------------------------------ */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COURSE_SLUG = "arduino-beginners-selfpaced";

type Mod = {
  title: string;
  band: "Beginner" | "Intermediate" | "Advanced" | "Projects";
  /** Ordered lessons. `kind` decides the icon and how the generator writes it. */
  lessons: { title: string; kind: "topic" | "practical" | "project" }[];
};

const OUTLINE: Mod[] = [
  {
    title: "Getting Started",
    band: "Beginner",
    lessons: [
      { title: "What an Arduino Actually Is", kind: "topic" },
      { title: "Installing the Arduino IDE", kind: "practical" },
      { title: "Your First Upload: Blink", kind: "practical" },
      { title: "Reading the Board: Pins, Power and Ports", kind: "topic" },
    ],
  },
  {
    title: "Programming Basics",
    band: "Beginner",
    lessons: [
      { title: "How a Sketch Runs: setup() and loop()", kind: "topic" },
      { title: "Variables and Data Types", kind: "topic" },
      { title: "Maths and Operators", kind: "topic" },
      { title: "Making Decisions with if and else", kind: "topic" },
      { title: "Repeating Work with for and while", kind: "topic" },
    ],
  },
  {
    title: "Digital Input and Output",
    band: "Beginner",
    lessons: [
      { title: "Digital Output: Turning Things On and Off", kind: "topic" },
      { title: "Wiring an LED on a Breadboard", kind: "practical" },
      { title: "Digital Input: Reading a Push Button", kind: "practical" },
      { title: "Pull-up and Pull-down Resistors", kind: "topic" },
      { title: "Debouncing a Button", kind: "practical" },
    ],
  },
  {
    title: "Analog and Sensors",
    band: "Beginner",
    lessons: [
      { title: "Analog Input: Reading a Potentiometer", kind: "practical" },
      { title: "PWM: Fading an LED with analogWrite()", kind: "practical" },
      { title: "Detecting Light with an LDR", kind: "practical" },
      { title: "Reading Temperature with an LM35", kind: "practical" },
      { title: "Measuring Distance with an Ultrasonic Sensor", kind: "practical" },
    ],
  },
  {
    title: "Talking to the World",
    band: "Beginner",
    lessons: [
      { title: "The Serial Monitor: Talking to Your Computer", kind: "topic" },
      { title: "Driving a Servo Motor", kind: "practical" },
      { title: "Showing Text on a 16x2 LCD", kind: "practical" },
    ],
  },
  {
    title: "Build Something",
    band: "Projects",
    lessons: [
      { title: "Project: Automatic Night Lamp", kind: "project" },
      { title: "Project: Distance Alarm with Buzzer", kind: "project" },
    ],
  },
];

async function main() {
  const course = await prisma.course.findUnique({ where: { slug: COURSE_SLUG } });
  if (!course) {
    throw new Error(
      `No course with slug "${COURSE_SLUG}". Create it in Admin → Courses first.`
    );
  }

  // Cascades to topics, so a re-run rebuilds the outline cleanly.
  const removed = await prisma.courseModule.deleteMany({
    where: { courseSlug: COURSE_SLUG },
  });
  if (removed.count > 0) console.log(`Cleared ${removed.count} existing module(s).`);

  let lessonCount = 0;
  let moduleOrder = 0;

  for (const mod of OUTLINE) {
    const created = await prisma.courseModule.create({
      data: {
        courseSlug: COURSE_SLUG,
        title: mod.title,
        band: mod.band,
        order: moduleOrder++,
      },
    });

    let order = 0;
    for (const lesson of mod.lessons) {
      await prisma.topic.create({
        data: {
          moduleId: created.id,
          title: lesson.title,
          kind: lesson.kind,
          order: order++,
        },
      });
      lessonCount++;
    }
  }

  // Keep the catalogue card honest about how many lessons the course has.
  if (course.lessons !== lessonCount) {
    await prisma.course.update({
      where: { slug: COURSE_SLUG },
      data: { lessons: lessonCount },
    });
    console.log(`Updated the course card: ${course.lessons} → ${lessonCount} lessons.`);
  }

  console.log(
    `✅ Seeded ${OUTLINE.length} modules and ${lessonCount} lessons for "${course.title}".`
  );
  console.log(`   Next: npm run gen:lessons -- ${COURSE_SLUG} --limit 2`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
