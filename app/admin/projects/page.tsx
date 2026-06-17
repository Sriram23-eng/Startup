"use client";

import AdminShell from "@/components/admin/AdminShell";
import CrudManager, { Field, Column } from "@/components/admin/CrudManager";
import { categories, categoryName } from "@/lib/data";
import { formatMoney } from "@/lib/site";

const catOptions = categories.map((c) => ({ value: c.slug, label: c.name }));

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true, full: true },
  { name: "category", label: "Category", type: "select", options: catOptions },
  { name: "badge", label: "Badge label", type: "text", hint: "Bestseller · New · Hot Deal" },
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
  { name: "originalPrice", label: "Original price (for discount)", type: "number", hint: "blank if none" },
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
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "readyMade", label: "Ready-made kit", type: "checkbox" },
  { name: "order", label: "Display order", type: "number", hint: "lower shows first" },
  { name: "rating", label: "Rating", type: "number", hint: "0–5" },
  { name: "reviews", label: "Reviews count", type: "number" },
  { name: "image", label: "Cover image URL", type: "text", full: true, hint: "https://…" },
  { name: "gallery", label: "Gallery images", type: "list", full: true, hint: "one URL per line" },
  { name: "summary", label: "Tagline / short pitch", type: "textarea", full: true, hint: "shown under the title" },
  { name: "features", label: "Key highlights", type: "list", full: true, hint: "one per line" },
  { name: "about", label: "About this product", type: "textarea", full: true, hint: "long description" },
  { name: "included", label: "What's included", type: "list", full: true, hint: "one per line" },
  { name: "components", label: "Components used", type: "list", full: true, hint: "one per line" },
  {
    name: "specs",
    label: "Specifications (JSON)",
    type: "textarea",
    full: true,
    hint: '[{"label":"Protocol","value":"MQTT"}]',
  },
  { name: "requirements", label: "System requirements", type: "list", full: true, hint: "one per line" },
  { name: "license", label: "License", type: "text", hint: "e.g. Commercial use" },
  { name: "version", label: "Version / Edition", type: "text", hint: "e.g. v2.3" },
  { name: "sku", label: "SKU / Product ID", type: "text" },
  { name: "demoUrl", label: "Live demo URL", type: "text", full: true },
  { name: "checkoutUrl", label: "External checkout URL", type: "text", full: true, hint: "optional — Gumroad/Stripe; leave blank to use the on-site buy" },
  { name: "tags", label: "Tags", type: "list", full: true, hint: "one per line" },
  { name: "metaTitle", label: "Meta title", type: "text", full: true },
  { name: "metaDescription", label: "Meta description", type: "textarea", full: true },
  { name: "ogImage", label: "OG image URL", type: "text", full: true },
];

const defaults = {
  title: "", category: categories[0].slug, badge: "", size: "Medium", price: "",
  originalPrice: "", currency: "INR", status: "PUBLISHED", featured: false, readyMade: true,
  order: 0, rating: 4.8, reviews: 0, image: "", gallery: "", summary: "", features: "",
  about: "", included: "", components: "", specs: "[]", requirements: "", license: "",
  version: "", sku: "", demoUrl: "", checkoutUrl: "", tags: "", metaTitle: "",
  metaDescription: "", ogImage: "",
};

const columns: Column[] = [
  { key: "title", label: "Title", render: (it) => <span className="font-semibold">{String(it.title)}</span> },
  { key: "category", label: "Category", render: (it) => categoryName(String(it.category)) },
  { key: "price", label: "Price", render: (it) => formatMoney(Number(it.price), String(it.currency || "INR")) },
  { key: "badge", label: "Badge" },
  {
    key: "status",
    label: "Status",
    render: (it) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
          it.status === "DRAFT" ? "bg-navy-700/10 text-navy-700/60" : "bg-emerald-50 text-emerald-700"
        }`}
      >
        {String(it.status || "PUBLISHED")}
      </span>
    ),
  },
  { key: "featured", label: "Featured", render: (it) => (it.featured ? "Yes" : "No") },
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
