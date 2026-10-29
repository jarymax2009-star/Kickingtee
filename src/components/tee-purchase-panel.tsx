"use client";

import { useState } from "react";
import ProductImage from "./product-image";
import ColorSwatches from "./color-swatches";
import AddToCart from "./add-to-cart";
import CompareToggle from "./compare-toggle";
import { formatPrice, isPurchasable, type Tee } from "@/lib/products";
import { CHECKOUT_ENABLED } from "@/lib/site";

const CONFIDENCE_COPY: Record<string, string> = {
  confirmed: "Price confirmed directly with retailer",
  listed: "Price as listed by retailer",
  estimated: "Estimated price, converted or unconfirmed at source",
};

export default function TeePurchasePanel({ tee }: { tee: Tee }) {
  const [color, setColor] = useState(tee.colors[0]?.name ?? "Black");
  const sourceHref = tee.sourceUrl?.split(";")[0].trim() || null;
  const sourceHost = sourceHref ? new URL(sourceHref).hostname.replace(/^www\./, "") : null;
  const selectedHex = tee.colors.find((c) => c.name === color)?.hex;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-brand-silver/30">
        <ProductImage
          slug={tee.slug}
          alt={`${tee.brand} ${tee.model}, ${color}`}
          brand={tee.brand}
          category={tee.category}
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
          tintHex={selectedHex}
        />
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">
          {tee.brand}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-brand-navy">
          {tee.model}
        </h1>
        <p className="mt-1 text-brand-grey">{tee.category ?? "Kicking tee"}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tee.code && (
            <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {tee.code}
            </span>
          )}
          {tee.endorsement && (
            <span className="rounded-full bg-brand-blue px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Used by {tee.endorsement}
            </span>
          )}
        </div>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold text-brand-navy">
            {formatPrice(tee.priceGBP)}
          </span>
          {tee.priceConfidence && (
            <span className="text-xs text-brand-grey">
              {CONFIDENCE_COPY[tee.priceConfidence]}
            </span>
          )}
        </div>

        {tee.colors.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-navy">
              Colour: <span className="font-semibold text-brand-grey">{color}</span>
            </p>
            <ColorSwatches colors={tee.colors} value={color} onChange={setColor} />
            <p className="mt-2 text-[11px] text-brand-grey">
              Colourways shown are indicative. Confirm exact availability with
              the manufacturer before ordering.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="min-w-[220px] flex-1">
            {CHECKOUT_ENABLED ? (
              <AddToCart slug={tee.slug} color={color} purchasable={isPurchasable(tee)} />
            ) : sourceHref ? (
              <a
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block w-full rounded-md bg-brand-blue px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-brand-navy"
              >
                View on {sourceHost} ↗
              </a>
            ) : null}
          </div>
          <CompareToggle slug={tee.slug} variant="detail" />
        </div>

        {tee.notes && (
          <p className="mt-6 rounded-lg bg-brand-silver/40 p-4 text-sm leading-relaxed text-brand-navy/80">
            {tee.notes}
          </p>
        )}

        {sourceHref && CHECKOUT_ENABLED && (
          <p className="mt-4 text-xs text-brand-grey">
            Manufacturer reference:{" "}
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-brand-blue underline underline-offset-2 hover:no-underline"
            >
              {sourceHost}
            </a>
          </p>
        )}

        {!CHECKOUT_ENABLED && (
          <p className="mt-4 text-xs text-brand-grey">
            KickingTee.com doesn&apos;t sell tees. You buy directly from the
            manufacturer or retailer, so check their price, stock and
            delivery before ordering.
          </p>
        )}
      </div>
    </div>
  );
}
