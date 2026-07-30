import type { Metadata } from "next";
import CustomProjectForm, { StatusFlow } from "@/components/CustomProjectForm";
import { Badge } from "@/components/ui";
import { CategoryIcon } from "@/components/icons";
import { categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Request a Custom Project",
  description:
    "Submit your IoT, embedded, LoRa, AI/ML or robotics project requirement and get a transparent quotation within 24–48 hours.",
};

export default function CustomProjectPage() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80">
        <div className="animate-drift absolute -left-16 -top-16 h-80 w-80 rounded-full bg-brand-400/18 blur-[130px]" />
        <div className="animate-drift absolute right-0 -top-8 h-72 w-72 rounded-full bg-cyan-accent/16 blur-[130px] [animation-delay:-7s]" />
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_0%,black,transparent)]" />
      </div>
      <div className="container-x relative grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left — pitch + flow */}
        <div className="animate-rise lg:sticky lg:top-20 lg:self-start">
          <Badge tone="cyan">Dedicated / Custom Projects</Badge>
          <h1 className="mt-5 text-4xl font-black leading-[1.06] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
            Tell us what to build.{" "}
            <span className="text-gradient">We’ll quote it.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-ink-600">
            From a final-year project to a production-ready industrial system —
            share your requirement and our engineers respond with a transparent,
            milestone-based proposal.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c.slug}
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink-700 backdrop-blur"
              >
                <CategoryIcon slug={c.slug} className="h-3.5 w-3.5 text-brand-600" />
                {c.name}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-400">
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
