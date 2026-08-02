"use client";

import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  The written documentation that accompanies the video.              */
/*                                                                      */
/*  Kept deliberately separate from the lesson body: the sections above */
/*  teach the topic step by step, this is the reference a student keeps */
/*  open while building, or downloads to read away from the site.       */
/*                                                                      */
/*  Renders the small slice of markdown the generator is asked to emit  */
/*  — headings, lists, code and bold — rather than pulling in a parser  */
/*  for a document whose shape we control.                              */
/* ------------------------------------------------------------------ */

type Block =
  | { kind: "heading"; text: string }
  | { kind: "para"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; text: string };

function parse(md: string): Block[] {
  const blocks: Block[] = [];
  const lines = md.replace(/\r\n/g, "\n").split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) body.push(lines[i++]);
      i++; // closing fence
      blocks.push({ kind: "code", text: body.join("\n") });
      continue;
    }

    const heading = line.match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      blocks.push({ kind: "heading", text: heading[1].trim() });
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, "").trim());
        i++;
      }
      blocks.push({ kind: "list", items });
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !lines[i].trim().startsWith("```")
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ kind: "para", text: para.join(" ") });
  }

  return blocks;
}

/** Renders `**bold**` and `` `code` `` inside a line of text. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-navy-800">
              {p.slice(2, -2)}
            </strong>
          );
        }
        if (p.startsWith("`") && p.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-navy-900/6 px-1.5 py-0.5 font-mono text-[0.9em] text-brand-700"
            >
              {p.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

export default function TopicDoc({
  markdown,
  topicTitle,
}: {
  markdown: string;
  topicTitle: string;
}) {
  const blocks = useMemo(() => parse(markdown), [markdown]);
  const [open, setOpen] = useState(false);

  // Long docs are collapsed so they don't bury the sections below them.
  const isLong = blocks.length > 8;
  const shown = open || !isLong ? blocks : blocks.slice(0, 8);

  function download() {
    const blob = new Blob([`# ${topicTitle}\n\n${markdown}\n`], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topicTitle.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-700/10 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-700/8 bg-brand-50/40 px-5 py-3.5">
        <div>
          <div className="text-sm font-extrabold text-navy-800">
            📘 Documentation
          </div>
          <div className="text-xs text-navy-700/55">
            The video and the concept, written out in full
          </div>
        </div>
        <button
          onClick={download}
          className="rounded-xl border border-navy-700/12 bg-white px-3.5 py-2 text-xs font-bold text-navy-700 transition hover:bg-brand-50 hover:text-brand-700"
        >
          ⬇ Download
        </button>
      </div>

      <div className="px-5 py-5">
        {shown.map((b, i) => {
          if (b.kind === "heading") {
            return (
              <h3
                key={i}
                className="mt-6 text-base font-extrabold text-navy-800 first:mt-0"
              >
                {b.text}
              </h3>
            );
          }
          if (b.kind === "list") {
            return (
              <ul key={i} className="mt-3 space-y-1.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5 text-[15px] text-navy-700/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <span>
                      <Inline text={it} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          }
          if (b.kind === "code") {
            return (
              <pre
                key={i}
                className="mt-3 overflow-x-auto rounded-xl bg-navy-900 p-4 text-sm text-brand-100"
              >
                <code>{b.text}</code>
              </pre>
            );
          }
          return (
            <p key={i} className="mt-3 text-[15px] leading-relaxed text-navy-700/85">
              <Inline text={b.text} />
            </p>
          );
        })}

        {isLong && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-5 text-sm font-bold text-brand-600 hover:underline"
          >
            {open ? "Show less ↑" : "Read the full documentation ↓"}
          </button>
        )}
      </div>
    </div>
  );
}
