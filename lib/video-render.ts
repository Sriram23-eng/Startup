/* ------------------------------------------------------------------ */
/*  Turning a lesson script into a real MP4.                            */
/*                                                                      */
/*  The scenes Claude writes are already a storyboard — a heading, the  */
/*  lines on the slide, optional code, and what the narrator says. This */
/*  composes them into a JSON2Video movie and renders it.               */
/*                                                                      */
/*  Note this is a *rendering* service, not a generative video model.   */
/*  The text on screen is the text we send, character for character,    */
/*  which is the whole reason it is usable for teaching code: a model   */
/*  that invents pixels cannot be trusted to spell pinMode correctly,   */
/*  let alone wire pin 13 to the right leg of an LED.                   */
/* ------------------------------------------------------------------ */
import type { VideoScene } from "./course-gen";

const API = "https://api.json2video.com/v2/movies";

/** Indian-English by default — it is who the course is for. Override per deploy. */
const VOICE = process.env.JSON2VIDEO_VOICE || "en-IN-NeerjaNeural";
const RESOLUTION = process.env.JSON2VIDEO_RESOLUTION || "full-hd";

export function isRenderConfigured(): boolean {
  return Boolean(process.env.JSON2VIDEO_API_KEY);
}

/* ====================== composing the movie ====================== */

/**
 * Build the movie payload for one lesson.
 *
 * Each script scene becomes one movie scene. The narration drives the
 * timing: the voice element takes `duration: -1`, meaning "as long as the
 * speech turns out to be", and every visual element takes `-2`, meaning
 * "as long as the scene". So a slide is on screen for exactly as long as
 * it is being talked about, with no timings to keep in sync by hand.
 */
export function buildMovie(scenes: VideoScene[], lessonTitle: string) {
  return {
    resolution: RESOLUTION,
    quality: "high",
    scenes: scenes.map((scene, i) => ({
      comment: `${i + 1}. ${scene.title}`,
      "background-color": "#0B1622",
      elements: [
        // Narration first — it is what the scene's length is measured from.
        {
          type: "voice",
          text: scene.narration,
          voice: VOICE,
          duration: -1,
        },
        // Course name, small, top-left.
        {
          type: "text",
          text: lessonTitle,
          "font-family": "Geist",
          "font-size": 28,
          "font-color": "#5EEAD4",
          x: 80,
          y: 70,
          duration: -2,
        },
        // Slide heading.
        {
          type: "text",
          text: scene.title,
          "font-family": "Geist",
          "font-size": 78,
          "font-color": "#FFFFFF",
          x: 80,
          y: 150,
          duration: -2,
        },
        // The bullets, as one block so line spacing stays even.
        ...(scene.bullets?.length
          ? [
              {
                type: "text",
                text: scene.bullets.map((b) => `•  ${b}`).join("\n"),
                "font-family": "Geist",
                "font-size": 44,
                "font-color": "#D7E3EF",
                x: 80,
                y: 300,
                duration: -2,
              },
            ]
          : []),
        // Code, monospaced and lower down so it never collides with bullets.
        ...(scene.code?.trim()
          ? [
              {
                type: "text",
                text: scene.code,
                "font-family": "Courier New",
                "font-size": 38,
                "font-color": "#7DD3A0",
                x: 80,
                y: 640,
                duration: -2,
              },
            ]
          : []),
      ],
    })),
  };
}

/* ====================== talking to the service ====================== */

function apiKey(): string {
  const key = process.env.JSON2VIDEO_API_KEY;
  if (!key) {
    throw new Error(
      "JSON2VIDEO_API_KEY is not set. Get one at json2video.com → Dashboard → " +
        "API key, then add it to .env."
    );
  }
  return key;
}

/** Submit a render. Returns the project id to poll. */
export async function submitRender(movie: unknown): Promise<string> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey() },
    body: JSON.stringify(movie),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success || !data?.project) {
    throw new Error(
      `Render request rejected (HTTP ${res.status}): ${
        data?.message || data?.error || JSON.stringify(data) || "no response body"
      }`
    );
  }
  return data.project as string;
}

export type RenderResult = { url: string; durationSeconds?: number };

/**
 * Poll until the render finishes.
 *
 * The status payload's exact shape isn't pinned down in the public docs, so
 * the finished URL is looked for in the documented place and a couple of
 * plausible neighbours; if none of them holds it, the whole payload is put
 * in the error rather than failing with a bare "undefined".
 */
export async function pollRender(
  project: string,
  { timeoutMs = 15 * 60_000, intervalMs = 8_000 } = {}
): Promise<RenderResult> {
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    if (Date.now() > deadline) {
      throw new Error(`Render timed out after ${Math.round(timeoutMs / 60000)} minutes.`);
    }
    await new Promise((r) => setTimeout(r, intervalMs));

    const res = await fetch(`${API}?project=${encodeURIComponent(project)}`, {
      headers: { "x-api-key": apiKey() },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(`Status check failed (HTTP ${res.status}).`);
    }

    const movie = data?.movie ?? data;
    const status = movie?.status;

    if (status === "done") {
      const url = movie?.url ?? movie?.video_url ?? movie?.output ?? data?.url;
      if (typeof url !== "string" || !url.startsWith("http")) {
        throw new Error(
          `Render finished but no video URL was found. Full response:\n${JSON.stringify(
            data,
            null,
            2
          )}`
        );
      }
      return { url, durationSeconds: movie?.duration };
    }
    if (status === "error" || status === "timeout") {
      throw new Error(`Render ${status}: ${movie?.message || "no detail given"}`);
    }
    // Anything else means still working — keep waiting.
  }
}

/** Compose, submit and wait. Returns the finished MP4 URL. */
export async function renderLessonVideo(
  scenes: VideoScene[],
  lessonTitle: string
): Promise<RenderResult> {
  const project = await submitRender(buildMovie(scenes, lessonTitle));
  return pollRender(project);
}
