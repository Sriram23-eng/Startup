import type { Metadata } from "next";
import { Badge } from "@/components/ui";
import { IconMail, IconPhone, IconPin } from "@/components/icons";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MS Project & Tech Solution for kits, custom projects, workshops, courses and internships.",
};

export default function ContactPage() {
  const channels = [
    { Icon: IconMail, label: "Email", value: site.email, href: `mailto:${site.email}`, accent: "text-brand-600 bg-brand-50" },
    { Icon: IconPhone, label: "Phone", value: site.phone, href: `tel:${site.phone}`, accent: "text-brand-600 bg-brand-50" },
    {
      Icon: IconPhone,
      label: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${site.whatsapp.replace("+", "")}`,
      accent: "text-emerald-600 bg-emerald-50",
    },
    { Icon: IconPin, label: "Location", value: site.city, href: "#", accent: "text-brand-600 bg-brand-50" },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-drift absolute -left-16 -top-20 h-80 w-80 rounded-full bg-brand-400/20 blur-[130px]" />
          <div className="animate-drift absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-accent/18 blur-[130px] [animation-delay:-7s]" />
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_10%,black,transparent)]" />
        </div>
        <div className="container-x relative py-16">
          <div className="animate-rise">
            <Badge tone="cyan">Contact</Badge>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.06] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
              Let’s talk about{" "}
              <span className="text-gradient">your project</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-600">
              Questions about a kit, a custom build, a workshop or a course? Reach
              out — a real engineer will reply.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Channels */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {channels.map(({ Icon, label, value, href, accent }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card lift hover:border-brand-200 hover:shadow-lift"
                >
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      {label}
                    </div>
                    <div className="font-bold text-ink-900">{value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="grid-dots grid h-44 place-items-center bg-brand-50/40 text-sm font-medium text-ink-400">
                <span className="inline-flex items-center gap-2">
                  <IconPin className="h-4 w-4" /> Map embed goes here
                </span>
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
