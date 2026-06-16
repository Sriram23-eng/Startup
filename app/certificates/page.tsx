import type { Metadata } from "next";
import { Badge } from "@/components/ui";
import CertVerify from "@/components/CertVerify";

export const metadata: Metadata = {
  title: "Certificate Verification",
  description:
    "Verify the authenticity of a certificate issued by MS Project & Tech Solution using its certificate ID.",
};

export default function CertificatesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-navy-700/8 bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-20 h-80 w-80 rounded-full bg-brand-400/20 blur-[130px]" />
        </div>
        <div className="container-x relative py-14 text-center">
          <Badge tone="brand">Certificate Verification</Badge>
          <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
            Verify a certificate in seconds
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-navy-700/70">
            Enter the certificate ID printed on any certificate we issue to
            confirm the holder, program and issue date.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-x mx-auto max-w-3xl">
          <CertVerify />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["🔒", "Tamper-proof", "Each certificate maps to a unique, immutable record."],
              ["⚡", "Instant", "Verification is real-time — no waiting or emails."],
              ["🌐", "Shareable", "Recruiters & colleges can verify from anywhere."],
            ].map(([i, t, d]) => (
              <div
                key={t}
                className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card"
              >
                <div className="text-2xl">{i}</div>
                <div className="mt-3 font-bold text-navy-800">{t}</div>
                <div className="mt-1 text-sm text-navy-700/60">{d}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-navy-800 p-6 text-center text-sm text-brand-100/75">
            Earned your certificate through a course or internship?{" "}
            <span className="font-semibold text-cyan-accent">
              Download it from your dashboard.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
