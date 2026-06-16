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
      <section className="relative overflow-hidden border-b border-navy-700/8 bg-[#f7f9fd]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 -top-20 h-80 w-80 rounded-full bg-cyan-accent/20 blur-[130px]" />
        </div>
        <div className="container-x relative py-14">
          <Badge tone="cyan">Download Center</Badge>
          <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
            Source code, docs & datasheets
          </h1>
          <p className="mt-3 max-w-2xl text-navy-700/70">
            Grab firmware, setup guides, component datasheets and GitHub
            repositories. Free resources are open to all; project source unlocks
            with the matching kit.
          </p>
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
