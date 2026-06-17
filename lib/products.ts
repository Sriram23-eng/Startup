/* ------------------------------------------------------------------ */
/*  Digital product shop store (Prisma / Postgres). Edited via admin.  */
/* ------------------------------------------------------------------ */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "./prisma";
import { slugify, uniqueSlug } from "./store";

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split("\n").map((s) => s.trim()).filter(Boolean);
  return [];
}

/** Coerce admin form input into Product fields (slug handled separately). */
function coerceProduct(b: any): Record<string, any> {
  const o: any = {};
  const str = ["title", "tagline", "category", "badge", "currency", "status", "publishDate",
    "sku", "version", "license", "coverImage", "about", "specs", "checkoutUrl", "demoUrl",
    "metaTitle", "metaDescription", "ogImage"];
  for (const k of str) if (b[k] !== undefined) o[k] = b[k] == null ? "" : String(b[k]);
  if (b.price !== undefined) o.price = Number(b.price) || 0;
  if (b.originalPrice !== undefined)
    o.originalPrice =
      b.originalPrice === "" || b.originalPrice == null ? null : Number(b.originalPrice);
  if (b.order !== undefined) o.order = Number(b.order) || 0;
  if (b.featured !== undefined) o.featured = Boolean(b.featured);
  for (const k of ["gallery", "highlights", "included", "requirements"])
    if (b[k] !== undefined) o[k] = toArray(b[k]);
  if (o.specs !== undefined && !o.specs) o.specs = "[]";
  return o;
}

export async function listProducts() {
  return prisma.product.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
}

export async function getPublishedProducts() {
  return prisma.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function createProduct(body: any) {
  const existing = (await listProducts()).map((p) => p.slug);
  const base = slugify(body.slug || body.title || "product");
  const slug = uniqueSlug(base, existing);
  const data = { title: "Untitled product", ...coerceProduct(body), slug };
  return prisma.product.create({ data });
}

export async function updateProduct(slug: string, body: any) {
  const data = coerceProduct(body); // slug (id) stays fixed
  try {
    return await prisma.product.update({ where: { slug }, data });
  } catch {
    return null;
  }
}

export async function deleteProduct(slug: string) {
  await prisma.product.delete({ where: { slug } }).catch(() => {});
}

/** Parse the specs JSON string into [{label,value}] (safe). */
export function parseSpecs(specs: string): { label: string; value: string }[] {
  try {
    const arr = JSON.parse(specs || "[]");
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.label === "string")
      .map((x) => ({ label: String(x.label), value: String(x.value ?? "") }));
  } catch {
    return [];
  }
}
