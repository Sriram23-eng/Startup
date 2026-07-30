"use client";

import { useMemo, useState } from "react";
import { formatINR } from "@/lib/site";
import { Button } from "./ui";

const controllers = [
  { id: "arduino", name: "Arduino Uno/Nano", price: 600 },
  { id: "esp32", name: "ESP32", price: 850 },
  { id: "esp8266", name: "ESP8266", price: 450 },
  { id: "rpi", name: "Raspberry Pi 4", price: 6500 },
  { id: "stm32", name: "STM32", price: 1200 },
];

const sensors = [
  { id: "dht11", name: "DHT11 / DHT22 (temp/humidity)", price: 250 },
  { id: "soil", name: "Soil moisture", price: 200 },
  { id: "pir", name: "PIR motion", price: 150 },
  { id: "ultra", name: "Ultrasonic distance", price: 180 },
  { id: "gas", name: "Gas / air quality", price: 350 },
  { id: "cam", name: "Camera module", price: 900 },
  { id: "gps", name: "GPS module", price: 700 },
  { id: "lcd", name: "LCD / OLED display", price: 350 },
];

const comms = [
  { id: "wifi", name: "Wi-Fi (built-in)", price: 0 },
  { id: "lora", name: "LoRa (long range)", price: 900 },
  { id: "gsm", name: "GSM / 4G", price: 1400 },
  { id: "ble", name: "Bluetooth", price: 0 },
  { id: "ethernet", name: "Ethernet", price: 600 },
];

export default function CostCalculator() {
  const [controller, setController] = useState(controllers[1].id);
  const [picked, setPicked] = useState<string[]>(["dht11"]);
  const [comm, setComm] = useState("wifi");

  const toggle = (id: string) =>
    setPicked((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const { hardware, total } = useMemo(() => {
    const c = controllers.find((x) => x.id === controller)?.price ?? 0;
    const s = sensors
      .filter((x) => picked.includes(x.id))
      .reduce((a, b) => a + b.price, 0);
    const m = comms.find((x) => x.id === comm)?.price ?? 0;
    const hardware = c + s + m + 400; /* misc: board, wires, enclosure */
    const total = Math.round((hardware * 1.65) / 50) * 50; /* +assembly, code, docs, margin */
    return { hardware, total };
  }, [controller, picked, comm]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <Group label="1 · Controller">
          <div className="flex flex-wrap gap-2">
            {controllers.map((c) => (
              <Pick
                key={c.id}
                active={controller === c.id}
                onClick={() => setController(c.id)}
              >
                {c.name}
              </Pick>
            ))}
          </div>
        </Group>

        <Group label="2 · Sensors & modules">
          <div className="flex flex-wrap gap-2">
            {sensors.map((s) => (
              <Pick
                key={s.id}
                active={picked.includes(s.id)}
                onClick={() => toggle(s.id)}
              >
                {s.name}
              </Pick>
            ))}
          </div>
        </Group>

        <Group label="3 · Connectivity">
          <div className="flex flex-wrap gap-2">
            {comms.map((c) => (
              <Pick
                key={c.id}
                active={comm === c.id}
                onClick={() => setComm(c.id)}
              >
                {c.name}
              </Pick>
            ))}
          </div>
        </Group>
      </div>

      {/* Estimate */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="relative overflow-hidden rounded-2xl bg-navy-800 text-white shadow-glow">
          <div className="mesh pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-accent">
              Estimated project cost
            </div>
            <div className="mt-2 text-4xl font-black">{formatINR(total)}</div>
            <div className="mt-1 text-sm text-brand-100/60">
              Hardware ~{formatINR(hardware)} + assembly, firmware & docs
            </div>

            <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <Row label="Controller" value={controllerName(controller)} />
              <Row
                label="Sensors"
                value={picked.length ? `${picked.length} selected` : "none"}
              />
              <Row label="Connectivity" value={commName(comm)} />
            </div>

            <Button
              href="/custom-project"
              variant="white"
              className="mt-6 w-full"
            >
              Request this build →
            </Button>
            <p className="mt-3 text-center text-xs text-brand-100/50">
              Indicative only · final quote after review
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function controllerName(id: string) {
  return controllers.find((c) => c.id === id)?.name ?? "";
}
function commName(id: string) {
  return comms.find((c) => c.id === id)?.name ?? "";
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3 text-sm font-bold text-ink-900">{label}</div>
      {children}
    </div>
  );
}

function Pick({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
        active
          ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100"
          : "border-line-strong text-ink-700 hover:border-brand-300"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-brand-100/55">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
