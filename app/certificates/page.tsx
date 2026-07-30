import type { Metadata } from "next";
import { Badge } from "@/components/ui";
import { IconShield, IconBolt, IconSignal } from "@/components/icons";
import CertVerify from "@/components/CertVerify";

export const metadata: Metadata = {
  title: "Certificate Verification",
  description:
    "Verify the authenticity of a certificate issued by MS Project & Tech Solution using its certificate ID.",
};

export default function CertificatesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-drift absolute -left-16 -top-20 h-80 w-80 rounded-full bg-brand-400/20 blur-[130px]" />
          <div className="animate-drift absolute right-0 -top-16 h-72 w-72 rounded-full bg-cyan-accent/16 blur-[130px] [animation-delay:-7s]" />
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_10%,black,transparent)]" />
        </div>
        <div className="container-x relative py-16 text-center">
          <div className="animate-rise">
            <Badge tone="brand">Certificate Verification</Badge>
            <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-black leading-[1.06] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
              Verify a certificate in{" "}
              <span className="text-gradient">seconds</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-600">
              Enter the certificate ID printed on any certificate we issue to
              confirm the holder, program and issue date.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-x mx-auto max-w-3xl">
          <CertVerify />

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { Icon: IconShield, title: "Tamper-proof", desc: "Each certificate maps to a unique, immutable record." },
              { Icon: IconBolt, title: "Instant", desc: "Verification is real-time — no waiting or emails." },
              { Icon: IconSignal, title: "Shareable", desc: "Recruiters & colleges can verify from anywhere." },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-3xl border border-line bg-white p-6 shadow-card lift hover:border-brand-200 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-4 font-black tracking-tight text-ink-900">{title}</div>
                <div className="mt-1 text-sm leading-relaxed text-ink-600">{desc}</div>
              </div>
            ))}
          </div>

          <div className="relative mt-8 overflow-hidden rounded-2xl bg-navy-800 p-6 text-center text-sm text-brand-100/80">
            <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
            <p className="relative">
              Earned your certificate through a course or internship?{" "}
              <span className="font-semibold text-cyan-accent">
                Download it from your dashboard.
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
