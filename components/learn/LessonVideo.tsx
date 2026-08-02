"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { VideoScene } from "@/lib/course-gen";

/* ------------------------------------------------------------------ */
/*  The generated lesson video.                                        */
/*                                                                      */
/*  Claude writes the script — slides plus what the narrator says over  */
/*  each one — and this plays it: the slide animates in, the narration  */
/*  is spoken, and when the sentence ends the next slide follows. It    */
/*  behaves like a video (play, pause, scrub, speed) without one ever   */
/*  being rendered or downloaded.                                       */
/*                                                                      */
/*  Speech uses the browser's own synthesiser, so a lesson costs        */
/*  nothing to play and works offline once the page has loaded. When    */
/*  the browser has no voices — or the student mutes it — scenes        */
/*  advance on a reading-speed timer instead and the narration is read  */
/*  from the caption bar.                                               */
/* ------------------------------------------------------------------ */

/** Rough time to read a line aloud, used when speech is unavailable. */
function estimateMs(text: string, rate: number): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2600, (words / (2.6 * rate)) * 1000);
}

const SPEEDS = [0.75, 1, 1.25, 1.5];

/**
 * Whether this browser can speak. Safe to call during an effect or a handler,
 * never during render — `window` does not exist on the server, so branching on
 * it while rendering makes the first client paint disagree with the server's
 * HTML and React throws away the tree.
 */
const speechSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export default function LessonVideo({
  scenes,
  title,
}: {
  scenes: VideoScene[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [ended, setEnded] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);

  // Held so a scene change can cancel whatever the previous scene started,
  // whether that was speech or a timer.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bumped on every stop so a late `onend` from a cancelled utterance can be
  // recognised as stale and ignored — Chrome fires those after cancel().
  const run = useRef(0);

  const scene = scenes[index];
  const total = scenes.length;

  useEffect(() => {
    if (!speechSupported()) return;
    // Voices load asynchronously in Chrome; until they do, speaking is a no-op.
    const check = () => setCanSpeak(window.speechSynthesis.getVoices().length > 0);
    check();
    window.speechSynthesis.addEventListener("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", check);
  }, []);

  const stop = useCallback(() => {
    run.current += 1;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (speechSupported()) window.speechSynthesis.cancel();
  }, []);

  // Drives the deck: whenever we are playing, present the current scene and
  // arrange for the next one to follow when this one finishes.
  useEffect(() => {
    if (!playing || !scene) return;

    const token = ++run.current;
    const advance = () => {
      if (run.current !== token) return; // superseded by a newer scene
      if (index + 1 < total) {
        setIndex((i) => i + 1);
      } else {
        setPlaying(false);
        setEnded(true);
      }
    };

    if (!muted && canSpeak) {
      const utter = new SpeechSynthesisUtterance(scene.narration);
      utter.rate = rate;
      utter.onend = advance;
      // If speech fails mid-way, fall back to the timer rather than stalling.
      utter.onerror = () => {
        if (run.current !== token) return;
        timer.current = setTimeout(advance, estimateMs(scene.narration, rate));
      };
      window.speechSynthesis.speak(utter);
    } else {
      timer.current = setTimeout(advance, estimateMs(scene.narration, rate));
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      if (speechSupported()) window.speechSynthesis.cancel();
    };
  }, [playing, index, muted, rate, canSpeak, scene, total]);

  // Leaving the page mid-narration would otherwise keep talking.
  useEffect(() => stop, [stop]);

  const go = (next: number) => {
    stop();
    setEnded(false);
    setIndex(Math.max(0, Math.min(total - 1, next)));
  };

  const toggle = () => {
    if (ended) {
      stop();
      setEnded(false);
      setIndex(0);
      setPlaying(true);
      return;
    }
    if (playing) stop();
    setPlaying((p) => !p);
  };

  const progress = useMemo(
    () => (total <= 1 ? 100 : (index / (total - 1)) * 100),
    [index, total]
  );

  if (!scene) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-700/10 bg-navy-900 shadow-card">
      {/* Stage */}
      <div className="relative aspect-video w-full">
        <div className="mesh pointer-events-none absolute inset-0 opacity-40" />

        {/* The slide. Keyed on index so each scene re-runs the entrance. */}
        <div
          key={index}
          className="animate-rise absolute inset-0 flex flex-col justify-center px-6 py-8 sm:px-12"
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-accent">
            {title}
          </div>
          <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-4xl">
            {scene.title}
          </h3>

          {scene.bullets?.length > 0 && (
            <ul className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
              {scene.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-brand-100/85 sm:text-lg"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-accent sm:mt-2.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {scene.code?.trim() && (
            <pre className="mt-4 max-h-32 overflow-auto rounded-xl bg-black/40 p-3 text-[11px] leading-relaxed text-brand-100 ring-1 ring-white/10 sm:mt-6 sm:max-h-40 sm:p-4 sm:text-sm">
              <code>{scene.code}</code>
            </pre>
          )}
        </div>

        {/* Scene counter */}
        <div className="absolute right-4 top-4 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/70 backdrop-blur-sm">
          {index + 1} / {total}
        </div>

        {/* Big play affordance — a paused video should look like one. */}
        {!playing && (
          <button
            onClick={toggle}
            aria-label={ended ? "Replay" : "Play"}
            className="group absolute inset-0 grid place-items-center bg-black/25 transition hover:bg-black/35"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-2xl text-navy-900 shadow-glow transition group-hover:scale-105">
              {ended ? "↻" : "▶"}
            </span>
          </button>
        )}
      </div>

      {/* Caption — also the readable transcript when speech is off. */}
      <div className="border-t border-white/10 bg-black/25 px-5 py-3">
        <p className="min-h-[2.75rem] text-sm leading-relaxed text-brand-100/80">
          {scene.narration}
        </p>
      </div>

      {/* Controls */}
      <div className="border-t border-white/10 bg-navy-900">
        <div className="h-1 w-full bg-white/10">
          <div
            className="h-full bg-cyan-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <button
            onClick={toggle}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            {ended ? "↻ Replay" : playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            ⏮ Prev
          </button>
          <button
            onClick={() => go(index + 1)}
            disabled={index >= total - 1}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            Next ⏭
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Only offered once voices have actually loaded — before that
                there is nothing to mute, and rendering it on the server
                would disagree with the first client paint. */}
            {canSpeak && (
              <button
                onClick={() => {
                  stop();
                  setMuted((m) => !m);
                }}
                title={muted ? "Turn narration on" : "Turn narration off"}
                className="rounded-lg px-2.5 py-1.5 text-sm text-white/70 transition hover:bg-white/10"
              >
                {muted ? "🔇" : "🔊"}
              </button>
            )}
            <select
              value={rate}
              onChange={(e) => {
                stop();
                setRate(Number(e.target.value));
              }}
              aria-label="Playback speed"
              className="rounded-lg bg-white/10 px-2 py-1.5 text-xs font-semibold text-white outline-none"
            >
              {SPEEDS.map((s) => (
                <option key={s} value={s} className="text-navy-900">
                  {s}×
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scene chapters */}
        <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-4 py-2.5">
          {scenes.map((s, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              title={s.title}
              className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                i === index
                  ? "bg-cyan-accent text-navy-900"
                  : "text-white/45 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
