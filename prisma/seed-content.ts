/* ------------------------------------------------------------------ */
/*  Seeds the full "IoT with ESP32" course outline (modules + topics)  */
/*  into the database, plus one fully-written sample topic.            */
/*  Run with:  npx tsx prisma/seed-content.ts                          */
/*  Idempotent: it wipes & re-creates this course's modules each run.  */
/* ------------------------------------------------------------------ */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COURSE_SLUG = "iot-esp32-live"; // must match a Course in the catalogue

type Mod = {
  title: string;
  band: "Beginner" | "Intermediate" | "Advanced" | "Projects";
  topics?: string[];
  practicals?: string[];
  projects?: string[];
};

const OUTLINE: Mod[] = [
  // ---- Beginner ----
  { title: "Introduction to IoT", band: "Beginner",
    topics: ["What is IoT?", "History of IoT", "Applications of IoT", "IoT Architecture", "Sensors and Actuators", "Embedded Systems Basics", "Microcontrollers vs Microprocessors", "IoT Communication Methods"],
    practicals: ["Understanding an ESP32 board"] },
  { title: "ESP32 Fundamentals", band: "Beginner",
    topics: ["Introduction to ESP32", "ESP32 Variants", "ESP32 Pin Diagram", "GPIO Pins", "Power Requirements", "Internal Architecture", "Dual-Core Processor", "Flash Memory and RAM"],
    practicals: ["Blink LED", "Push Button Control"] },
  { title: "Arduino IDE Setup", band: "Beginner",
    topics: ["Installing Arduino IDE", "ESP32 Board Installation", "Board Configuration", "Serial Monitor", "Uploading Code"],
    practicals: ["First Program", "Serial Communication"] },
  { title: "Embedded C Programming Basics", band: "Beginner",
    topics: ["Variables", "Data Types", "Operators", "Conditions", "Loops", "Functions", "Arrays", "Strings", "Structures"],
    practicals: ["Temperature Converter", "LED Patterns"] },
  { title: "Digital I/O", band: "Beginner",
    topics: ["GPIO", "INPUT and OUTPUT", "Pull-up and Pull-down Resistors", "Debouncing"],
    practicals: ["LED Control", "Traffic Signal Project", "Button Counter"] },
  { title: "Analog I/O", band: "Beginner",
    topics: ["ADC", "DAC", "PWM"],
    practicals: ["Potentiometer Reading", "LED Brightness Control"] },
  { title: "Sensors", band: "Beginner",
    topics: ["Sensor Fundamentals", "Analog Sensors", "Digital Sensors", "DHT11", "Temperature and Humidity", "LDR", "Light Sensor", "MQ2", "Gas Sensor", "PIR", "Motion Sensor", "Ultrasonic Sensor", "Soil Moisture Sensor", "Rain Sensor"],
    practicals: ["Sensor Data Monitoring"] },
  { title: "Communication Protocols", band: "Beginner",
    topics: ["UART", "I2C", "SPI", "CAN", "RS485"],
    practicals: ["LCD with I2C", "MPU6050", "SD Card Module"] },
  { title: "WiFi", band: "Beginner",
    topics: ["Station Mode", "Access Point Mode", "Static IP", "DHCP", "WiFi Scanning"],
    practicals: ["Connect to WiFi", "WiFi Scanner"] },

  // ---- Intermediate ----
  { title: "Bluetooth and BLE", band: "Intermediate",
    topics: ["Bluetooth Classic", "BLE", "GATT Services"],
    practicals: ["Smartphone App Control"] },
  { title: "Web Server", band: "Intermediate",
    topics: ["HTTP", "GET", "POST", "REST APIs"],
    practicals: ["ESP32 Web Server", "LED Control Through Browser"] },
  { title: "MQTT", band: "Intermediate",
    topics: ["Publish", "Subscribe", "Broker", "QoS"],
    practicals: ["HiveMQ", "Mosquitto"] },
  { title: "Cloud Platforms", band: "Intermediate",
    topics: ["Firebase", "Blynk", "Thingspeak", "AWS IoT", "Azure IoT"],
    practicals: ["Send Sensor Data to Cloud"] },
  { title: "Display Interfaces", band: "Intermediate",
    topics: ["OLED Display", "LCD Display", "TFT Display"],
    practicals: ["Temperature Display"] },
  { title: "Data Storage", band: "Intermediate",
    topics: ["EEPROM", "SPIFFS", "SD Card"],
    practicals: ["Save Sensor Data"] },
  { title: "Time and Scheduling", band: "Intermediate",
    topics: ["RTC Modules", "NTP Server"],
    practicals: ["Digital Clock"] },
  { title: "Security", band: "Intermediate",
    topics: ["HTTPS", "SSL/TLS", "API Keys", "Authentication"] },
  { title: "OTA Updates", band: "Intermediate",
    topics: ["Firmware Update", "Remote Update"],
    practicals: ["OTA Programming"] },
  { title: "ESP-NOW", band: "Intermediate",
    topics: ["Peer-to-Peer Communication", "MAC Address", "Pairing"],
    practicals: ["Wireless Sensor Network"] },

  // ---- Advanced ----
  { title: "FreeRTOS", band: "Advanced",
    topics: ["Tasks", "Scheduler", "Queues", "Semaphores"],
    practicals: ["Multitasking"] },
  { title: "Camera and Vision", band: "Advanced",
    topics: ["ESP32-CAM", "Image Capture", "Face Recognition"] },
  { title: "LoRa Communication", band: "Advanced",
    topics: ["SX1278", "Point-to-Point", "LoRa Gateway"] },
  { title: "GSM and GPS", band: "Advanced",
    topics: ["SIM800L", "NEO-6M GPS"],
    practicals: ["Vehicle Tracking"] },
  { title: "Home Automation", band: "Advanced",
    projects: ["Smart Switch", "Smart Fan"] },
  { title: "Agriculture Projects", band: "Advanced",
    projects: ["Smart Irrigation", "Water Level Monitoring"] },
  { title: "Industrial IoT", band: "Advanced",
    topics: ["Modbus RTU", "RS485", "PLC Communication"] },
  { title: "AI and IoT", band: "Advanced",
    topics: ["TinyML", "Edge AI", "TensorFlow Lite"] },
  { title: "Mobile App Integration", band: "Advanced",
    topics: ["Flutter", "MIT App Inventor", "Blynk"] },
  { title: "Dashboard Development", band: "Advanced",
    topics: ["Node-RED", "Grafana", "ThingsBoard"] },

  // ---- Projects ----
  { title: "Capstone Projects", band: "Projects",
    projects: ["Smart Street Light", "Weather Station", "Automatic Plant Watering", "Home Automation System", "Gas Leakage Detection", "RFID Attendance System", "Smart Energy Meter", "Vehicle Tracking System", "Industrial Monitoring", "Smart Agriculture System"] },
];

