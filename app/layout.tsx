import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import ChromeGate from "@/components/ChromeGate";
import { site } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth";

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

/**
 * The menu differs per account type, so the session is read here on the server
 * and handed to the navbar as props. Resolving it in the navbar's own effect
 * instead would leave it stale: the navbar lives in this layout, so a
 * client-side navigation (signing in, signing out) never remounts it and the
 * effect never runs a second time.
 *
 * Reading the cookie makes every route render dynamically. That is required,
 * not incidental — a prerendered page would bake one visitor's menu into a
 * cached response and serve it to everyone, the same rule the price gate in
 * `lib/pricing.ts` follows.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen antialiased">
        <ChromeGate
          header={<Navbar signedIn={Boolean(user)} accountType={user?.accountType} />}
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
