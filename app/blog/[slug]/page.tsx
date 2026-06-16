import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogPosts, getPost } from "@/lib/data";
import { Button } from "@/components/ui";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      <div className="container-x pt-8 text-sm text-navy-700/50">
        <Link href="/blog" className="hover:text-brand-600">
          ← Back to blog
        </Link>
      </div>

      <header className="container-x max-w-3xl pt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-brand-600">
          <span>{post.emoji} {post.category}</span>
          <span className="text-navy-700/25">•</span>
          <span className="text-navy-700/45">{post.readTime} read</span>
        </div>
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight text-navy-800 sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-5 flex items-center justify-center gap-3 text-sm">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
            {post.author[0]}
          </span>
          <span className="font-semibold text-navy-800">{post.author}</span>
          <span className="text-navy-700/35">·</span>
          <span className="text-navy-700/45">{post.date}</span>
        </div>
      </header>

      <div className="container-x mt-8">
        <div className="relative mx-auto aspect-[16/8] max-w-4xl overflow-hidden rounded-3xl border border-navy-700/8 shadow-card">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Body (placeholder prose) */}
      <div className="container-x mx-auto mt-12 max-w-2xl">
        <div className="space-y-5 text-[1.05rem] leading-relaxed text-navy-700/80">
          <p className="text-lg font-medium text-navy-800">{post.excerpt}</p>
          <p>
            This is a sample article body. In production, post content would be
            authored in MDX or pulled from a CMS (Sanity, Contentlayer) and
            rendered here with full rich-text styling, code blocks and images.
          </p>
          <h2 className="pt-4 text-2xl font-extrabold text-navy-800">
            Why it matters
          </h2>
          <p>
            Every guide we publish is grounded in real deployments — the same
            hardware and code that ships in our project kits. We focus on the
            decisions that actually affect cost, reliability and battery life.
          </p>
          <blockquote className="border-l-4 border-brand-500 bg-brand-50/50 py-3 pl-5 pr-4 text-navy-800">
            “Build it, measure it, then write about what surprised you.”
          </blockquote>
          <h2 className="pt-4 text-2xl font-extrabold text-navy-800">
            Putting it into practice
          </h2>
          <p>
            Want the working build behind this article? Grab the kit, download
            the source, or request a custom version tailored to your project.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 rounded-2xl bg-navy-800 p-6 text-white">
          <div className="flex-1">
            <div className="font-bold">Build this for real</div>
            <div className="text-sm text-brand-100/70">
              Get the kit, source code, or a custom quote.
            </div>
          </div>
          <Button href="/projects" variant="white">
            Browse kits
          </Button>
          <Button
            href="/custom-project"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:text-white"
          >
            Request custom
          </Button>
        </div>
      </div>

      {/* More posts */}
      <section className="bg-white py-16">
        <div className="container-x">
          <h2 className="text-2xl font-extrabold tracking-tight text-navy-800">
            More from the blog
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="text-2xl">{p.emoji}</div>
                <div className="mt-3 text-xs font-semibold text-brand-600">
                  {p.category}
                </div>
                <h3 className="mt-1 font-bold leading-snug text-navy-800 group-hover:text-brand-700">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
