"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import CrudManager, { Field, Column } from "@/components/admin/CrudManager";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Opt = { value: string; label: string };

const bandOptions: Opt[] = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
  { value: "Projects", label: "Projects" },
];

const columns: Column[] = [
  { key: "title", label: "Module", render: (it) => <span className="font-semibold">{String(it.title)}</span> },
  { key: "band", label: "Band" },
  { key: "order", label: "Order" },
  { key: "topicCount", label: "Topics" },
];

export default function AdminModules() {
  const [courses, setCourses] = useState<Opt[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((r) => r.json())
      .then((cs: any[]) => setCourses(cs.map((c) => ({ value: c.slug, label: c.title }))))
      .catch(() => setCourses([]));
  }, []);

  if (!courses) {
    return (
      <AdminShell title="Modules">
        <div className="p-10 text-center text-navy-700/50">Loading…</div>
      </AdminShell>
    );
  }

  const fields: Field[] = [
    { name: "courseSlug", label: "Course", type: "select", options: courses, full: true },
    { name: "title", label: "Module title", type: "text", required: true, full: true },
    { name: "band", label: "Band", type: "select", options: bandOptions },
    { name: "order", label: "Order", type: "number", hint: "lower shows first" },
  ];

  const defaults = {
    courseSlug: courses[0]?.value ?? "",
    title: "",
    band: "Beginner",
    order: 0,
  };

  return (
    <AdminShell title="Modules">
      <p className="mb-5 text-sm text-navy-700/60">
        Modules group topics inside a course. Set the band (Beginner →
        Intermediate → Advanced → Projects) and the order they appear.
      </p>
      <CrudManager
        endpoint="/api/admin/modules"
        fields={fields}
        columns={columns}
        defaults={defaults}
        newLabel="Add module"
      />
    </AdminShell>
  );
}
