"use client";

import { useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/product-image";
import { useCart } from "@/lib/cart-context";
import { formatPrice, getTeeBySlug } from "@/lib/products";

export default function CartPage() {
  const { lines, setQty, remove, subtotalGBP } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = lines
    .map((l) => ({ line: l, tee: getTeeBySlug(l.slug) }))
    .filter((x): x is { line: typeof x.line; tee: NonNullable<typeof x.tee> } => !!x.tee);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not reach checkout. Please try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-bold text-brand-navy">
          Your cart is empty
        </h1>
        <p className="mt-2 text-brand-grey">
          Use the filters to find your next one.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-brand-navy"
        >
          Shop tees
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-brand-navy">
        Your cart
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-brand-silver">
          {items.map(({ line, tee }) => {
            const swatchHex = tee.colors.find((c) => c.name === line.color)?.hex;
            return (
              <li key={`${tee.slug}__${line.color}`} className="flex gap-4 py-5">
                <Link
                  href={`/tees/${tee.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-brand-silver/30"
                >
                  <ProductImage
                    slug={tee.slug}
                    alt={`${tee.brand} ${tee.model}`}
                    brand={tee.brand}
                    category={tee.category}
                    sizes="96px"
                    tintHex={swatchHex}
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/tees/${tee.slug}`}
                      className="font-display text-sm font-bold text-brand-navy hover:text-brand-blue"
                    >
                      {tee.brand} {tee.model}
                    </Link>
                    <p className="text-xs text-brand-grey">{tee.category}</p>
                    {line.color && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-grey">
                        <span
                          className="h-3 w-3 rounded-full ring-1 ring-black/10"
                          style={{ backgroundColor: swatchHex ?? "#ccc" }}
                        />
                        {line.color}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-md border border-brand-silver">
                      <button
                        type="button"
                        onClick={() => setQty(tee.slug, line.color, line.qty - 1)}
                        className="px-2.5 py-1 text-brand-navy hover:bg-brand-silver/50"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-brand-navy">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(tee.slug, line.color, line.qty + 1)}
                        className="px-2.5 py-1 text-brand-navy hover:bg-brand-silver/50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-display text-sm font-bold text-brand-navy">
                        {formatPrice((tee.priceGBP ?? 0) * line.qty)}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(tee.slug, line.color)}
                        className="text-xs text-brand-grey hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="h-fit rounded-xl border border-brand-silver p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-brand-navy">
            Order summary
          </h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-brand-grey">Subtotal</span>
            <span className="font-semibold text-brand-navy">
              {formatPrice(subtotalGBP)}
            </span>
          </div>
          <p className="mt-1 text-xs text-brand-grey">
            Shipping and any taxes are calculated at checkout.
          </p>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-xs text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={checkout}
            disabled={loading}
            className="mt-5 w-full rounded-md bg-brand-blue py-3 text-sm font-bold text-white transition hover:bg-brand-navy disabled:opacity-60"
          >
            {loading ? "Redirecting to checkout…" : "Checkout with Stripe"}
          </button>
          <p className="mt-3 text-center text-[11px] text-brand-grey">
            Secure payment via Stripe. Cards, Apple Pay &amp; Google Pay accepted.
          </p>
        </div>
      </div>
    </div>
  );
}
