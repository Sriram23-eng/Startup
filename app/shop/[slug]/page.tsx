import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, parseSpecs } from "@/lib/products";
import { formatMoney } from "@/lib/site";

export const dynamic = "force-dynamic";

const FALLBACK = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.metaTitle || p.title,
    description: p.metaDescription || p.tagline,
    openGraph: p.ogImage ? { images: [p.ogImage] } : undefined,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p || p.status !== "PUBLISHED") notFound();

  const off =
    p.originalPrice && p.originalPrice > p.price
      ? Math.round((1 - p.price / p.originalPrice) * 100)
      : 0;
  const save = p.originalPrice && p.originalPrice > p.price ? p.originalPrice - p.price : 0;
  const specs = parseSpecs(p.specs);
  const gallery = p.gallery?.length ? p.gallery : [p.coverImage || FALLBACK];

  return (
    <>
      <div className="container-x pt-8 text-sm text-navy-700/50">
        <Link href="/shop" className="hover:text-brand-600">Shop</Link> /{" "}
        <span className="text-navy-700/80">{p.title}</span>
      </div>

      <section className="container-x grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Media */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-navy-700/8 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[0] || FALLBACK} alt={p.title} className="aspect-[16/10] w-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.slice(1, 7).map((g, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-navy-700/8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g} alt={`${p.title} ${i + 2}`} className="aspect-video w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchase panel */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          {p.badge && (
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              {p.badge}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-black tracking-tight text-navy-800">{p.title}</h1>
          {p.tagline && <p className="mt-3 text-navy-700/70">{p.tagline}</p>}

          {/* Price */}
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-black text-navy-800">
              {p.price > 0 ? formatMoney(p.price, p.currency) : "Free"}
            </span>
            {off > 0 && (
              <>
                <span className="text-lg text-navy-700/40 line-through">
                  {formatMoney(p.originalPrice!, p.currency)}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-bold text-emerald-600">
                  -{off}% off
                </span>
              </>
            )}
          </div>
          {save > 0 && (
            <div className="mt-1 text-sm font-semibold text-emerald-600">
              You save {formatMoney(save, p.currency)}
            </div>
          )}

          {/* Highlights */}
          {p.highlights?.length > 0 && (
            <ul className="mt-6 space-y-2.5">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-[11px] text-emerald-600">
                    ✓
                  </span>
                  <span className="text-navy-700/80">{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            {p.checkoutUrl ? (
              <a
                href={p.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                Buy now — {p.price > 0 ? formatMoney(p.price, p.currency) : "Free"}
              </a>
            ) : (
              <Link
                href="/contact"
                className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                Contact to buy
              </Link>
            )}
            {p.demoUrl && (
              <a
                href={p.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-navy-700/15 px-6 py-3 text-sm font-bold text-navy-800 transition hover:bg-brand-50"
              >
                Live demo
              </a>
            )}
          </div>

          {/* Mini meta */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {p.license && <MetaBox k="License" v={p.license} />}
            {p.version && <MetaBox k="Version" v={p.version} />}
          </div>
        </div>
      </section>

      {/* About */}
      {p.about && (
        <section className="container-x pb-10">
          <h2 className="text-xl font-extrabold text-navy-800">About this product</h2>
          <div className="mt-3 max-w-3xl whitespace-pre-wrap leading-relaxed text-navy-700/80">
            {p.about}
          </div>
        </section>
      )}

      <section className="container-x grid gap-6 pb-10 md:grid-cols-2">
        {/* What's included */}
        {p.included?.length > 0 && (
          <Card title="What's included">
            <ul className="space-y-2.5">
              {p.included.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-[11px] text-brand-700">
                    ✓
                  </span>
                  <span className="text-navy-700/80">{i}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Specifications */}
        {specs.length > 0 && (
          <Card title="Specifications">
            <dl className="divide-y divide-navy-700/8">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 py-2 text-sm">
                  <dt className="font-semibold text-navy-700/60">{s.label}</dt>
                  <dd className="text-right text-navy-800">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        )}
      </section>

      {/* System requirements */}
      {p.requirements?.length > 0 && (
        <section className="container-x pb-16">
          <Card title="System requirements">
            <ul className="grid gap-2 sm:grid-cols-2">
              {p.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-navy-700/75">
                  <span className="text-brand-500">•</span> {r}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </>
  );
}

function MetaBox({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-navy-700/8 bg-brand-50/40 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-navy-700/45">{k}</div>
      <div className="mt-0.5 font-semibold text-navy-800">{v}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-lg font-bold text-navy-800">{title}</h3>
      {children}
    </div>
  );
}
