"use client";

import AdminShell from "@/components/admin/AdminShell";
import CrudManager, { Field, Column } from "@/components/admin/CrudManager";
import { formatMoney } from "@/lib/site";

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true, full: true },
  { name: "slug", label: "Slug", type: "text", full: true, hint: "set on create; e.g. embedded-iot-dashboard-kit" },
  { name: "tagline", label: "Tagline / short pitch", type: "text", full: true, hint: "one line shown under the title" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      "Template", "IoT", "AI & Machine Learning", "Embedded", "Robotics",
      "Web App", "Mobile App", "Other",
    ].map((c) => ({ value: c, label: c })),
  },
  { name: "badge", label: "Badge label", type: "text", hint: "Bestseller · New · Hot Deal · Limited" },
  { name: "price", label: "Price", type: "number", hint: "e.g. 8000 — 0 for free" },
  { name: "originalPrice", label: "Original price", type: "number", hint: "for discount; blank if none" },
  {
    name: "currency",
    label: "Currency",
    type: "select",
    options: [
      { value: "INR", label: "INR (₹)" },
      { value: "USD", label: "USD ($)" },
      { value: "EUR", label: "EUR (€)" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "PUBLISHED", label: "Published" },
      { value: "DRAFT", label: "Draft" },
    ],
  },
  { name: "featured", label: "Featured on shop page", type: "checkbox" },
  { name: "order", label: "Display order", type: "number", hint: "lower shows first" },
  { name: "publishDate", label: "Publish date", type: "text", hint: "e.g. 15-06-2026" },
  { name: "sku", label: "SKU / Product ID", type: "text", hint: "e.g. ALPHHA-IOT-001" },
  { name: "version", label: "Version / Edition", type: "text", hint: "e.g. v2.3 — 2025 Edition" },
  { name: "license", label: "License", type: "text", hint: "e.g. Commercial use — unlimited" },
  { name: "coverImage", label: "Cover / main image URL", type: "text", full: true, hint: "https://…" },
  { name: "gallery", label: "Gallery images", type: "list", full: true, hint: "one URL per line" },
  { name: "highlights", label: "Key highlights", type: "list", full: true, hint: "one per line — Amazon-style bullets" },
  { name: "about", label: "About this product", type: "textarea", required: true, full: true },
  { name: "included", label: "What's included", type: "list", full: true, hint: "one per line (checklist)" },
  {
    name: "specs",
    label: "Specifications (JSON)",
    type: "textarea",
    full: true,
    hint: '[{"label":"Database","value":"PostgreSQL"}]',
  },
  { name: "requirements", label: "System requirements", type: "list", full: true, hint: "one per line" },
  { name: "checkoutUrl", label: "Purchase / checkout URL", type: "text", full: true, hint: "Gumroad, Stripe, Lemon Squeezy…" },
  { name: "demoUrl", label: "Live demo URL", type: "text", full: true },
  { name: "metaTitle", label: "Meta title", type: "text", full: true },
  { name: "metaDescription", label: "Meta description", type: "textarea", full: true },
  { name: "ogImage", label: "OG image URL", type: "text", full: true },
];

const defaults = {
  title: "", slug: "", tagline: "", category: "Template", badge: "", price: "",
  originalPrice: "", currency: "INR", status: "DRAFT", featured: false, order: 0,
  publishDate: "", sku: "", version: "", license: "", coverImage: "", gallery: "",
  highlights: "", about: "", included: "", specs: "[]", requirements: "",
  checkoutUrl: "", demoUrl: "", metaTitle: "", metaDescription: "", ogImage: "",
};

const columns: Column[] = [
  { key: "title", label: "Title", render: (it) => <span className="font-semibold">{String(it.title)}</span> },
  { key: "category", label: "Category" },
  { key: "price", label: "Price", render: (it) => formatMoney(Number(it.price), String(it.currency || "INR")) },
  { key: "badge", label: "Badge" },
  {
    key: "status",
    label: "Status",
    render: (it) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
          it.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-navy-700/10 text-navy-700/60"
        }`}
      >
        {String(it.status)}
      </span>
    ),
  },
  { key: "featured", label: "Featured", render: (it) => (it.featured ? "Yes" : "No") },
  {
    key: "updatedAt",
    label: "Updated",
    render: (it) => (it.updatedAt ? new Date(String(it.updatedAt)).toLocaleDateString("en-IN") : "—"),
  },
];

export default function AdminShop() {
  return (
    <AdminShell title="Shop">
      <CrudManager
        endpoint="/api/admin/products"
        fields={fields}
        columns={columns}
        defaults={defaults}
        newLabel="New Product"
      />
    </AdminShell>
  );
}
