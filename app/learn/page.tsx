import type { Metadata } from "next";
import { Badge, Button, SectionHeading } from "@/components/ui";
import CostCalculator from "@/components/CostCalculator";

export const metadata: Metadata = {
  title: "Learning Center",
  description:
    "Tutorials, documentation, video courses, project builder and certificate verification for the IoT platform.",
};

const resources = [
  ["Tutorials", "Step-by-step ESP32, Arduino, LoRa and Raspberry Pi guides."],
  ["Documentation", "Kit setup PDFs, wiring references and source-code notes."],
  ["Video courses", "Structured training videos for workshops and internships."],
  ["Blogs", "Project ideas, component comparisons and deployment stories."],
];

export default function LearnPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-navy-700/8">
        <div className="mesh pointer-events-none absolute inset-0 opacity-70" />
        <div className="container-x relative py-16">
          <Badge tone="cyan">Learning Center</Badge>
          <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-navy-800 sm:text-5xl">
            Learn the stack behind every project kit.
          </h1>
          <p className="mt-4 max-w-2xl text-navy-700/70">
            Tutorials, documentation, project demo videos, cost estimation and
            certificate verification in one place.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Resources"
            title="A practical library for builders"
            subtitle="Designed for students, faculty and teams who need clear implementation references."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card"
              >
                <h3 className="font-bold text-navy-800">{title}</h3>
                <p className="mt-2 text-sm text-navy-700/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Project builder"
            title="Estimate a custom project before requesting a quote"
            subtitle="Select controller, sensors and communication method to generate a practical starting estimate."
          />
          <div className="mt-8">
            <CostCalculator />
          </div>
        </div>
      </section>

      <section id="verify" className="py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Certificate verification"
              title="Verify certificates online"
              subtitle="Enter a certificate ID to confirm student, program and issue status. This is UI-ready; connect to the certificates table next."
            />
          </div>
          <div className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card sm:p-8">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-navy-800">
                Certificate ID
              </span>
              <input
                placeholder="INV-CERT-2026-001"
                className="w-full rounded-xl border border-navy-700/12 bg-brand-50/30 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <Button className="mt-4 w-full" size="lg">
              Verify certificate
            </Button>
            <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              Demo state: certificate verification service is ready for database
              integration.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
