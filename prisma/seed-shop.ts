/* ------------------------------------------------------------------ */
/*  Seeds one sample shop product. Run: npx tsx prisma/seed-shop.ts    */
/* ------------------------------------------------------------------ */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const specs = [
  { label: "Dashboard", value: "Next.js 15 + Tailwind CSS" },
  { label: "Backend", value: "Node.js + Fastify" },
  { label: "Protocol", value: "MQTT 3.1.1 + WebSocket" },
  { label: "Database", value: "PostgreSQL 16 via Prisma ORM" },
  { label: "Hardware support", value: "ESP32, Arduino Uno/Mega, Raspberry Pi 3/4/5" },
  { label: "Sensor types", value: "Temperature, Humidity, Pressure, GPS, Motion, Light" },
  { label: "Auth", value: "NextAuth v5 — email + Google OAuth" },
  { label: "Deployment", value: "Vercel (dashboard) + Railway (backend + DB)" },
  { label: "Format", value: "ZIP + Private GitHub repo access" },
  { label: "License", value: "Commercial use — unlimited projects" },
  { label: "Last updated", value: "June 2025" },
  { label: "Version", value: "v2.3" },
];

const product = {
  slug: "embedded-iot-dashboard-kit",
  title: "Embedded IoT Dashboard Kit",
  tagline: "From sensor to dashboard in under an hour — no firmware experience needed.",
  category: "Template",
  badge: "Bestseller",
  price: 8000,
  originalPrice: 10000,
  currency: "INR",
  status: "PUBLISHED",
  featured: true,
  order: 1,
  publishDate: "15-06-2026",
  sku: "MS-IOT-001",
  version: "v2.3 — 2025 Edition",
  license: "Commercial use — unlimited projects",
  coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  ],
  highlights: [
    "Plug-and-play with ESP32, Arduino and Raspberry Pi",
    "Real-time sensor data streamed via MQTT to a live dashboard",
    "Pre-built widgets — gauges, charts, alerts and maps",
    "REST API + WebSocket support included",
    "Multi-sensor support — temperature, humidity, GPS, motion and more",
    "Mobile-responsive dashboard works on any device",
    "One-click deploy to Vercel + Railway — fully cloud-hosted",
    "Full source code included — no black boxes",
  ],
  about: `The Embedded IoT Dashboard Kit is a production-ready template for engineers and makers who want to visualize real-world sensor data without building infrastructure from scratch.

Most IoT projects stall at the dashboard. You spend weeks setting up MQTT brokers, WebSocket servers, and charting libraries — before writing a single line of business logic. This kit eliminates all of that.

It ships with a fully working end-to-end stack: firmware examples for ESP32 and Arduino, a Node.js MQTT bridge, a PostgreSQL time-series store, and a polished Next.js dashboard with live-updating charts, threshold alerts, and device management.

Built by the MS Project & Tech Solution engineering team and used in production across smart factory, cold-chain monitoring, and environmental sensing deployments.`,
  included: [
    "Next.js 15 dashboard with real-time WebSocket updates",
    "MQTT broker integration (HiveMQ / Mosquitto compatible)",
    "Node.js sensor data ingestion service",
    "PostgreSQL time-series schema with Prisma",
    "Pre-built chart widgets (line, gauge, bar, heatmap)",
    "Device registry — register and manage multiple sensors",
    "Threshold alerting with email notifications via Resend",
    "REST API for reading and writing sensor data",
    "ESP32 Arduino firmware example (temperature + humidity)",
    "Raspberry Pi Python client example",
    "Docker Compose for local development",
    "Vercel + Railway deployment guide",
    "Environment variable setup guide",
  ],
  specs: JSON.stringify(specs),
  requirements: [
    "Node.js 18 or higher",
    "PostgreSQL 14 or higher",
    "An MQTT broker (HiveMQ Cloud free tier works)",
    "ESP32 or Arduino board (for hardware testing)",
    "Arduino IDE or PlatformIO",
    "A Vercel account (free tier)",
    "A Railway account (free tier)",
    "Basic knowledge of JavaScript / Next.js",
  ],
  checkoutUrl: "",
  demoUrl: "",
  metaTitle: "Embedded IoT Dashboard Kit — Sensor to Dashboard in 1 Hour",
  metaDescription:
    "Production-ready IoT dashboard template with MQTT, real-time charts, device management and ESP32 firmware. Deploy in under an hour.",
  ogImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
};

async function main() {
  await prisma.product.upsert({
    where: { slug: product.slug },
    create: product,
    update: product,
  });
  console.log(`✅ Seeded product "${product.title}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
