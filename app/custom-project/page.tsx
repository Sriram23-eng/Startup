import type { Metadata } from "next";
import CustomProjectForm, { StatusFlow } from "@/components/CustomProjectForm";
import { Badge } from "@/components/ui";
import { categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Request a Custom Project",
  description:
    "Submit your IoT, embedded, LoRa, AI/ML or robotics project requirement and get a transparent quotation within 24–48 hours.",
};

export default function CustomProjectPage() {
  return (
    <section className="relative">
      <div className="mesh pointer-events-none absolute inset-x-0 top-0 h-72 opacity-70" />
      <div className="container-x relative grid gap-10 py-14 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left — pitch + flow */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Badge tone="cyan">Dedicated / Custom Projects</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
            Tell us what to build.{" "}
            <br />
            <span className="text-gradient">We’ll quote it.</span>
          </h1>
          <p className="mt-4 text-navy-700/70">
            From a final-year project to a production-ready industrial system —
            share your requirement and our engineers respond with a transparent,
            milestone-based proposal.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c.slug}
                className="rounded-full border border-navy-700/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-navy-700/70 backdrop-blur"
              >
                {c.icon} {c.name}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-navy-700/8 bg-white p-6 shadow-card">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy-700/50">
              How it works
            </h3>
            <StatusFlow active={-1} />
          </div>
        </div>

        {/* Right — form */}
        <div>
          <CustomProjectForm />
        </div>
      </div>
    </section>
  );
}
