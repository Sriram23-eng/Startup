import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PageHero from "@/components/PageHero";
import { IconShield, IconBolt, IconSignal } from "@/components/icons";
import CertVerify from "@/components/CertVerify";

export const metadata: Metadata = {
  title: "Certificate Verification",
  description:
    "Verify the authenticity of a certificate issued by Elektron Nexus using its certificate ID.",
};

export default function CertificatesPage() {
  return (
    <>
      {/* The input sits with the instruction that explains it. Splitting them
          meant reading what to enter, then scrolling to a form to enter it —
          on a page whose whole purpose is that one action. */}
      <PageHero
        align="center"
        eyebrow="Certificate verification"
        title={
          <>
            Verify certificates{" "}
            <span className="text-gradient-light">online</span>
          </>
        }
        subtitle="Enter the certificate ID printed on any certificate we issue to confirm the holder, program and issue date."
        actions={
          /* Explicit width, not `w-full`: the centered hero column sizes to
             its content, so a percentage width collapses and truncates the
             placeholder. Note a JSX-style brace comment is invalid in a prop
             expression — it parses as an object literal. */
          <div className="w-[min(90vw,40rem)] text-left">
            <CertVerify />
          </div>
        }
      />

      <section className="py-14">
        <div className="container-x mx-auto max-w-3xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { Icon: IconShield, title: "Tamper-proof", desc: "Each certificate maps to a unique, immutable record." },
              { Icon: IconBolt, title: "Instant", desc: "Verification is real-time — no waiting or emails." },
              { Icon: IconSignal, title: "Shareable", desc: "Recruiters & colleges can verify from anywhere." },
            ].map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                style={{ "--i": i } as CSSProperties}
                className="seq group rounded-3xl border border-line bg-white p-6 shadow-card lift hover:border-brand-200 hover:shadow-lift"
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
