"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  The per-course tutor, docked at the end of the lesson.             */
/*                                                                      */
/*  Answers stream in token by token, so a student sees the reply       */
/*  forming instead of watching a spinner. The conversation is kept in  */
/*  component state only — it resets when they move to the next topic,  */
/*  which is the right scope: the tutor is about the lesson in front of */
/*  them, and the server re-reads that lesson on every request.         */
/* ------------------------------------------------------------------ */

type Msg = { role: "user" | "assistant"; content: string };

export default function Tutor({
  courseSlug,
  topicId,
  topicTitle,
}: {
  courseSlug: string;
  topicId: string | null;
  topicTitle: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  // Moving to another topic starts a fresh conversation about that topic.
  useEffect(() => {
    setMessages([]);
    setError("");
  }, [topicId]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;

    const history: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, topicId, messages: history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "The tutor is unavailable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        // Replace the trailing placeholder with the answer so far.
        setMessages([...history, { role: "assistant", content: answer }]);
      }
    } catch (err) {
      setMessages(history);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const starters = [
    `Explain "${topicTitle}" more simply`,
    "Why does the code work?",
    "What usually goes wrong here?",
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-700/10 bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-navy-700/8 bg-navy-800 px-5 py-3.5 text-white">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-accent/15 text-lg">
          🤖
        </span>
        <div>
          <div className="text-sm font-extrabold">Course tutor</div>
          <div className="text-xs text-brand-100/60">
            Knows this lesson — ask anything about it
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div ref={scroller} className="max-h-96 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-brand-600 text-white"
                    : "bg-brand-50/60 text-navy-700/90"
                }`}
              >
                {m.content ||
                  (busy && i === messages.length - 1 ? (
                    <span className="inline-flex gap-1 py-1">
                      <Dot delay="0ms" />
                      <Dot delay="150ms" />
                      <Dot delay="300ms" />
                    </span>
                  ) : null)}
              </div>
            </div>
          ))}
        </div>
      )}

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-5 pt-5">
          {starters.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full border border-navy-700/12 px-3 py-1.5 text-xs font-semibold text-navy-700/70 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mx-5 mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 px-5 py-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this topic…"
          disabled={busy}
          className="w-full rounded-xl border border-navy-700/12 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-navy-700/35 focus:border-brand-400 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="shrink-0 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "…" : "Ask"}
        </button>
      </form>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-700/35"
      style={{ animationDelay: delay }}
    />
  );
}
