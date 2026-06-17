/* ------------------------------------------------------------------ */
/*  Mock catalogue. Replace with a real DB / CMS later.                 */
/*  Shapes are intentionally close to a production schema.             */
/* ------------------------------------------------------------------ */

export type Size = "Small" | "Medium" | "Large";

export type Category = {
  slug: string;
  name: string;
  icon: string; // emoji used as lightweight glyph
  blurb: string;
};

export const categories: Category[] = [
  { slug: "iot", name: "IoT", icon: "📡", blurb: "Connected sensing & cloud dashboards" },
  { slug: "embedded", name: "Embedded", icon: "🔧", blurb: "Bare-metal firmware & PCB design" },
  { slug: "lora", name: "LoRa", icon: "🛰️", blurb: "Long-range, low-power mesh networks" },
  { slug: "ai-ml", name: "AI & ML", icon: "🧠", blurb: "On-device & cloud intelligence" },
  { slug: "robotics", name: "Robotics", icon: "🤖", blurb: "Motion, control & autonomy" },
  { slug: "raspberry-pi", name: "Raspberry Pi", icon: "🍓", blurb: "Linux SBC vision & edge compute" },
  { slug: "arduino", name: "Arduino", icon: "🔌", blurb: "Rapid prototyping classics" },
  { slug: "esp32", name: "ESP32", icon: "📶", blurb: "Wi-Fi + BLE smart nodes" },
  { slug: "industrial", name: "Industrial Automation", icon: "🏭", blurb: "PLC, SCADA & Modbus" },
  { slug: "agri", name: "Smart Agriculture", icon: "🌱", blurb: "Precision farming systems" },
  { slug: "smart-home", name: "Smart Home", icon: "🏠", blurb: "Automation & energy control" },
];

