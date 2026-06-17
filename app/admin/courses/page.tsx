"use client";

import AdminShell from "@/components/admin/AdminShell";
import CrudManager, { Field, Column } from "@/components/admin/CrudManager";
import { categories, categoryName } from "@/lib/data";
import { formatINR } from "@/lib/site";

const catOptions = categories.map((c) => ({ value: c.slug, label: c.name }));

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true, full: true },
  {
    name: "mode",
    label: "Mode",
    type: "select",
    options: [
      { value: "Live", label: "Live cohort" },
      { value: "Self-paced", label: "Self-paced" },
    ],
  },
  {
    name: "level",
    label: "Level",
    type: "select",
    options: [
      { value: "Beginner", label: "Beginner" },
      { value: "Intermediate", label: "Intermediate" },
      { value: "Advanced", label: "Advanced" },
    ],
  },
  { name: "category", label: "Category", type: "select", options: catOptions },
  { name: "instructor", label: "Instructor", type: "text", full: true, hint: "Name · role" },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "oldPrice", label: "Old price (₹)", type: "number", hint: "optional strike-through" },
  { name: "rating", label: "Rating", type: "number", hint: "0–5" },
  { name: "learners", label: "Learners", type: "number" },
  { name: "lessons", label: "Lessons", type: "number" },
  { name: "hours", label: "Hours", type: "number" },
  { name: "image", label: "Image URL", type: "text", full: true, hint: "https://…" },
  { name: "blurb", label: "Blurb", type: "textarea", full: true },
  { name: "highlights", label: "Highlights", type: "list", full: true, hint: "one per line" },
  {
    name: "topics",
    label: "Topics (syllabus)",
    type: "list",
    full: true,
    hint: "one per line — these drive the AI lessons & AI tutor for this course",
  },
  { name: "startDate", label: "Start date", type: "text", hint: "Live only · e.g. Jul 6, 2026" },
  { name: "schedule", label: "Schedule", type: "text", hint: "Live only · e.g. Sat & Sun 7–9 PM" },
  { name: "seatsLeft", label: "Seats left", type: "number", hint: "Live only" },
];

const defaults = {
  title: "",
  mode: "Live",
  level: "Beginner",
  category: categories[0].slug,
  instructor: "",
  price: "",
  oldPrice: "",
  rating: 4.8,
  learners: 0,
  lessons: 0,
  hours: 0,
  image: "",
  blurb: "",
  highlights: "",
  topics: "",
  startDate: "",
  schedule: "",
  seatsLeft: "",
};

const columns: Column[] = [
  {
    key: "title",
    label: "Course",
    render: (it) => <span className="font-semibold">{String(it.title)}</span>,
  },
  {
    key: "mode",
    label: "Mode",
    render: (it) =>
      it.mode === "Live" ? (
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
          🔴 Live
        </span>
      ) : (
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
          Self-paced
        </span>
      ),
  },
  { key: "level", label: "Level" },
  { key: "category", label: "Category", render: (it) => categoryName(String(it.category)) },
  { key: "price", label: "Price", render: (it) => formatINR(Number(it.price)) },
];

export default function AdminCourses() {
  return (
    <AdminShell title="Courses">
      <CrudManager
        endpoint="/api/admin/courses"
        fields={fields}
        columns={columns}
        defaults={defaults}
        newLabel="Add course"
      />
    </AdminShell>
  );
}