// One fully-written sample topic, keyed by title, as a template to copy.
const SAMPLE: Record<string, Record<string, string>> = {
  "What is IoT?": {
    theory: `The Internet of Things (IoT) means connecting everyday physical devices to the internet so they can collect data and act on it.

A "thing" can be a sensor, a home appliance, a vehicle, a machine in a factory — anything with a small computer and a way to communicate.

Why it matters:
- Devices can sense their environment (temperature, motion, light, gas).
- They can send that data to the cloud or a phone.
- They can receive commands and take actions (turn on a fan, lock a door).

A simple IoT system has four parts:
- Sensors/devices that collect data
- Connectivity (WiFi, Bluetooth, LoRa, GSM)
- A server/cloud that stores and processes data
- A user interface (app or dashboard) to view and control

ESP32 is one of the most popular boards for IoT because it has built-in WiFi and Bluetooth, two CPU cores, and is very low cost.`,
    components: `No hardware needed for this lesson — it is a concept introduction.
For the rest of the course you will use:
- ESP32 development board
- USB cable
- A few LEDs, resistors and jumper wires`,
    quiz: `1) IoT stands for:
   a) Internet of Tools
   b) Internet of Things   ✅
   c) Internal Online Transfer

2) Which feature makes ESP32 great for IoT?
   a) Built-in WiFi and Bluetooth   ✅
   b) It has a screen
   c) It needs no power

3) Which is NOT one of the four parts of an IoT system?
   a) Sensors
   b) Connectivity
   c) Printer   ✅`,
    exercise: `List 5 devices around your home that could become "smart" with IoT, and for each, write what it would sense and what action it could take.`,
  },
};

async function main() {
  // Make sure the course exists (so students can reserve it).
  const course = await prisma.course.findUnique({ where: { slug: COURSE_SLUG } });
  if (!course) {
    console.warn(
      `⚠ Course "${COURSE_SLUG}" not found. Run the catalogue seed first (npm run db:seed), or change COURSE_SLUG.`
    );
  }

  // Wipe existing modules for this course (cascade deletes topics).
  await prisma.courseModule.deleteMany({ where: { courseSlug: COURSE_SLUG } });

  let moduleOrder = 0;
  let topicCount = 0;

  for (const mod of OUTLINE) {
    const created = await prisma.courseModule.create({
      data: {
        courseSlug: COURSE_SLUG,
        title: mod.title,
        band: mod.band,
        order: moduleOrder++,
      },
    });

    const entries: { title: string; kind: string }[] = [
      ...(mod.topics ?? []).map((t) => ({ title: t, kind: "topic" })),
      ...(mod.practicals ?? []).map((t) => ({ title: t, kind: "practical" })),
      ...(mod.projects ?? []).map((t) => ({ title: t, kind: "project" })),
    ];

    let order = 0;
    for (const e of entries) {
      await prisma.topic.create({
        data: {
          moduleId: created.id,
          title: e.title,
          kind: e.kind,
          order: order++,
          ...(SAMPLE[e.title] ?? {}),
        },
      });
      topicCount++;
    }
  }

  console.log(`✅ Seeded ${OUTLINE.length} modules and ${topicCount} topics for "${COURSE_SLUG}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
