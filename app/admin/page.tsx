import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getProjects, getCourses } from "@/lib/store";
import { countNewLeads } from "@/lib/leads";
import { formatINR } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, courses, newLeads] = await Promise.all([
    getProjects(),
    getCourses(),
    countNewLeads(),
  ]);
  const liveCourses = courses.filter((c) => c.mode === "Live").length;
  const inventoryValue = projects.reduce((s, p) => s + p.price, 0);

  const cards = [
    { label: "New enquiries", value: newLeads, href: "/admin/leads", icon: "📨" },
    { label: "Projects", value: projects.length, href: "/admin/projects", icon: "🧰" },
    { label: "Courses", value: courses.length, href: "/admin/courses", icon: "🎓" },
    { label: "Live cohorts", value: liveCourses, href: "/admin/courses", icon: "🔴" },
    { label: "Catalogue value", value: formatINR(inventoryValue), href: "/admin/projects", icon: "₹" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
          title="Enquiries"
          desc="Messages from the contact, workshop, internship and custom-project forms."
          href="/admin/leads"
          cta="Open enquiries"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <strong>How it works:</strong> when <code>DATABASE_URL</code> is set (as
        it is on Vercel) everything is stored in Postgres via Prisma. Locally,
        with no <code>DATABASE_URL</code>, the app falls back to JSON files in{" "}
        <code>/data</code> — handy for testing, but that fallback does not
        persist on Vercel. Edits here are live on the public pages immediately.
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
