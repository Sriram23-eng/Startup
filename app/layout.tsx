import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import ChromeGate from "@/components/ChromeGate";
import { site } from "@/lib/site";

// Geist over Inter — a more distinctive, engineering-flavoured sans, self-hosted
// by next/font (no render-blocking Google request). Exposed as --font-geist and
// wired into --font-sans in globals.css.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "IoT projects", "ESP32", "Arduino", "Raspberry Pi", "LoRa",
    "embedded systems", "robotics", "IoT kits", "engineering workshops",
    "internships", "final year projects",
  ],
  metadataBase: new URL("https://inventre.in"),
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen antialiased">
        <ChromeGate
          header={<Navbar />}
          footer={
            <>
              <FloatingChat />
              <Footer />
            </>
          }
        >
          {children}
        </ChromeGate>
      </body>
    </html>
  );
}
