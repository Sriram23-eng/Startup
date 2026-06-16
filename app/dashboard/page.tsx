import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Dashboard Preview",
  description:
    "Student, trainer and admin dashboard preview for orders, requests, workshops, CRM and certificates.",
};

const metrics = [
  ["Total Orders", "1,284"],
  ["Project Requests", "86"],
  ["Workshop Requests", "34"],
  ["Revenue", "Rs 18.4L"],
  ["Leads", "412"],
  ["Customers", "2,908"],
];

const modules = [
  "Project management",
  "Inventory and pricing",
  "Workshop scheduling",
  "Trainer assignment",
  "CRM and quotations",
  "Support tickets",
  "Certificates",
  "Student downloads",
];

export default function DashboardPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-navy-700/8">
        <div className="mesh pointer-events-none absolute inset-0 opacity-70" />
        <div className="container-x relative py-14">
          <Badge tone="navy">Portal Preview</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
            Admin, student and trainer portals
          </h1>
          <p className="mt-3 max-w-2xl text-navy-700/70">
            A product-ready dashboard concept for orders, project requests,
            workshop operations, CRM follow-ups and certificate workflows.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-x grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-navy-700/8 bg-navy-900 p-4 text-white shadow-glow lg:sticky lg:top-20 lg:self-start">
            {["Overview", "Projects", "Workshops", "CRM", "Support", "Certificates"].map(
              (item, index) => (
                <Link
                  key={item}
                  href="#"
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                    index === 0
                      ? "bg-white text-navy-900"
                      : "text-brand-100/70 hover:bg-white/10"
                  }`}
                >
                  {item}
                </Link>
              )
            )}
          </aside>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {metrics.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-navy-700/40">
                    {label}
                  </div>
                  <div className="mt-2 text-3xl font-black text-navy-800">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
                <h2 className="font-bold text-navy-800">Sales pipeline</h2>
                <div className="mt-5 grid gap-3 md:grid-cols-5">
                  {["Lead", "Review", "Quote", "Approval", "Delivery"].map(
                    (stage, index) => (
                      <div
                        key={stage}
                        className="rounded-xl bg-brand-50/70 p-4 text-center"
                      >
                        <div className="text-xl font-black text-navy-800">
                          {[128, 64, 37, 22, 14][index]}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-navy-700/55">
                          {stage}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
                <h2 className="font-bold text-navy-800">Platform modules</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {modules.map((module) => (
                    <span
                      key={module}
                      className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-navy-700/70"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-navy-900 p-6 text-white">
              <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <h2 className="text-xl font-extrabold">
                    Backend integration map is ready
                  </h2>
                  <p className="mt-1 text-sm text-brand-100/65">
                    Wire this to users, projects, orders, payments, leads,
                    quotations, trainers, certificates, blogs and support
                    tickets.
                  </p>
                </div>
                <Button href="/custom-project" variant="white">
                  Request build
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
