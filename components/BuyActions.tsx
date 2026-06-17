"use client";

import { useState } from "react";
import { Button } from "./ui";
import { formatMoney } from "@/lib/site";

type Opt = { label: string; price: number };

export default function BuyActions({
  title,
  price,
  originalPrice,
  currency = "INR",
  options = [],
}: {
  title: string;
  price: number;
  originalPrice?: number | null;
  currency?: string;
  options?: Opt[];
}) {
  const hasOptions = options.length > 0;
  const [sel, setSel] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const active = hasOptions ? options[Math.min(sel, options.length - 1)] : { label: "", price };
  const unit = active.price;
  const off =
    !hasOptions && originalPrice && originalPrice > price
      ? Math.round((1 - price / originalPrice) * 100)
      : 0;
  const save =
    !hasOptions && originalPrice && originalPrice > price ? originalPrice - price : 0;

  return (
    <div>
      {/* Price options */}
      {hasOptions ? (
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-700/45">
            Choose an option
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((o, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSel(i)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  i === sel
                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                    : "border-navy-700/12 hover:bg-brand-50/50"
                }`}
              >
                <div className="text-sm font-semibold text-navy-800">{o.label}</div>
                <div className="text-lg font-extrabold text-navy-800">
                  {formatMoney(o.price, currency)}
                </div>
              </button>
            ))}
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

      {/* Quantity + total */}
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
            Total{hasOptions && active.label ? ` · ${active.label}` : ""}
          </div>
          <div className="text-xl font-black text-navy-800">
            {formatMoney(unit * qty, currency)}
          </div>
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
                active.label ? ` (${active.label})` : ""
              } — wire this to Razorpay / Stripe in /api/checkout.`
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
