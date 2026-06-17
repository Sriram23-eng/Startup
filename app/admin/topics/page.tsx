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
  { key: "order", label: "Order" },
];

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
    { name: "videoUrl", label: "6. AI video URL", type: "text", full: true, hint: "embed link (YouTube/MP4/etc.)" },
    { name: "quiz", label: "7. Quiz", type: "textarea", full: true, hint: "MCQs / coding questions" },
    { name: "exercise", label: "8. Exercise", type: "textarea", full: true },
    { name: "simulationUrl", label: "9. Simulation URL", type: "text", full: true, hint: "Wokwi / Proteus link" },
    { name: "miniProject", label: "10. Mini project", type: "textarea", full: true },
    { name: "downloads", label: "11. Downloads", type: "textarea", full: true, hint: "one link per line" },
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
        empty ones are simply hidden for students.
      </p>
      <CrudManager
        endpoint="/api/admin/topics"
        fields={fields}
        columns={columns}
        defaults={defaults}
        newLabel="Add topic"
      />
    </AdminShell>
  );
}
