import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getProjects, getCourses } from "@/lib/store";
import { formatINR } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, courses] = await Promise.all([getProjects(), getCourses()]);
  const liveCourses = courses.filter((c) => c.mode === "Live").length;
  const inventoryValue = projects.reduce((s, p) => s + p.price, 0);

  const cards = [
    { label: "Projects", value: projects.length, href: "/admin/projects", icon: "🧰" },
    { label: "Courses", value: courses.length, href: "/admin/courses", icon: "🎓" },
    { label: "Live cohorts", value: liveCourses, href: "/admin/courses", icon: "🔴" },
    { label: "Catalogue value", value: formatINR(inventoryValue), href: "/admin/projects", icon: "₹" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-navy-700/45">
                {c.label}
              </span>
              <span className="text-lg">{c.icon}</span>
            </div>
            <div className="mt-2 text-3xl font-black text-navy-800">
              {c.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <QuickPanel
          title="Manage Projects"
          desc="Add, edit or remove project kits. Changes appear instantly on /projects."
          href="/admin/projects"
          cta="Open projects"
        />
        <QuickPanel
          title="Manage Courses"
          desc="Add live cohorts or self-paced courses. Changes appear instantly on /courses."
          href="/admin/courses"
          cta="Open courses"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <strong>How it works:</strong> data is stored in <code>/data/*.json</code>{" "}
        (seeded from your existing catalogue). Edits here write to that store and
        the public pages read from it live. For Vercel/production, swap the store
        for Postgres + Prisma — the API contract stays identical.
      </div>
    </AdminShell>
  );
}

function QuickPanel({
  title,
  desc,
  href,
  cta,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
      <h3 className="font-bold text-navy-800">{title}</h3>
      <p className="mt-1.5 text-sm text-navy-700/60">{desc}</p>
      <Link
        href={href}
        className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
      >
        {cta} →
      </Link>
    </div>
  );
}
