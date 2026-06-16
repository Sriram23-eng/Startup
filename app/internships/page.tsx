import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Button, SectionHeading } from "@/components/ui";
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
      <section className="relative overflow-hidden border-b border-navy-700/8">
        <div className="mesh pointer-events-none absolute inset-0 opacity-70" />
        <div className="container-x relative grid gap-10 py-16 lg:grid-cols-[1fr_420px]">
          <div>
            <Badge tone="cyan">Student Internship Portal</Badge>
            <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-navy-800 sm:text-5xl">
              Build real engineering proof, not just a certificate.
            </h1>
            <p className="mt-4 max-w-2xl text-navy-700/70">
              Students work on guided IoT, embedded, AI and robotics projects
              with milestone reviews, downloadable offer letters and online
              certificate verification.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="#apply" size="lg">
                Apply now
              </Button>
              <Button href="/learn#verify" variant="outline" size="lg">
                Verify certificate
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-glow backdrop-blur">
            <div className="rounded-xl bg-navy-900 p-5 text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-accent">
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
                    <span className="text-sm font-semibold">{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Tracks"
            title="Pick a domain and ship a portfolio project"
            subtitle="Each internship includes task sheets, code reviews, final demo submission and certificate workflow."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <div
                key={track}
                className="rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card"
              >
                <div className="text-sm font-bold text-brand-600">4-8 weeks</div>
                <h3 className="mt-2 font-bold text-navy-800">{track}</h3>
                <p className="mt-2 text-sm text-navy-700/60">
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
              subtitle="This frontend stores the enquiry through the lead API. Connect it to CRM, email and certificate generation next."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.slice(0, 8).map((category) => (
                <span
                  key={category.slug}
                  className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-navy-700/70"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
          <form className="rounded-2xl border border-navy-700/8 bg-brand-50/30 p-6 shadow-card sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {["Full name", "Email", "Phone", "College"].map((label) => (
                <label key={label} className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-navy-800">
                    {label}
                  </span>
                  <input className="w-full rounded-xl border border-navy-700/12 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">
                  Preferred domain
                </span>
                <select className="w-full rounded-xl border border-navy-700/12 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
                  {categories.map((category) => (
                    <option key={category.slug}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">
                  Skills / project interest
                </span>
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-xl border border-navy-700/12 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </label>
            </div>
            <Button className="mt-6 w-full" size="lg">
              Submit application
            </Button>
            <p className="mt-3 text-center text-xs text-navy-700/45">
              Backend submission can be wired to /api/leads.
            </p>
          </form>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x rounded-2xl bg-navy-900 p-8 text-white md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold">Student dashboard ready</h2>
              <p className="mt-2 max-w-2xl text-brand-100/70">
                Purchased projects, downloads, internship status, offer letters
                and certificate downloads are designed as next backend modules.
              </p>
            </div>
            <Button href="/dashboard" variant="white">
              Preview dashboard
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
