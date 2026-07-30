export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  nav: NavItem[];
};

export const site: SiteConfig = {
  name: "Elektron Nexus",
  shortName: "EN",
  tagline: "Projects · Skills · Internships · Workshops",
  description:
    "Ready-made electronics and IoT project kits, custom engineering builds, hands-on workshops and internships, all in one platform.",
  email: "msprojects@techgamil.com",
  phone: "+91 90000 00000",
  whatsapp: "+919000000000",
  city: "Hyderabad, India",
  nav: [
    {
      label: "Projects",
      href: "/projects",
      children: [
        { label: "Ready-Made Kits", href: "/projects", desc: "Order complete project kits" },
        { label: "Custom Projects", href: "/custom-project", desc: "Get a build quoted" },
        { label: "Browse Categories", href: "/projects", desc: "IoT, AI, LoRa, robotics & more" },
        { label: "Project Builder", href: "/learn", desc: "Estimate cost in seconds" },
      ],
    },
    {
      label: "Workshops",
      href: "/workshops",
      children: [
        { label: "Online Workshops", href: "/workshops", desc: "Live, from anywhere" },
        { label: "Offline & Field", href: "/workshops", desc: "On-campus & on-site" },
        { label: "FDP & Bootcamps", href: "/workshops", desc: "Faculty & student programs" },
        { label: "Corporate Training", href: "/workshops", desc: "Upskill your team" },
      ],
    },
    { label: "Courses", href: "/courses" },
    { label: "Internships", href: "/internships" },
    {
      label: "Resources",
      href: "/blog",
      children: [
        { label: "Blog & Tutorials", href: "/blog", desc: "Guides from the lab" },
        { label: "Download Center", href: "/downloads", desc: "Source code, docs & datasheets" },
        { label: "Certificates", href: "/certificates", desc: "Verify a certificate" },
        { label: "Learning Center", href: "/learn", desc: "Tools & cost calculator" },
      ],
    },
  ],
};

/**
 * Menu shown for each account type:
 *  - college  → Workshops, Internships
 *  - student  → everything except Workshops
 *  - none (logged out) → full menu
 */
export function navForAccountType(accountType?: string | null): NavItem[] {
  if (accountType === "college") {
    const keep = ["Workshops", "Internships"];
    return site.nav.filter((i) => keep.includes(i.label));
  }
  if (accountType === "student") {
    return site.nav.filter((i) => i.label !== "Workshops");
  }
  return site.nav;
}

export type Money = number;

export const formatINR = (n: Money) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

/** Format a price with its currency symbol (shop products). */
export function formatMoney(amount: number, currency = "INR"): string {
  const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₹";
  return sym + Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