export const sizeBands: { size: Size; range: string; min: number; max: number }[] = [
  { size: "Small", range: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { size: "Medium", range: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
  { size: "Large", range: "₹15,000 – ₹50,000+", min: 15000, max: 60000 },
];

export type Project = {
  slug: string;
  title: string;
  category: string; // category slug
  size: Size;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  youtube?: string; // video id
  summary: string;
  features: string[];
  components: string[];
  readyMade: boolean;
  tags: string[];
  // Rich product fields
  badge?: string;
  originalPrice?: number | null;
  currency?: string;
  status?: string;
  featured?: boolean;
  order?: number;
  about?: string;
  included?: string[];
  specs?: string;
  requirements?: string[];
  gallery?: string[];
  license?: string;
  version?: string;
  sku?: string;
  checkoutUrl?: string;
  demoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  publishDate?: string | null;
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

export const projects: Project[] = [
  {
    slug: "smart-agri-soil-monitor",
    title: "Smart Agriculture Soil & Climate Monitor",
    category: "agri",
    size: "Medium",
    price: 7499,
    rating: 4.8,
    reviews: 126,
    image: img("photo-1500382017468-9049fed747ef"),
    youtube: "dQw4w9WgXcQ",
    summary:
      "ESP32-based field node measuring soil moisture, temperature, humidity and light, streaming live to a cloud dashboard with threshold alerts.",
    features: [
      "Live cloud dashboard with historical charts",
      "Soil-moisture driven irrigation trigger",
      "SMS / WhatsApp threshold alerts",
      "Solar-ready low-power design",
    ],
    components: ["ESP32 DevKit", "Capacitive soil sensor", "DHT22", "BH1750 lux", "Relay module"],
    readyMade: true,
    tags: ["esp32", "iot", "agri"],
  },
  {
    slug: "lora-mesh-weather-network",
    title: "LoRa Mesh Weather Station Network",
    category: "lora",
    size: "Large",
    price: 18999,
    rating: 4.9,
    reviews: 64,
    image: img("photo-1592833159155-c62df1b65634"),
    youtube: "dQw4w9WgXcQ",
    summary:
      "Multi-node LoRa network covering up to 5 km with a gateway aggregating weather data to a self-hosted dashboard — no SIM, no recurring cost.",
    features: [
      "3 sensor nodes + 1 gateway included",
      "Up to 5 km line-of-sight range",
      "Self-hosted Grafana dashboard",
      "Battery + solar power per node",
    ],
    components: ["SX1276 LoRa modules", "ESP32", "BME280", "Anemometer", "Solar panels"],
    readyMade: true,
    tags: ["lora", "iot"],
  },
  {
    slug: "ai-face-attendance",
    title: "AI Face-Recognition Attendance System",
    category: "ai-ml",
    size: "Large",
    price: 16499,
    rating: 4.7,
    reviews: 203,
    image: img("photo-1518770660439-4636190af475"),
    youtube: "dQw4w9WgXcQ",
    summary:
      "Raspberry Pi 4 edge device performing on-device face recognition with a web admin panel, CSV export and anti-spoofing checks.",
    features: [
      "On-device recognition (no cloud needed)",
      "Web admin with attendance reports",
      "Liveness / anti-spoof detection",
      "Auto CSV & email export",
    ],
    components: ["Raspberry Pi 4", "Pi Camera v2", "7\" touch display", "PIR sensor"],
    readyMade: true,
    tags: ["ai-ml", "raspberry-pi"],
  },
  {
    slug: "home-automation-hub",
    title: "ESP32 Smart Home Automation Hub",
    category: "smart-home",
    size: "Medium",
    price: 6299,
    rating: 4.6,
    reviews: 311,
    image: img("photo-1558002038-1055907df827"),
    youtube: "dQw4w9WgXcQ",
    summary:
      "Voice + app controlled home hub with 8-channel relay, energy monitoring and Google Home / Alexa integration.",
    features: [
      "Google Home & Alexa ready",
      "8-channel relay control",
      "Real-time energy monitoring",
      "OTA firmware updates",
    ],
    components: ["ESP32", "8-ch relay board", "PZEM-004T energy meter", "Enclosure"],
    readyMade: true,
    tags: ["esp32", "smart-home", "iot"],
  },
  {
    slug: "line-follower-robot",
    title: "PID Line-Follower Robot Kit",
    category: "robotics",
    size: "Small",
    price: 3499,
    rating: 4.5,
    reviews: 542,
    image: img("photo-1535378620166-273708d44e4c"),
    youtube: "dQw4w9WgXcQ",
    summary:
      "Competition-grade PID line follower with tunable gains over Bluetooth — perfect first robotics build for students.",
    features: [
      "Tunable PID over Bluetooth app",
      "8-channel IR array",
      "Up to 1.2 m/s tracking",
      "Full assembly + tuning guide",
    ],
    components: ["Arduino Nano", "TB6612 driver", "IR array", "N20 motors", "Li-ion pack"],
    readyMade: true,
    tags: ["robotics", "arduino"],
  },
  {
    slug: "industrial-modbus-gateway",
    title: "Industrial Modbus → MQTT Edge Gateway",
    category: "industrial",
    size: "Large",
    price: 24999,
    rating: 4.9,
    reviews: 38,
    image: img("photo-1581091226825-a6a2a5aee158"),
    youtube: "dQw4w9WgXcQ",
    summary:
      "DIN-rail edge gateway bridging Modbus RTU/TCP machinery to MQTT cloud with store-and-forward buffering.",
    features: [
      "Modbus RTU & TCP support",
      "Store-and-forward on network loss",
      "TLS-secured MQTT uplink",
      "Web config portal",
    ],
    components: ["ESP32-S3", "RS485 transceiver", "DIN enclosure", "24V power module"],
    readyMade: true,
    tags: ["industrial", "iot", "esp32"],
  },
  {
    slug: "arduino-air-quality",
    title: "Arduino Air Quality Monitor",
    category: "arduino",
    size: "Small",
    price: 2899,
    rating: 4.4,
    reviews: 287,
    image: img("photo-1610552050890-fe99536c2615"),
    youtube: "dQw4w9WgXcQ",
    summary:
      "Desktop air-quality monitor showing PM2.5, CO₂, temperature and humidity on a colour TFT with logging.",
    features: ["PM2.5 + CO₂ sensing", "1.8\" colour TFT", "SD-card logging", "3D-print case files"],
    components: ["Arduino Uno", "PMS5003", "MH-Z19 CO₂", "DHT22", "ST7735 TFT"],
    readyMade: true,
    tags: ["arduino", "iot"],
  },
  {
    slug: "rpi-edge-vision-counter",
    title: "Raspberry Pi People-Counting Camera",
    category: "raspberry-pi",
    size: "Medium",
    price: 11499,
    rating: 4.6,
    reviews: 91,
    image: img("photo-1526374965328-7f61d4dc18c5"),
    youtube: "dQw4w9WgXcQ",
    summary:
      "Edge vision device counting footfall in retail with privacy-first on-device inference and a live occupancy dashboard.",
    features: ["On-device YOLO inference", "Privacy-first (no faces stored)", "Live occupancy API", "Daily reports"],
    components: ["Raspberry Pi 4", "Pi Camera", "Coral USB (optional)", "Heatsink case"],
    readyMade: true,
    tags: ["raspberry-pi", "ai-ml"],
  },
];

export type Workshop = {
  slug: string;
  title: string;
  mode: "Online" | "Offline" | "Field" | "Internship" | "Corporate";
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  blurb: string;
  outcomes: string[];
  priceFrom: number;
};

export const workshops: Workshop[] = [
  {
    slug: "iot-bootcamp",
    title: "IoT with ESP32 — 5 Day Bootcamp",
    mode: "Offline",
    duration: "5 days · 30 hrs",
    level: "Beginner",
    blurb: "Hands-on sensors-to-cloud bootcamp. Every participant builds & keeps a working IoT node.",
    outcomes: ["Wi-Fi sensor nodes", "MQTT & cloud dashboards", "Mobile app control", "Capstone project"],
    priceFrom: 3500,
  },
  {
    slug: "ai-ml-edge",
    title: "Edge AI & Computer Vision",
    mode: "Online",
    duration: "4 weeks · weekend",
    level: "Intermediate",
    blurb: "Train and deploy vision models to Raspberry Pi and microcontrollers.",
    outcomes: ["Dataset prep", "Model training", "Quantization", "Edge deployment"],
    priceFrom: 6000,
  },
  {
    slug: "lora-field",
    title: "LoRa & Long-Range IoT — Field Workshop",
    mode: "Field",
    duration: "2 days on-site",
    level: "Advanced",
    blurb: "Deploy a real multi-km LoRa network on your campus or facility.",
    outcomes: ["RF planning", "Gateway setup", "Node provisioning", "Live deployment"],
    priceFrom: 25000,
  },
  {
    slug: "fdp-embedded",
    title: "Faculty Development Program — Embedded & IoT",
    mode: "Corporate",
    duration: "1 week",
    level: "Intermediate",
    blurb: "AICTE-aligned FDP to upskill faculty with industry-grade IoT labs & curriculum.",
    outcomes: ["Lab manuals", "Project bank", "Assessment design", "Certification"],
    priceFrom: 40000,
  },
];

export const testimonials = [
  {
    quote:
      "We deployed Inventre's LoRa weather network across our 40-acre campus. Setup took a weekend and it's been rock solid for a year.",
    name: "Dr. A. Rao",
    role: "HOD, ECE — VNR VJIET",
  },
  {
    quote:
      "Ordered the AI attendance kit for our final-year project. Documentation was so good we extended it into a published paper.",
    name: "Sneha K.",
    role: "B.Tech CSE Student",
  },
  {
    quote:
      "Their corporate IoT bootcamp upskilled 60 of our engineers. Practical, fast-paced, zero fluff.",
    name: "Vikram S.",
    role: "L&D Lead, Manufacturing",
  },
];

export const partners = [
  "VNR VJIET", "CBIT", "JNTU-H", "VIT", "BITS Pilani", "IIT Hyderabad",
  "Osmania University", "MGIT", "CVR College", "Gokaraju Rangaraju",
];

export const stats = [
  { value: "12,000+", label: "Kits shipped" },
  { value: "480+", label: "Custom builds delivered" },
  { value: "9,200+", label: "Students trained" },
  { value: "60+", label: "College partners" },
];

/* ------------------------------------------------------------------ */
/*  Online classes / courses (Learning Platform)                       */
/* ------------------------------------------------------------------ */
export type Course = {
  slug: string;
  title: string;
  mode: "Live" | "Self-paced";
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  instructor: string;
  rating: number;
  learners: number;
  lessons: number;
  hours: number;
  price: number;
  oldPrice?: number;
  image: string;
  blurb: string;
  highlights: string[];
  startDate?: string; // live cohorts
  schedule?: string;
  seatsLeft?: number;
  topics?: string[]; // syllabus topics — also drive the AI lessons & tutor
};

export const courses: Course[] = [
  {
    slug: "iot-esp32-live",
    title: "IoT with ESP32 — Live Cohort",
    mode: "Live",
    level: "Beginner",
    category: "esp32",
    instructor: "Bheem · Lead IoT Engineer",
    rating: 4.9,
    learners: 1840,
    lessons: 28,
    hours: 24,
    price: 4999,
    oldPrice: 7999,
    image: img("photo-1581091226825-a6a2a5aee158"),
    blurb:
      "Live, hands-on cohort taking you from zero to a deployed, cloud-connected ESP32 product. Weekly live sessions + doubt-clearing.",
    highlights: ["Live weekend classes", "Build 4 real projects", "Cloud dashboards + app", "Cohort certificate"],
    startDate: "Jul 6, 2026",
    schedule: "Sat & Sun · 7–9 PM IST",
    seatsLeft: 8,
  },
  {
    slug: "edge-ai-vision-live",
    title: "Edge AI & Computer Vision — Live",
    mode: "Live",
    level: "Intermediate",
    category: "ai-ml",
    instructor: "Dr. A. Rao · ML Specialist",
    rating: 4.8,
    learners: 920,
    lessons: 32,
    hours: 30,
    price: 8999,
    oldPrice: 12999,
    image: img("photo-1518770660439-4636190af475"),
    blurb:
      "Train, optimise and deploy vision models to Raspberry Pi & microcontrollers in a mentor-led live cohort.",
    highlights: ["Live mentor support", "Model quantization", "Deploy to edge devices", "Capstone project"],
    startDate: "Jul 20, 2026",
    schedule: "Tue & Thu · 8–10 PM IST",
    seatsLeft: 12,
  },
  {
    slug: "fullstack-iot-dashboards-live",
    title: "Full-Stack IoT Dashboards — Live",
    mode: "Live",
    level: "Intermediate",
    category: "iot",
    instructor: "S. Kulkarni · Full-Stack Dev",
    rating: 4.7,
    learners: 610,
    lessons: 26,
    hours: 22,
    price: 6999,
    image: img("photo-1551288049-bebda4e38f71"),
    blurb:
      "Build production IoT dashboards end-to-end: MQTT, time-series DB, REST APIs and a Next.js front-end.",
    highlights: ["MQTT + InfluxDB", "Realtime charts", "Auth & roles", "Deploy to cloud"],
    startDate: "Aug 3, 2026",
    schedule: "Sat & Sun · 11 AM–1 PM IST",
    seatsLeft: 15,
  },
  {
    slug: "lora-lorawan-selfpaced",
    title: "Mastering LoRa & LoRaWAN",
    mode: "Self-paced",
    level: "Advanced",
    category: "lora",
    instructor: "V. Singh · RF Engineer",
    rating: 4.8,
    learners: 1320,
    lessons: 22,
    hours: 16,
    price: 3499,
    image: img("photo-1592833159155-c62df1b65634"),
    blurb:
      "Everything from RF fundamentals to deploying a multi-km LoRaWAN network with a gateway and nodes.",
    highlights: ["RF & link budget", "Gateway setup", "TTN integration", "Lifetime access"],
  },
  {
    slug: "embedded-c-rtos-selfpaced",
    title: "Embedded C & RTOS Fundamentals",
    mode: "Self-paced",
    level: "Intermediate",
    category: "embedded",
    instructor: "M. Iyer · Firmware Lead",
    rating: 4.7,
    learners: 2050,
    lessons: 36,
    hours: 20,
    price: 2999,
    image: img("photo-1610552050890-fe99536c2615"),
    blurb:
      "Write rock-solid firmware: pointers, memory, interrupts, peripherals and FreeRTOS tasks & scheduling.",
    highlights: ["Bare-metal to RTOS", "Peripheral drivers", "Debugging tactics", "Lifetime access"],
  },
  {
    slug: "arduino-beginners-selfpaced",
    title: "Arduino for Absolute Beginners",
    mode: "Self-paced",
    level: "Beginner",
    category: "arduino",
    instructor: "R. Verma · Maker Educator",
    rating: 4.9,
    learners: 4120,
    lessons: 24,
    hours: 10,
    price: 1499,
    oldPrice: 2499,
    image: img("photo-1553406830-ef2513450d76"),
    blurb:
      "Your friendly first step into electronics & code — build 10 fun projects with zero prior experience.",
    highlights: ["No experience needed", "10 mini-projects", "Wiring & code basics", "Lifetime access"],
  },
  {
    slug: "raspberry-pi-linux-selfpaced",
    title: "Raspberry Pi & Linux for Makers",
    mode: "Self-paced",
    level: "Beginner",
    category: "raspberry-pi",
    instructor: "K. Nair · Systems Engineer",
    rating: 4.6,
    learners: 980,
    lessons: 20,
    hours: 12,
    price: 1999,
    image: img("photo-1526374965328-7f61d4dc18c5"),
    blurb:
      "Get comfortable with the Pi & Linux, then build edge projects — cameras, servers and automation.",
    highlights: ["Linux essentials", "GPIO & sensors", "Headless setup", "Lifetime access"],
  },
  {
    slug: "pcb-design-kicad-live",
    title: "PCB Design with KiCad — Live",
    mode: "Live",
    level: "Intermediate",
    category: "embedded",
    instructor: "M. Iyer · Hardware Lead",
    rating: 4.8,
    learners: 540,
    lessons: 18,
    hours: 18,
    price: 5499,
    image: img("photo-1581092160562-40aa08e78837"),
    blurb:
      "Design a real 2-layer board from schematic to Gerbers and get it manufacture-ready — live & guided.",
    highlights: ["Schematic to layout", "Routing & DRC", "Gerber export", "Get it fabricated"],
    startDate: "Aug 17, 2026",
    schedule: "Mon & Wed · 8–10 PM IST",
    seatsLeft: 10,
  },
];

/* ------------------------------------------------------------------ */
/*  Blog posts                                                         */
/* ------------------------------------------------------------------ */
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  emoji: string;
  cover: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "esp32-vs-esp8266-2026",
    title: "ESP32 vs ESP8266: which to pick in 2026",
    excerpt:
      "A practical, no-nonsense comparison of the two most popular Wi-Fi microcontrollers — cores, peripherals, power and price.",
    category: "Hardware",
    date: "Jun 2, 2026",
    readTime: "6 min",
    author: "Bheem",
    emoji: "📶",
    cover: img("photo-1581091226825-a6a2a5aee158"),
  },
  {
    slug: "getting-started-with-lora",
    title: "Getting started with LoRa: a practical guide",
    excerpt:
      "From spreading factors to gateways — everything you need to send your first long-range packet across kilometres.",
    category: "Connectivity",
    date: "May 24, 2026",
    readTime: "9 min",
    author: "V. Singh",
    emoji: "🛰️",
    cover: img("photo-1592833159155-c62df1b65634"),
  },
  {
    slug: "deploy-yolo-to-raspberry-pi",
    title: "Deploying a YOLO model to a Raspberry Pi",
    excerpt:
      "Quantize, convert and run real-time object detection on a Pi 4 — with the tricks that actually keep the FPS up.",
    category: "AI / ML",
    date: "May 10, 2026",
    readTime: "12 min",
    author: "Dr. A. Rao",
    emoji: "🧠",
    cover: img("photo-1518770660439-4636190af475"),
  },
  {
    slug: "mqtt-explained-for-beginners",
    title: "MQTT explained for IoT beginners",
    excerpt:
      "Topics, QoS, retained messages and the broker pattern — the messaging backbone of modern IoT, made simple.",
    category: "IoT",
    date: "Apr 28, 2026",
    readTime: "7 min",
    author: "S. Kulkarni",
    emoji: "📡",
    cover: img("photo-1558002038-1055907df827"),
  },
  {
    slug: "low-power-sensor-nodes",
    title: "Designing low-power battery sensor nodes",
    excerpt:
      "Sleep modes, duty cycling and power budgeting tricks to make a coin-cell node last for months in the field.",
    category: "Embedded",
    date: "Apr 14, 2026",
    readTime: "10 min",
    author: "M. Iyer",
    emoji: "🔋",
    cover: img("photo-1610552050890-fe99536c2615"),
  },
  {
    slug: "breadboard-to-pcb",
    title: "From breadboard to PCB: your first board",
    excerpt:
      "Turn a working prototype into a manufacturable 2-layer PCB — schematic, layout, DRC and ordering Gerbers.",
    category: "Hardware",
    date: "Mar 30, 2026",
    readTime: "11 min",
    author: "M. Iyer",
    emoji: "🔧",
    cover: img("photo-1581092160562-40aa08e78837"),
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/*  Download center                                                    */
/* ------------------------------------------------------------------ */
export type Download = {
  name: string;
  kind: "Source Code" | "Documentation" | "Datasheet" | "GitHub";
  category: string;
  size: string;
  free: boolean;
  href: string;
};

export const downloads: Download[] = [
  { name: "Smart Agriculture Monitor — Firmware", kind: "Source Code", category: "agri", size: "4.2 MB", free: false, href: "#" },
  { name: "ESP32 Home Automation — Source + App", kind: "Source Code", category: "smart-home", size: "6.8 MB", free: false, href: "#" },
  { name: "LoRa Mesh Network — Gateway + Node code", kind: "GitHub", category: "lora", size: "Repo", free: true, href: "https://github.com" },
  { name: "AI Face Attendance — Python source", kind: "Source Code", category: "ai-ml", size: "12.1 MB", free: false, href: "#" },
  { name: "Line Follower Robot — Arduino sketch", kind: "GitHub", category: "robotics", size: "Repo", free: true, href: "https://github.com" },
  { name: "ESP32 Pinout & Quick Reference", kind: "Datasheet", category: "esp32", size: "820 KB", free: true, href: "#" },
  { name: "DHT22 Sensor — Datasheet", kind: "Datasheet", category: "iot", size: "640 KB", free: true, href: "#" },
  { name: "Soil Monitor — Wiring & Setup Guide", kind: "Documentation", category: "agri", size: "1.1 MB", free: true, href: "#" },
  { name: "Modbus → MQTT Gateway — Manual", kind: "Documentation", category: "industrial", size: "2.3 MB", free: false, href: "#" },
  { name: "SX1276 LoRa Module — Datasheet", kind: "Datasheet", category: "lora", size: "1.8 MB", free: true, href: "#" },
  { name: "Raspberry Pi People Counter — Source", kind: "GitHub", category: "raspberry-pi", size: "Repo", free: true, href: "https://github.com" },
  { name: "Air Quality Monitor — Schematic + BOM", kind: "Documentation", category: "arduino", size: "950 KB", free: true, href: "#" },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}
