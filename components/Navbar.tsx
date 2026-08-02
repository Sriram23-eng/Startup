"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { navForAccountType } from "@/lib/site";
import { Button } from "./ui";
import { Logo } from "./Logo";

/**
 * The session arrives as props from the root layout — see the note there for
 * why this component must not fetch it itself.
 */
export default function Navbar({
  signedIn = false,
  accountType,
}: {
  signedIn?: boolean;
  accountType?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = navForAccountType(accountType);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-white/85 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Logo markClassName="h-9 w-9 text-brand-600" />

        <div className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold text-ink-700 transition group-hover:bg-brand-50 group-hover:text-brand-700"
                >
                  {item.label}
                  <span className="text-[10px] opacity-60 transition group-hover:rotate-180">
                    ▾
                  </span>
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-glow">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="flex flex-col rounded-xl px-3 py-2.5 transition hover:bg-brand-50"
                      >
                        <span className="text-sm font-semibold text-ink-900">
                          {c.label}
                        </span>
                        {c.desc && (
                          <span className="text-xs text-ink-400">
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
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {signedIn ? (
            <Button href="/dashboard" size="sm">
              My account
            </Button>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button href="/courses" size="sm">
                Join a class
              </Button>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line-strong bg-white lg:hidden"
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
        <div className="border-t border-line bg-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-bold text-ink-900 hover:bg-brand-50"
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
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-brand-50"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-2 flex gap-2">
              {signedIn ? (
                <Button href="/dashboard" size="sm" className="flex-1">
                  My account
                </Button>
              ) : (
                <>
                  <Button href="/login" variant="outline" size="sm" className="flex-1">
                    Login
                  </Button>
                  <Button href="/courses" size="sm" className="flex-1">
                    Join a class
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
