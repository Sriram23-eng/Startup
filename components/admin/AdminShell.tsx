"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/projects", label: "Projects", icon: "🧰" },
  { href: "/admin/courses", label: "Courses", icon: "🎓" },
  { href: "/admin/modules", label: "Modules", icon: "📚" },
  { href: "/admin/topics", label: "Topics", icon: "📝" },
  { href: "/admin/enrollments", label: "Reservations", icon: "🎫" },
  { href: "/admin/users", label: "Users", icon: "👥" },
];

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="sticky top-0 z-30 flex h-auto flex-col border-b border-navy-700/8 bg-navy-900 text-white lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2.5 p-5">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <span className="text-[13px] font-black">MS</span>
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-accent" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold">MS Admin</div>
            <div className="text-[11px] text-brand-100/50">Control panel</div>
          </div>
        </div>

        <nav className="flex gap-1 px-3 lg:flex-col">
          {links.map((l) => {
            const active =
              l.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-white text-navy-900"
                    : "text-brand-100/70 hover:bg-white/10"
                }`}
              >
                <span>{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden p-3 lg:block">
          <Link
            href="/"
            className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-brand-100/60 hover:bg-white/10"
          >
            ← View site
          </Link>
          <button
            onClick={logout}
            className="mt-1 w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-red-300 hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-navy-700/8 bg-white/85 px-6 py-4 backdrop-blur-xl">
          <h1 className="text-lg font-extrabold text-navy-800">{title}</h1>
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-navy-700/70 hover:bg-brand-50"
            >
              View site
            </Link>
            <button
              onClick={logout}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              Log out
            </button>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
