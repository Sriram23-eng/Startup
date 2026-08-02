/* ------------------------------------------------------------------ */
/*  AI lesson authoring.                                                */
/*                                                                      */
/*  Turns a topic title into a full W3Schools-style lesson page: the    */
/*  theory, the wiring, the sketch and its explanation, a narrated      */
/*  slide video, the video's main points, and the written documentation */
/*  that accompanies both.                                              */
/*                                                                      */
/*  Every field is constrained by a JSON schema the API enforces, so a  */
/*  generated lesson always slots straight into the Topic row — there   */
/*  is no shape to validate on the way back.                            */
/* ------------------------------------------------------------------ */
import { generateJson } from "./ai";
import { prisma } from "./prisma";

/* ====================== the shape of a lesson ====================== */

export type VideoScene = {
  /** Slide heading — short, 2–6 words. */
  title: string;
  /** Lines that appear on the slide. Keep to 4; they are read, not scanned. */
  bullets: string[];
  /** Code shown on this slide, or "" for a slide with no code. */
  code: string;
  /** What the narrator says over this slide. */
  narration: string;
};

export type GeneratedTopic = {
  theory: string;
  components: string;
  exampleCode: string;
  codeExplanation: string;
  videoScript: VideoScene[];
  videoPoints: string[];
  documentation: string;
  quiz: string;
  exercise: string;
  miniProject: string;
};

const str = (description: string) => ({ type: "string", description });

const TOPIC_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  required: [
    "theory",
    "components",
    "exampleCode",
    "codeExplanation",
    "videoScript",
    "videoPoints",
    "documentation",
    "quiz",
    "exercise",
    "miniProject",
  ],
  properties: {
    theory: str(
      "The concept explained for someone who has never used a microcontroller. " +
        "3–6 short paragraphs of plain text, blank line between them. No markdown headings."
    ),
    components: str(
      "The parts needed, one per line, with quantity — e.g. 'Arduino Uno x1'. " +
        "Plain lines only, no bullets or numbering."
    ),
    exampleCode: str(
      "A complete, compilable Arduino sketch for this topic, with brief inline comments. " +
        "Raw code only — no markdown fences."
    ),
    codeExplanation: str(
      "The sketch explained in order, one line per point, each naming the code it " +
        "refers to. Plain text lines, no markdown."
    ),
    videoScript: {
      type: "array",
      description:
        "The lesson as 6–9 steps that build the idea up in order: what problem it " +
        "solves, the concept, the wiring, the code, what you should see, a recap. " +
        "Shown to students as a written walkthrough, and used as the storyboard " +
        "when a video is rendered — so it has to read well on the page, not only " +
        "sound well spoken.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "bullets", "code", "narration"],
        properties: {
          title: str("Step heading, 2–6 words."),
          bullets: {
            type: "array",
            description:
              "2–4 short supporting lines for this step. Fragments, not sentences.",
            items: { type: "string" },
          },
          code: str("The code at this step (a few lines at most), or '' for none."),
          narration: str(
            "The explanation for this step — 2–4 sentences of plain prose. " +
              "Conversational and complete enough to stand on its own when read, " +
              "and natural enough to be spoken aloud. Spell out symbols rather " +
              "than relying on punctuation to carry meaning."
          ),
        },
      },
    },
    videoPoints: {
      type: "array",
      description:
        "The 4–6 things a student should be able to state after watching the video. " +
        "One sentence each, written as takeaways rather than a summary of the slides.",
      items: { type: "string" },
    },
    documentation: str(
      "The written companion to the video: a self-contained reference covering both " +
        "what the video showed and the wider concept behind it. Markdown with '## ' " +
        "headings, roughly 500–900 words. Cover the concept in depth, the pin/wiring " +
        "details, the functions used and their arguments, common mistakes and how to " +
        "spot them, and where this is used in real projects."
    ),
    quiz: str(
      "4 multiple-choice questions. Format each as the question, then lines 'A) ', " +
        "'B) ', 'C) ', 'D) ', then 'Answer: B'. Blank line between questions."
    ),
    exercise: str(
      "One hands-on exercise that changes the example rather than repeating it. " +
        "State the goal, then the steps, then how to tell it worked."
    ),
    miniProject: str(
      "A small buildable project combining this topic with earlier ones. " +
        "Describe what it does, the extra parts needed, and the logic — no full code."
    ),
  },
};

const SYSTEM = `You write lessons for Elektron Nexus, an Indian electronics and IoT
learning platform. The reader is an absolute beginner: a first- or second-year
engineering student who has never written embedded code and may never have held a
microcontroller.

How to write:
- Explain the why before the how. A beginner who is told to write pinMode(13, OUTPUT)
  without being told what a pin mode is has learned nothing.
- Use plain, direct English. Short sentences. No marketing tone, no filler, no
  "in today's fast-paced world".
- Every technical term gets defined the first time it appears.
- Be concrete. Real pin numbers, real component names, real values with units.
- Assume the cheap, common hardware an Indian student actually buys: Arduino Uno,
  a breadboard, jumper wires, and parts from a starter kit.
- Code must actually compile and actually do what the lesson says it does.
- Never invent a part, a function, or a library that does not exist.`;

