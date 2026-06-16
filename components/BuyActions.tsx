"use client";

import { useState } from "react";
import { Button } from "./ui";
import { formatINR } from "@/lib/site";

export default function BuyActions({
  title,
  price,
}: {
  title: string;
  price: number;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-4">
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
          <div className="text-xs text-navy-700/50">Total</div>
          <div className="text-xl font-black text-navy-800">
            {formatINR(price * qty)}
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
              `Checkout for ${qty} × "${title}" — wire this to Razorpay / Stripe in /api/checkout.`
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
