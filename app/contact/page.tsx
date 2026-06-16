import type { Metadata } from "next";
import { Badge } from "@/components/ui";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MS Project & Tech Solution for kits, custom projects, workshops, courses and internships.",
};

export default function ContactPage() {
  const channels = [
    { icon: "✉️", label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: "📞", label: "Phone", value: site.phone, href: `tel:${site.phone}` },
    {
      icon: "🟢",
      label: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${site.whatsapp.replace("+", "")}`,
    },
    { icon: "📍", label: "Location", value: site.city, href: "#" },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-navy-700/8 bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-20 h-80 w-80 rounded-full bg-brand-400/20 blur-[130px]" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-accent/20 blur-[130px]" />
        </div>
        <div className="container-x relative py-14">
          <Badge tone="cyan">Contact</Badge>
          <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
            Let’s talk about your project
          </h1>
          <p className="mt-3 max-w-2xl text-navy-700/70">
            Questions about a kit, a custom build, a workshop or a course? Reach
            out — a real engineer will reply.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Channels */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-center gap-4 rounded-2xl border border-navy-700/8 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl">
                    {c.icon}
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-navy-700/45">
                      {c.label}
                    </div>
                    <div className="font-bold text-navy-800">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-navy-700/8 bg-white shadow-card">
              <div className="grid-dots grid h-44 place-items-center bg-brand-50/40 text-sm font-medium text-navy-700/50">
                🗺️ Map embed goes here
              </div>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
