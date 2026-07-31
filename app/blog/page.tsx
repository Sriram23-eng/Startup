import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog & Tutorials",
  description:
    "Practical IoT, embedded, AI and hardware tutorials, comparisons and deployment stories from the Elektron Nexus lab.",
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <section className="relative overflow-hidden border-b border-navy-700/8 bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-24 h-96 w-96 rounded-full bg-brand-400/20 blur-[130px]" />
        </div>
        <div className="container-x relative py-14">
          <Badge tone="brand">Blog & Tutorials</Badge>
          <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
            Field notes from the lab
          </h1>
          <p className="mt-3 max-w-2xl text-navy-700/70">
            Hard-won, practical guides on IoT, embedded systems, connectivity and
            AI — written by engineers who ship.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-x">
          {/* Featured */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-navy-700/8 bg-white shadow-card transition hover:shadow-glow md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] md:aspect-auto">
              <Image
                src={featured.cover}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-600">
                <span>{featured.category}</span>
                <span className="text-navy-700/25">•</span>
                <span className="text-navy-700/45">{featured.readTime} read</span>
              </div>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-navy-800 group-hover:text-brand-700">
                {featured.title}
              </h2>
              <p className="mt-3 text-navy-700/65">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-3 text-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {featured.author[0]}
                </span>
                <div>
                  <div className="font-semibold text-navy-800">
                    {featured.author}
                  </div>
                  <div className="text-xs text-navy-700/45">{featured.date}</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ "--i": i % 3 } as CSSProperties}
                className="seq group flex flex-col overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy-800 shadow">
                    {post.emoji} {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-bold leading-snug text-navy-800 group-hover:text-brand-700">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-navy-700/60">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-navy-700/8 pt-3 text-xs text-navy-700/45">
                    <span>{post.author}</span>
                    <span>
                      {post.date} · {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
