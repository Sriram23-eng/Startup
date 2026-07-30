import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DownloadsCenter from "@/components/DownloadsCenter";

export const metadata: Metadata = {
  title: "Download Center",
  description:
    "Source code, documentation, datasheets and GitHub repositories for IoT, embedded and AI projects.",
};

export default function DownloadsPage() {
  return (
    <>
      <PageHero
        eyebrow="Download Center"
        title={
          <>
            Source code, docs &amp;{" "}
            <span className="text-gradient-light">datasheets</span>
          </>
        }
        subtitle="Grab firmware, setup guides, component datasheets and GitHub repositories. Free resources are open to all; project source unlocks with the matching kit."
      />

      <section className="py-12">
        <div className="container-x">
          <DownloadsCenter />
        </div>
      </section>
    </>
  );
}
