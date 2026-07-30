import Link from "next/link";
import { site } from "@/lib/site";
import { categories } from "@/lib/data";
import { LogoMark } from "./Logo";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-900 text-brand-100/70">
      <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
      <div className="container-x relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-10 w-10 text-brand-400" />
            <span className="text-lg font-extrabold text-white">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            {site.description}
          </p>
          <div className="mt-5 flex gap-3">
            {["in", "yt", "ig", "gh"].map((s) => (
              <span
                key={s}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-xs font-bold uppercase text-brand-100/80 ring-1 ring-white/10"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <FooterCol
          title="Projects"
          links={categories.slice(0, 6).map((c) => ({
            label: c.name,
            href: `/projects?cat=${c.slug}`,
          }))}
        />
        <FooterCol
          title="Explore"
          links={[
            { label: "Online Courses", href: "/courses" },
            { label: "Workshops", href: "/workshops" },
            { label: "Internships", href: "/internships" },
            { label: "Blog & Tutorials", href: "/blog" },
            { label: "Download Center", href: "/downloads" },
            { label: "Verify Certificate", href: "/certificates" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Custom Build", href: "/custom-project" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Login / Register", href: "/login" },
          ]}
        />
        <FooterCol
          title="Contact"
          links={[
            { label: site.email, href: `mailto:${site.email}` },
            { label: site.phone, href: `tel:${site.phone}` },
            { label: "WhatsApp", href: `https://wa.me/${site.whatsapp.replace("+", "")}` },
            { label: site.city, href: "#" },
          ]}
        />
      </div>

      <div className="container-x relative flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs sm:flex-row">
        <p>© {2026} {site.name}. All rights reserved.</p>
        <p className="text-brand-100/50">
          Built for engineers · IoT marketplace + training academy
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="transition hover:text-cyan-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
