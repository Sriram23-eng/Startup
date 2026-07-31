import type { Metadata } from "next";
import { Badge, SectionHeading } from "@/components/ui";
import CostCalculator from "@/components/CostCalculator";
import CertVerify from "@/components/CertVerify";

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
              subtitle="Enter the certificate ID printed on any certificate we issue to confirm the holder, program and issue date."
            />
          </div>
          <CertVerify />
        </div>
      </section>
    </>
  );
}
