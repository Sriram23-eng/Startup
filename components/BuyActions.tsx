"use client";

import { useState } from "react";
import { Button } from "./ui";
import { formatMoney } from "@/lib/site";

type Opt = { label: string; price: number; popular?: boolean };

export default function BuyActions({
  title,
  price,
  originalPrice,
  currency = "INR",
  options = [],
  multiSelect = false,
}: {
  title: string;
  price: number;
  originalPrice?: number | null;
  currency?: string;
  options?: Opt[];
  multiSelect?: boolean;
}) {
  const hasOptions = options.length > 0;
  const [sel, setSel] = useState(0); // single-select index
  const [multi, setMulti] = useState<number[]>([0]); // multi-select indices
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function toggleMulti(i: number) {
    setMulti((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i].sort((a, b) => a - b)
    );
  }
  const isSelected = (i: number) => (multiSelect ? multi.includes(i) : i === sel);

  // Resolve the unit total + a label summary.
  let unit = price;
  let summary = "";
  if (hasOptions) {
    if (multiSelect) {
      const chosen = options.filter((_, i) => multi.includes(i));
      unit = chosen.reduce((a, o) => a + o.price, 0);
      summary = chosen.length ? `${chosen.length} selected` : "none selected";
    } else {
      const a = options[Math.min(sel, options.length - 1)];
      unit = a.price;
      summary = a.label;
    }
  }

  const off =
    !hasOptions && originalPrice && originalPrice > price
      ? Math.round((1 - price / originalPrice) * 100)
      : 0;
  const save =
    !hasOptions && originalPrice && originalPrice > price ? originalPrice - price : 0;

  return (
    <div>
      {hasOptions ? (
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-700/45">
            {multiSelect ? "Choose options (add-ons)" : "Choose an option"}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((o, i) => {
              const on = isSelected(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => (multiSelect ? toggleMulti(i) : setSel(i))}
                  className={`relative flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    o.popular
                      ? "border-brand-500"
                      : on
                      ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                      : "border-navy-700/12 hover:bg-brand-50/50"
                  } ${o.popular && on ? "bg-brand-50 ring-2 ring-brand-100" : ""}`}
                >
                  {o.popular && (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                      ★ Most popular
                    </span>
                  )}
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border text-[11px] ${
                      multiSelect ? "rounded-md" : "rounded-full"
                    } ${
                      on ? "border-brand-600 bg-brand-600 text-white" : "border-navy-700/25 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy-800">{o.label}</span>
                    <span className="block text-lg font-extrabold text-navy-800">
                      {formatMoney(o.price, currency)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-3xl font-black text-navy-800">{formatMoney(price, currency)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-navy-700/40 line-through">
                  {formatMoney(originalPrice!, currency)}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-bold text-emerald-600">
                  -{off}% off
                </span>
              </>
            )}
          </div>
          {save > 0 && (
            <div className="mt-1 text-sm font-semibold text-emerald-600">
              You save {formatMoney(save, currency)}
            </div>
          )}
        </div>
      )}

      <div className="mt-1 text-xs text-navy-700/45">
        Inclusive of hardware, source code &amp; documentation
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex items-center rounded-xl border border-navy-700/12 bg-white">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3.5 py-2.5 text-lg font-bold text-navy-700/60 hover:text-brand-600"
          >
            −
          </button>
          <span className="w-8 text-center font-bold text-navy-800">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3.5 py-2.5 text-lg font-bold text-navy-700/60 hover:text-brand-600"
          >
            +
          </button>
        </div>
        <div>
          <div className="text-xs text-navy-700/50">
            Total{hasOptions && summary ? ` · ${summary}` : ""}
          </div>
          <div className="text-xl font-black text-navy-800">{formatMoney(unit * qty, currency)}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          variant="white"
          className="flex-1"
          onClick={() => {
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
          }}
        >
          {added ? "✓ Added to cart" : "Add to cart"}
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={() =>
            alert(
              `Checkout for ${qty} × "${title}"${
                hasOptions && summary ? ` (${summary})` : ""
              } — total ${formatMoney(unit * qty, currency)}. Wire this to Razorpay / Stripe in /api/checkout.`
            )
          }
        >
          Buy now →
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-navy-700/45">
        Secure checkout · Razorpay / UPI · Ships in 3–5 days
      </p>
    </div>
  );
}
