"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { site } from "@/lib/site";
import { Button } from "./ui";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-navy-700/8 bg-white/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-brand-700 text-white shadow-glow">
            <span className="text-[13px] font-black tracking-tight text-white">
              MS
            </span>
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-accent" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold tracking-tight text-navy-800">
              MS Project{" "}
              <span className="text-brand-600">& Tech</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-navy-700/45">
              Solution
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          {site.nav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold text-navy-700/80 transition group-hover:bg-brand-50 group-hover:text-brand-700"
                >
                  {item.label}
                  <span className="text-[10px] opacity-60 transition group-hover:rotate-180">
                    ▾
                  </span>
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-navy-700/8 bg-white p-2 shadow-glow">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="flex flex-col rounded-xl px-3 py-2.5 transition hover:bg-brand-50"
                      >
                        <span className="text-sm font-semibold text-navy-800">
                          {c.label}
                        </span>
                        {c.desc && (
                          <span className="text-xs text-navy-700/50">
                            {c.desc}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-navy-700/80 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/login" variant="ghost" size="sm">
            Login
          </Button>
          <Button href="/courses" size="sm">
            Join a class
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-navy-700/10 bg-white lg:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-navy-800 transition ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-navy-800 transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-navy-800 transition ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy-700/8 bg-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {site.nav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-bold text-navy-800 hover:bg-brand-50"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-navy-700/10 pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-navy-700/70 hover:bg-brand-50"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-2 flex gap-2">
              <Button href="/login" variant="outline" size="sm" className="flex-1">
                Login
              </Button>
              <Button href="/courses" size="sm" className="flex-1">
                Join a class
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
