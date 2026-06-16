"use client";

import AdminShell from "@/components/admin/AdminShell";
import CrudManager, { Field, Column } from "@/components/admin/CrudManager";
import { categories, categoryName } from "@/lib/data";
import { formatINR } from "@/lib/site";

const catOptions = categories.map((c) => ({ value: c.slug, label: c.name }));

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true, full: true },
  { name: "category", label: "Category", type: "select", options: catOptions },
  {
    name: "size",
    label: "Size",
    type: "select",
    options: [
      { value: "Small", label: "Small" },
      { value: "Medium", label: "Medium" },
      { value: "Large", label: "Large" },
    ],
  },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "image", label: "Image URL", type: "text", full: true, hint: "https://…" },
  { name: "youtube", label: "YouTube video ID", type: "text", hint: "e.g. dQw4w9WgXcQ" },
  { name: "rating", label: "Rating", type: "number", hint: "0–5" },
  { name: "reviews", label: "Reviews count", type: "number" },
  { name: "readyMade", label: "Ready-made kit", type: "checkbox" },
  { name: "summary", label: "Summary", type: "textarea", full: true },
  { name: "features", label: "Features", type: "list", full: true, hint: "one per line" },
  { name: "components", label: "Components", type: "list", full: true, hint: "one per line" },
  { name: "tags", label: "Tags", type: "list", full: true, hint: "one per line" },
];

const defaults = {
  title: "",
  category: categories[0].slug,
  size: "Medium",
  price: "",
  image: "",
  youtube: "",
  rating: 4.8,
  reviews: 0,
  readyMade: true,
  summary: "",
  features: "",
  components: "",
  tags: "",
};

const columns: Column[] = [
  {
    key: "title",
    label: "Project",
    render: (it) => (
      <span className="font-semibold">{String(it.title)}</span>
    ),
  },
  { key: "category", label: "Category", render: (it) => categoryName(String(it.category)) },
  { key: "size", label: "Size" },
  { key: "price", label: "Price", render: (it) => formatINR(Number(it.price)) },
  {
    key: "readyMade",
    label: "Kit",
    render: (it) =>
      it.readyMade ? (
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">
          Ready
        </span>
      ) : (
        <span className="text-navy-700/40">—</span>
      ),
  },
];

export default function AdminProjects() {
  return (
    <AdminShell title="Projects">
      <CrudManager
        endpoint="/api/admin/projects"
        fields={fields}
        columns={columns}
        defaults={defaults}
        newLabel="Add project"
      />
    </AdminShell>
  );
}
