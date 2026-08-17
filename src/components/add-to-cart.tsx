"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function AddToCart({
  slug,
  color,
  purchasable,
}: {
  slug: string;
  color: string;
  purchasable: boolean;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const router = useRouter();

  if (!purchasable) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-md bg-brand-silver px-6 py-3 text-sm font-bold text-brand-grey"
      >
        Out of stock — price unavailable
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-brand-silver">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-brand-navy hover:bg-brand-silver/50"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold text-brand-navy">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="px-3 py-2 text-brand-navy hover:bg-brand-silver/50"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            add(slug, color, qty);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 1800);
          }}
          className="flex-1 rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-navy"
        >
          {justAdded ? "Added ✓" : "Add to cart"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          add(slug, color, qty);
          router.push("/cart");
        }}
        className="w-full rounded-md border border-brand-navy px-6 py-3 text-sm font-bold text-brand-navy transition hover:bg-brand-navy hover:text-white"
      >
        Buy now
      </button>
    </div>
  );
}
