import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui";
import { getPublishedProducts } from "@/lib/products";
import { formatMoney } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — Digital Products & Templates",
  description:
    "Production-ready templates, kits and source code for IoT, embedded and full-stack projects.",
};

const FALLBACK = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80";

export default async function ShopPage() {
  const products = await getPublishedProducts();

  return (
    <>
      <section className="border-b border-navy-700/8 bg-[#f7f9fd]">
        <div className="container-x py-14">
          <h1 className="text-4xl font-black tracking-tight text-navy-800 sm:text-5xl">
            The <span className="text-gradient">Shop</span>
          </h1>
          <p className="mt-3 max-w-xl text-lg text-navy-700/70">
            Production-ready templates, kits and source code — buy once, build
            faster.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-x">
          <SectionHeading eyebrow="All products" title="Browse the catalogue" />

          {products.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-navy-700/15 bg-white p-12 text-center text-navy-700/55">
              No products published yet. Add one in Admin → Shop.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const off =
                  p.originalPrice && p.originalPrice > p.price
                    ? Math.round((1 - p.price / p.originalPrice) * 100)
                    : 0;
                return (
                  <Link
                    key={p.slug}
                    href={`/shop/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-glow"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.coverImage || FALLBACK}
                        alt={p.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                      {p.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-navy-800/90 px-2.5 py-1 text-[11px] font-bold text-cyan-accent">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {p.category && (
                        <span className="text-xs font-semibold text-brand-600">{p.category}</span>
                      )}
                      <h3 className="mt-1 font-bold leading-snug text-navy-800 group-hover:text-brand-700">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-navy-700/60">
                        {p.tagline}
                      </p>
                      <div className="mt-4 flex items-center gap-2 border-t border-navy-700/8 pt-3">
                        <span className="text-lg font-extrabold text-navy-800">
                          {p.price > 0 ? formatMoney(p.price, p.currency) : "Free"}
                        </span>
                        {off > 0 && (
                          <>
                            <span className="text-sm text-navy-700/40 line-through">
                              {formatMoney(p.originalPrice!, p.currency)}
                            </span>
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">
                              -{off}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
