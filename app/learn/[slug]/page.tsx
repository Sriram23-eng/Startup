import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getEnrollment } from "@/lib/accounts";
import { getCourseBySlug } from "@/lib/store";
import { getCourseOutline, getTopicForCourse, getFirstTopicId } from "@/lib/content";

export const dynamic = "force-dynamic";

const BANDS = ["Beginner", "Intermediate", "Advanced", "Projects"];
const kindIcon: Record<string, string> = { topic: "📄", practical: "🧪", project: "🛠" };

export default async function LearnCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/learn/${slug}`);

  const course = await getCourseBySlug(slug);
  if (!course) redirect("/dashboard");

  const enrollment = await getEnrollment(user.id, slug);
  const approved = enrollment?.status === "approved";

  // Access gate — only approved students see the content.
  if (!approved) {
    return (
      <section className="container-x grid min-h-[70vh] place-items-center py-16">
        <div className="max-w-md rounded-3xl border border-navy-700/8 bg-white p-10 text-center shadow-card">
          <div className="text-4xl">🔒</div>
          <h1 className="mt-4 text-2xl font-extrabold text-navy-800">{course.title}</h1>
          <p className="mt-3 text-navy-700/65">
            {enrollment
              ? "Your reservation is awaiting approval. You'll get access here as soon as it's confirmed."
              : "You haven't reserved a seat for this course yet."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button href="/dashboard" variant="outline">
              My dashboard
            </Button>
            {!enrollment && <Button href="/courses">Reserve a seat →</Button>}
          </div>
        </div>
      </section>
    );
  }

  const outline = await getCourseOutline(slug);
  const activeId = (typeof sp.t === "string" && sp.t) || (await getFirstTopicId(slug));
  const topic = activeId ? await getTopicForCourse(slug, activeId) : null;

  if (outline.length === 0) {
    return (
      <section className="container-x grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <div className="text-4xl">📚</div>
          <h1 className="mt-4 text-2xl font-extrabold text-navy-800">{course.title}</h1>
          <p className="mt-2 text-navy-700/60">
            Course content is being added. Please check back soon.
          </p>
        </div>
      </section>
    );
  }

  // Group modules by band (in band order).
  const byBand = BANDS.map((band) => ({
    band,
    modules: outline.filter((m) => m.band === band),
  })).filter((g) => g.modules.length > 0);

  return (
    <div className="container-x grid gap-8 py-10 lg:grid-cols-[300px_1fr]">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
        <Link href="/dashboard" className="text-sm text-navy-700/55 hover:text-brand-700">
          ← My dashboard
        </Link>
        <h2 className="mt-2 text-lg font-extrabold text-navy-800">{course.title}</h2>

        <nav className="mt-4 space-y-5">
          {byBand.map((group) => (
            <div key={group.band}>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">
                {group.band}
              </div>
              <div className="space-y-1.5">
                {group.modules.map((m) => {
                  const hasActive = m.topics.some((t) => t.id === activeId);
                  return (
                    <details
                      key={m.id}
                      open={hasActive}
                      className="rounded-xl border border-navy-700/8 bg-white"
                    >
                      <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-navy-800">
                        {m.title}
                      </summary>
                      <ul className="px-2 pb-2">
                        {m.topics.map((t) => {
                          const active = t.id === activeId;
                          return (
                            <li key={t.id}>
                              <Link
                                href={`/learn/${slug}?t=${t.id}`}
                                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition ${
                                  active
                                    ? "bg-brand-600 text-white"
                                    : "text-navy-700/75 hover:bg-brand-50"
                                }`}
                              >
                                <span>{kindIcon[t.kind] ?? "📄"}</span>
                                <span className="truncate">{t.title}</span>
                              </Link>
                            </li>
                          );
                        })}
                        {m.topics.length === 0 && (
                          <li className="px-2.5 py-1.5 text-xs text-navy-700/40">
                            No topics yet
                          </li>
                        )}
                      </ul>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Topic content */}
      <main className="min-w-0">
        {topic ? <TopicView topic={topic} /> : <PickPrompt />}
      </main>
    </div>
  );
}

function PickPrompt() {
  return (
    <div className="rounded-2xl border border-dashed border-navy-700/15 bg-brand-50/30 p-10 text-center text-navy-700/60">
      Select a topic from the left to start learning.
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function TopicView({ topic }: { topic: any }) {
  return (
    <article>
      <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
        {topic.kind === "practical"
          ? "🧪 Practical"
          : topic.kind === "project"
          ? "🛠 Project"
          : "📄 Topic"}
      </span>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-navy-800">
        {topic.title}
      </h1>

      {topic.theory && (
        <Section n={1} title="Theory">
          <Prose text={topic.theory} />
        </Section>
      )}

      {topic.diagramUrl && (
        <Section n={2} title="Diagram">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={topic.diagramUrl} alt="Diagram" className="rounded-xl border border-navy-700/10" />
        </Section>
      )}

      {topic.components && (
        <Section n={3} title="Components required">
          <Prose text={topic.components} />
        </Section>
      )}

      {topic.exampleCode && (
        <Section n={4} title="Example code">
          <pre className="overflow-x-auto rounded-xl bg-navy-900 p-4 text-sm text-brand-100">
            <code>{topic.exampleCode}</code>
          </pre>
          {topic.codeExplanation && (
            <div className="mt-3">
              <div className="text-sm font-bold text-navy-800">Explanation</div>
              <Prose text={topic.codeExplanation} />
            </div>
          )}
        </Section>
      )}

      {topic.outputImageUrl && (
        <Section n={5} title="Output">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={topic.outputImageUrl} alt="Output" className="rounded-xl border border-navy-700/10" />
        </Section>
      )}

      {topic.videoUrl && (
        <Section n={6} title="Video lesson">
          <VideoEmbed url={topic.videoUrl} />
        </Section>
      )}

      {topic.quiz && (
        <Section n={7} title="Quiz">
          <Prose text={topic.quiz} />
        </Section>
      )}

      {topic.exercise && (
        <Section n={8} title="Exercise">
          <Prose text={topic.exercise} />
        </Section>
      )}

      {topic.simulationUrl && (
        <Section n={9} title="Simulation">
          <a
            href={topic.simulationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            Open simulation (Wokwi / Proteus) →
          </a>
        </Section>
      )}

      {topic.miniProject && (
        <Section n={10} title="Mini project">
          <Prose text={topic.miniProject} />
        </Section>
      )}

      {topic.downloads && (
        <Section n={11} title="Downloads">
          <ul className="space-y-1.5">
            {String(topic.downloads)
              .split("\n")
              .map((l: string) => l.trim())
              .filter(Boolean)
              .map((link: string, i: number) => (
                <li key={i}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 underline break-all hover:text-brand-700"
                  >
                    ⬇ {link}
                  </a>
                </li>
              ))}
          </ul>
        </Section>
      )}
    </article>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 border-t border-navy-700/8 pt-6">
      <h2 className="text-lg font-extrabold text-navy-800">
        <span className="text-brand-600">{n}.</span> {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Prose({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-navy-700/85">
      {text}
    </div>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
  );
  if (yt) {
    return (
      <iframe
        className="aspect-video w-full rounded-xl"
        src={`https://www.youtube.com/embed/${yt[1]}`}
        title="Video lesson"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return <video controls className="w-full rounded-xl" src={url} />;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-600 underline hover:text-brand-700"
    >
      Watch video →
    </a>
  );
}
