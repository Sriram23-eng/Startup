import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Button, SectionHeading } from "@/components/ui";
import PageHero from "@/components/PageHero";
import InternshipForm from "@/components/InternshipForm";
import { categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Apply for IoT, embedded, robotics, AI/ML and Raspberry Pi internships with tracked milestones and verifiable certificates.",
};

const tracks = [
  "IoT Product Development",
  "Embedded Firmware",
  "ESP32 Cloud Systems",
  "Robotics Prototyping",
  "Edge AI with Raspberry Pi",
  "Industrial Automation",
];

const stages = [
  "Apply",
  "Screening",
  "Offer letter",
  "Live project",
  "Review",
  "Certificate",
];

export default function InternshipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Student Internship Portal"
        title={
          <>
            Build real engineering proof, not just a{" "}
            <span className="text-gradient-light">certificate</span>.
          </>
        }
        subtitle="Students work on guided IoT, embedded, AI and robotics projects with milestone reviews, downloadable offer letters and online certificate verification."
        actions={
          <>
            <Button href="#apply" size="lg">
              Apply now
            </Button>
            <Button href="/learn#verify" variant="outline-light" size="lg">
              Verify certificate
            </Button>
          </>
        }
        aside={
          <div className="ring-gradient-dark ring-gradient rounded-3xl bg-white/[0.04] p-6 backdrop-blur">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-accent">
              Internship status
            </div>
            <div className="mt-4 space-y-3">
              {stages.map((stage, index) => (
                <div key={stage} className="flex items-center gap-3">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                      index < 3
                        ? "bg-cyan-accent text-navy-900"
                        : "bg-white/10 text-brand-100/50"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">{stage}</span>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Tracks"
            title="Pick a domain and ship a portfolio project"
            subtitle="Each internship includes task sheets, code reviews, final demo submission and certificate workflow."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track, i) => (
              <div
                key={track}
                style={{ "--i": i % 3 } as CSSProperties}
                className="seq group rounded-3xl border border-line bg-white p-6 shadow-card lift hover:border-brand-200 hover:shadow-lift"
              >
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">4–8 weeks</div>
                <h3 className="mt-2 text-lg font-black tracking-tight text-ink-900">{track}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Mentor-led project work with weekly reviews and final
                  documentation submission.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="bg-white py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="Apply"
              title="Internship application"
              subtitle="Tell us your track and we'll be in touch with next steps. You'll get a reference number to quote in any follow-up."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.slice(0, 8).map((category) => (
                <span
                  key={category.slug}
                  className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
          <InternshipForm />
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-white md:p-10">
            <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
            <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Student dashboard ready</h2>
                <p className="mt-2 max-w-2xl leading-relaxed text-brand-100/75">
                  Purchased projects, downloads, internship status, offer letters
                  and certificate downloads — all tracked in one place.
                </p>
              </div>
              <Button href="/dashboard" variant="white">
                Preview dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
