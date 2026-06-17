import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge, Button } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getEnrollmentsByUser } from "@/lib/accounts";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Your reserved courses, access status and recorded classes.",
};

const statusStyles: Record<string, { label: string; cls: string }> = {
  pending: {
    label: "Awaiting approval",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  approved: {
    label: "Access granted",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  rejected: {
    label: "Not approved",
    cls: "bg-red-50 text-red-600 border border-red-200",
  },
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const enrollments = await getEnrollmentsByUser(user.id);

  return (
    <>
      <section className="relative overflow-hidden border-b border-navy-700/8">
        <div className="mesh pointer-events-none absolute inset-0 opacity-70" />
        <div className="container-x relative flex flex-wrap items-center justify-between gap-4 py-12">
          <div>
            <Badge tone="navy">My account</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
              Welcome, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-2 text-navy-700/70">
              Your reserved courses and access status.
            </p>
          </div>
          <LogoutButton />
        </div>
      </section>

      <section className="py-12">
        <div className="container-x">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-navy-800">My courses</h2>
            <Button href="/courses" variant="outline">
              Browse courses →
            </Button>
          </div>

          {enrollments.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-navy-700/15 bg-brand-50/30 p-10 text-center">
              <div className="text-3xl">🎓</div>
              <h3 className="mt-3 font-bold text-navy-800">
                You haven&apos;t reserved any course yet
              </h3>
              <p className="mt-1 text-sm text-navy-700/60">
                Pick a class and reserve your seat — we&apos;ll confirm your
                access shortly after.
              </p>
              <Button href="/courses" className="mt-5">
                Explore courses →
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {enrollments.map((e) => {
                const s = statusStyles[e.status] ?? statusStyles.pending;
                return (
                  <div
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-700/8 bg-white p-5 shadow-card"
                  >
                    <div>
                      <div className="font-bold text-navy-800">{e.courseTitle}</div>
                      <div
                        className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}
                      >
                        {s.label}
                      </div>
                    </div>
                    {e.status === "approved" ? (
                      <Link
                        href={`/learn/${e.courseSlug}`}
                        className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
                      >
                        Open course →
                      </Link>
                    ) : (
                      <span className="text-xs text-navy-700/45">
                        {e.status === "pending"
                          ? "We'll email you once access is approved"
                          : "Contact support for details"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
