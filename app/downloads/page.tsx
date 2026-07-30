import type { Metadata } from "next";
import { Badge } from "@/components/ui";
import DownloadsCenter from "@/components/DownloadsCenter";

export const metadata: Metadata = {
  title: "Download Center",
  description:
    "Source code, documentation, datasheets and GitHub repositories for IoT, embedded and AI projects.",
};

export default function DownloadsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-drift absolute -left-20 -top-24 h-80 w-80 rounded-full bg-brand-400/20 blur-[130px]" />
          <div className="animate-drift absolute right-0 -top-20 h-80 w-80 rounded-full bg-cyan-accent/18 blur-[130px] [animation-delay:-7s]" />
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_10%,black,transparent)]" />
        </div>
        <div className="container-x relative py-16">
          <div className="animate-rise">
            <Badge tone="cyan">Download Center</Badge>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.06] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
              Source code, docs &amp;{" "}
              <span className="text-gradient">datasheets</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-600">
              Grab firmware, setup guides, component datasheets and GitHub
              repositories. Free resources are open to all; project source unlocks
              with the matching kit.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-x">
          <DownloadsCenter />
        </div>
      </section>
    </>
  );
}