/* ====================== generation ====================== */

/** Author every section of one topic. */
export async function generateTopicContent({
  courseTitle,
  moduleTitle,
  topicTitle,
  kind,
  syllabus,
}: {
  courseTitle: string;
  moduleTitle: string;
  topicTitle: string;
  kind: string;
  syllabus?: string[];
}): Promise<GeneratedTopic> {
  const kindNote =
    kind === "practical"
      ? "This is a hands-on practical, so the wiring and the observed result carry the lesson."
      : kind === "project"
      ? "This is a build, so the lesson is how the pieces already learned fit together."
      : "This is a theory lesson, so the concept carries it and the code demonstrates the concept.";

  const context = syllabus?.length
    ? `\n\nThe full course covers, in order:\n${syllabus.map((t) => `- ${t}`).join("\n")}\n` +
      `Only rely on topics listed before "${topicTitle}" — anything later has not been taught yet.`
    : "";

  return generateJson<GeneratedTopic>({
    system: SYSTEM,
    prompt:
      `Write the complete lesson for one topic.\n\n` +
      `Course: ${courseTitle}\n` +
      `Module: ${moduleTitle}\n` +
      `Topic: ${topicTitle}\n\n` +
      `${kindNote}${context}\n\n` +
      `The video script, the main points and the documentation must agree with each ` +
      `other and with the example code — they are three views of the same lesson, not ` +
      `three separate takes on the subject.`,
    schema: TOPIC_SCHEMA,
    maxTokens: 32000,
  });
}

const OUTLINE_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  required: ["modules"],
  properties: {
    modules: {
      type: "array",
      description: "The course modules in teaching order.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "band", "topics"],
        properties: {
          title: str("Module name, 2–5 words."),
          band: {
            type: "string",
            description: "Which band this module belongs to.",
            enum: ["Beginner", "Intermediate", "Advanced", "Projects"],
          },
          topics: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["title", "kind"],
              properties: {
                title: str("Topic title — what the student will be able to do."),
                kind: {
                  type: "string",
                  description: "topic = theory, practical = hands-on, project = a build.",
                  enum: ["topic", "practical", "project"],
                },
              },
            },
          },
        },
      },
    },
  },
};

export type GeneratedOutline = {
  modules: { title: string; band: string; topics: { title: string; kind: string }[] }[];
};

/** Draft a module/topic outline for a course that has none yet. */
export async function generateOutline({
  courseTitle,
  blurb,
  lessons,
}: {
  courseTitle: string;
  blurb: string;
  lessons: number;
}): Promise<GeneratedOutline> {
  return generateJson<GeneratedOutline>({
    system: SYSTEM,
    prompt:
      `Draft the syllabus for this course as modules and topics.\n\n` +
      `Course: ${courseTitle}\n` +
      `About: ${blurb}\n` +
      `Target length: about ${lessons} topics in total.\n\n` +
      `Order it so nothing depends on something taught later. Mix theory topics with ` +
      `practicals, and finish with one or two projects that use what came before.`,
    schema: OUTLINE_SCHEMA,
    maxTokens: 8000,
  });
}

/* ====================== persistence ====================== */

/** Generate one topic's content and save it onto the Topic row. */
export async function generateAndSaveTopic(topicId: string) {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { module: true },
  });
  if (!topic) throw new Error("Topic not found.");

  const course = await prisma.course.findUnique({
    where: { slug: topic.module.courseSlug },
    select: { title: true },
  });

  // The other topics in this course, in teaching order — so the lesson can
  // build on what came before and avoid forward references.
  const modules = await prisma.courseModule.findMany({
    where: { courseSlug: topic.module.courseSlug },
    orderBy: { order: "asc" },
    include: { topics: { orderBy: { order: "asc" }, select: { title: true } } },
  });
  const syllabus = modules.flatMap((m) => m.topics.map((t) => t.title));

  const g = await generateTopicContent({
    courseTitle: course?.title ?? topic.module.courseSlug,
    moduleTitle: topic.module.title,
    topicTitle: topic.title,
    kind: topic.kind,
    syllabus,
  });

  return prisma.topic.update({
    where: { id: topicId },
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
}

/** Parse a stored video script back into scenes. Never throws. */
export function parseVideoScript(raw: string): VideoScene[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s): s is VideoScene =>
        s && typeof s.title === "string" && typeof s.narration === "string"
    );
  } catch {
    return [];
  }
}
