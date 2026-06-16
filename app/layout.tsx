import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import ChromeGate from "@/components/ChromeGate";
import { site } from "@/lib/site";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
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
