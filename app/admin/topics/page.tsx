"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import CrudManager, { Field, Column } from "@/components/admin/CrudManager";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Opt = { value: string; label: string };

const kindOptions: Opt[] = [
  { value: "topic", label: "Topic (theory)" },
  { value: "practical", label: "Practical" },
  { value: "project", label: "Project" },
];

const columns: Column[] = [
  { key: "title", label: "Topic", render: (it) => <span className="font-semibold">{String(it.title)}</span> },
  { key: "moduleTitle", label: "Module" },
  { key: "kind", label: "Kind" },
  {
    key: "theory",
    label: "Written",
    render: (it) =>
      String(it.theory || "").trim() ? (
        <span className="text-emerald-600">✓ yes</span>
      ) : (
        <span className="text-navy-700/35">empty</span>
      ),
  },
  { key: "order", label: "Order" },
];

/**
 * Writes every section of one topic with Claude. Takes a minute or so — the
 * button reports what it's doing rather than looking hung, and a topic that
 * already has content asks before it gets overwritten.
 */
function GenerateButton({ item, reload }: { item: any; reload: () => Promise<void> }) {
  const [state, setState] = useState<"idle" | "working">("idle");

  async function run() {
    const written = String(item.theory || "").trim();
    if (written && !confirm(`“${item.title}” is already written. Replace it?`)) return;

    setState("working");
    try {
      const res = await fetch(`/api/admin/topics/${item.slug}/generate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Generation failed.");
      await reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setState("idle");
    }
  }

  return (
    <button
      onClick={run}
      disabled={state === "working"}
      className="rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-navy-900 disabled:cursor-wait disabled:opacity-60"
    >
      {state === "working" ? "Writing…" : "✨ Generate"}
    </button>
  );
}

export default function AdminTopics() {
  const [modules, setModules] = useState<Opt[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/modules")
      .then((r) => r.json())
      .then((ms: any[]) =>
        setModules(ms.map((m) => ({ value: m.id, label: `${m.title} (${m.band})` })))
      )
      .catch(() => setModules([]));
  }, []);

  if (!modules) {
    return (
      <AdminShell title="Topics">
        <div className="p-10 text-center text-navy-700/50">Loading…</div>
      </AdminShell>
    );
  }

  if (modules.length === 0) {
    return (
      <AdminShell title="Topics">
        <div className="rounded-2xl border border-dashed border-navy-700/15 bg-white p-10 text-center text-navy-700/60">
          Create a module first (Admin → Modules), then add topics to it.
        </div>
      </AdminShell>
    );
  }

  // The W3Schools-style sections — all editable per topic.
  const fields: Field[] = [
    { name: "moduleId", label: "Module", type: "select", options: modules, full: true },
    { name: "title", label: "Topic title", type: "text", required: true },
    { name: "kind", label: "Kind", type: "select", options: kindOptions },
    { name: "order", label: "Order", type: "number", hint: "lower shows first" },
    { name: "theory", label: "1. Theory", type: "textarea", full: true, hint: "Explain the concept simply" },
    { name: "diagramUrl", label: "2. Diagram image URL", type: "text", full: true, hint: "https://… (circuit/flowchart image)" },
    { name: "components", label: "3. Components required", type: "textarea", full: true, hint: "one per line" },
    { name: "exampleCode", label: "4. Example code", type: "textarea", full: true },
    { name: "codeExplanation", label: "4b. Code explanation", type: "textarea", full: true, hint: "line-by-line" },
    { name: "outputImageUrl", label: "5. Output image URL", type: "text", full: true },
    { name: "videoUrl", label: "6. Video URL (optional)", type: "text", full: true, hint: "a real video, if you have one — it replaces the generated one" },
    { name: "videoScript", label: "6b. Generated video script", type: "textarea", full: true, hint: 'JSON scenes: [{"title","bullets":[],"code","narration"}] — written by Generate' },
    { name: "videoPoints", label: "6c. Main points of the video", type: "textarea", full: true, hint: "one per line — shown under the player" },
    { name: "documentation", label: "7. Documentation", type: "textarea", full: true, hint: "markdown — the written companion to the video and the concept" },
    { name: "quiz", label: "8. Quiz", type: "textarea", full: true, hint: "MCQs / coding questions" },
    { name: "exercise", label: "9. Exercise", type: "textarea", full: true },
    { name: "simulationUrl", label: "10. Simulation URL", type: "text", full: true, hint: "Wokwi / Proteus link" },
    { name: "miniProject", label: "11. Mini project", type: "textarea", full: true },
    { name: "downloads", label: "12. Downloads", type: "textarea", full: true, hint: "one link per line" },
  ];

  const defaults: Record<string, any> = {
    moduleId: modules[0]?.value ?? "",
    title: "",
    kind: "topic",
    order: 0,
    theory: "",
    diagramUrl: "",
    components: "",
    exampleCode: "",
    codeExplanation: "",
    outputImageUrl: "",
    videoUrl: "",
    videoScript: "",
    videoPoints: "",
    documentation: "",
    quiz: "",
    exercise: "",
    simulationUrl: "",
    miniProject: "",
    downloads: "",
  };

  return (
    <AdminShell title="Topics">
      <p className="mb-5 text-sm text-navy-700/60">
        Each topic is a W3Schools-style page. Fill the sections you want —
        empty ones are simply hidden for students. <b>Generate</b> writes the
        whole page with AI, including the video and its documentation; edit
        anything afterwards.
      </p>
      <CrudManager
        endpoint="/api/admin/topics"
        fields={fields}
        columns={columns}
        defaults={defaults}
        newLabel="Add topic"
        rowActions={(item, reload) => <GenerateButton item={item} reload={reload} />}
      />
    </AdminShell>
  );
}
