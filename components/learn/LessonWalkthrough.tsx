import type { VideoScene } from "@/lib/course-gen";

/* ------------------------------------------------------------------ */
/*  The lesson script, read rather than watched.                       */
/*                                                                      */
/*  Claude writes the lesson as a sequence of steps — a heading, what   */
/*  is being explained, the points that matter, and the code at that    */
/*  moment. That is already a good written walkthrough, so it is shown  */
/*  as one: numbered steps a student can scroll, search and copy from,  */
/*  with nothing to press play on and nothing to wait for.              */
/*                                                                      */
/*  A server component — this is text, so it costs the browser nothing. */
/* ------------------------------------------------------------------ */
export default function LessonWalkthrough({ scenes }: { scenes: VideoScene[] }) {
  if (scenes.length === 0) return null;

  return (
    <ol className="space-y-4">
      {scenes.map((scene, i) => (
        <li
          key={i}
          className="overflow-hidden rounded-2xl border border-navy-700/10 bg-white shadow-card"
        >
          <div className="flex items-start gap-3.5 border-b border-navy-700/8 bg-brand-50/40 px-5 py-3.5">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-600 text-xs font-black text-white">
              {i + 1}
            </span>
            <h3 className="text-base font-extrabold text-navy-800">{scene.title}</h3>
          </div>

          <div className="space-y-4 px-5 py-5">
            {scene.narration && (
              <p className="text-[15px] leading-relaxed text-navy-700/85">
                {scene.narration}
              </p>
            )}

            {scene.bullets?.length > 0 && (
              <ul className="space-y-2">
                {scene.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3 text-[15px] text-navy-700/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {scene.code?.trim() && (
              <pre className="overflow-x-auto rounded-xl bg-navy-900 p-4 text-sm leading-relaxed text-brand-100">
                <code>{scene.code}</code>
              </pre>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
