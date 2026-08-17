import Link from "next/link";
import ProductImage from "./product-image";
import { formatPrice, isPurchasable, type Tee } from "@/lib/products";

const CONFIDENCE_LABEL: Record<string, string> = {
  estimated: "Estimated price",
  listed: "Listed price",
  confirmed: "Confirmed price",
};

export default function ProductCard({ tee }: { tee: Tee }) {
  return (
    <Link
      href={`/tees/${tee.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-brand-silver bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-navy/10"
    >
      <div className="relative aspect-square w-full bg-brand-silver/30">
        <ProductImage
          slug={tee.slug}
          alt={`${tee.brand} ${tee.model}`}
          brand={tee.brand}
          category={tee.category}
        />
        {tee.code && tee.code !== "Union" && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {tee.code}
          </span>
        )}
        {tee.endorsement && (
          <span className="absolute right-2 top-2 rounded-full bg-brand-blue px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Pro-used
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-grey">
          {tee.brand}
        </p>
        <h3 className="font-display text-sm font-bold leading-snug text-brand-navy">
          {tee.model}
        </h3>
        <p className="text-xs text-brand-grey">{tee.category ?? "Kicking tee"}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <p className="font-display text-lg font-bold text-brand-navy">
              {formatPrice(tee.priceGBP)}
            </p>
            {isPurchasable(tee) && tee.priceConfidence && (
              <p className="text-[10px] text-brand-grey">
                {CONFIDENCE_LABEL[tee.priceConfidence]}
              </p>
            )}
          </div>
          {!isPurchasable(tee) && (
            <span className="rounded-full bg-brand-silver px-2 py-1 text-[10px] font-semibold text-brand-navy">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
