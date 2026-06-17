import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge, Button } from "@/components/ui";
import { getCurrentUser, type SafeUser } from "@/lib/auth";
import { getEnrollmentsByUser, type Enrollment } from "@/lib/accounts";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Your courses, programs and access status.",
};

const statusStyles: Record<string, { label: string; cls: string }> = {
  pending: { label: "Awaiting approval", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  approved: { label: "Access granted", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  rejected: { label: "Not approved", cls: "bg-red-50 text-red-600 border border-red-200" },
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const enrollments = await getEnrollmentsByUser(user.id);

  return user.accountType === "college" ? (
    <CollegeDashboard user={user} enrollments={enrollments} />
  ) : (
    <StudentDashboard user={user} enrollments={enrollments} />
  );
}

/* ============================ STUDENT ============================ */
/* Light, brand-coloured, focused on "my courses". */
function StudentDashboard({ user, enrollments }: { user: SafeUser; enrollments: Enrollment[] }) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-navy-700/8 bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-brand-400/20 blur-[120px]" />
        </div>
        <div className="container-x relative flex flex-wrap items-center justify-between gap-4 py-12">
          <div>
            <Badge tone="brand">Student account</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
              Welcome, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-2 text-navy-700/70">Your reserved courses and access status.</p>
          </div>
          <LogoutButton />
        </div>
      </section>

      <section className="py-12">
        <div className="container-x">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-navy-800">My courses</h2>
            <Button href="/courses" variant="outline">Browse courses →</Button>
          </div>
          <EnrollmentList enrollments={enrollments} emptyCta="/courses" />

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <QuickCard href="/projects" icon="🧰" title="Project kits" desc="Ready-made & custom" />
            <QuickCard href="/courses" icon="🎥" title="Online classes" desc="Live & self-paced" />
            <QuickCard href="/internships" icon="🎓" title="Internships" desc="Apply & track" />
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================ COLLEGE ============================ */
/* Dark institutional theme, focused on programs colleges book. */
function CollegeDashboard({ user, enrollments }: { user: SafeUser; enrollments: Enrollment[] }) {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-x relative flex flex-wrap items-center justify-between gap-4 py-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-accent/15 px-3 py-1 text-xs font-bold text-cyan-accent">
              🏫 College / Institution
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {user.college || user.name}
            </h1>
            <p className="mt-2 text-brand-100/70">
              Programs for your campus — workshops, online classes and internships.
            </p>
          </div>
          <LogoutButton />
        </div>
      </section>

      {/* Program cards — what colleges get */}
      <section className="py-12">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <ProgramCard
            href="/workshops"
            icon="🛠"
            title="Workshops & FDPs"
            desc="Bootcamps, faculty development programs and on-campus training."
            cta="Book a workshop"
          />
          <ProgramCard
            href="/internships"
            icon="🎓"
            title="Internships"
            desc="Industry internships with real deliverables for your students."
            cta="Explore internships"
          />
        </div>
      </section>

      {/* Bookings */}
      <section className="pb-16">
        <div className="container-x">
          <h2 className="text-xl font-extrabold text-navy-800">Our bookings</h2>
          <EnrollmentList enrollments={enrollments} emptyCta="/workshops" />
        </div>
      </section>
    </>
  );
}

/* ============================ shared bits ============================ */
function EnrollmentList({ enrollments, emptyCta }: { enrollments: Enrollment[]; emptyCta: string }) {
  if (enrollments.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-navy-700/15 bg-brand-50/30 p-10 text-center">
        <div className="text-3xl">📋</div>
        <h3 className="mt-3 font-bold text-navy-800">Nothing reserved yet</h3>
        <p className="mt-1 text-sm text-navy-700/60">
          Pick a program and reserve — we&apos;ll confirm access shortly after.
        </p>
        <Button href={emptyCta} className="mt-5">Explore →</Button>
      </div>
    );
  }
  return (
    <div className="mt-6 grid gap-4">
      {enrollments.map((e) => {
        const s = statusStyles[e.status] ?? statusStyles.pending;
        return (
          <div
            key={e.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-700/8 bg-white p-5 shadow-card"
          >
            <div>
              <div className="font-bold text-navy-800">{e.courseTitle}</div>
              <div className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>
                {s.label}
              </div>
            </div>
            {e.status === "approved" ? (
              <Link
                href={`/learn/${e.courseSlug}`}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                Open →
              </Link>
            ) : (
              <span className="text-xs text-navy-700/45">
                {e.status === "pending" ? "We'll confirm access soon" : "Contact support"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuickCard({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-navy-700/8 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
    >
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-bold text-navy-800">{title}</div>
      <div className="text-sm text-navy-700/55">{desc}</div>
    </Link>
  );
}

function ProgramCard({
  href,
  icon,
  title,
  desc,
  cta,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">{icon}</div>
      <h3 className="mt-4 text-lg font-extrabold text-navy-800">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-navy-700/60">{desc}</p>
      <Link href={href} className="mt-4 text-sm font-bold text-brand-600 hover:underline">
        {cta} →
      </Link>
    </div>
  );
}
