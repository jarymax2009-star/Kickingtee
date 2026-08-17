import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/product-image";
import ProductCard from "@/components/product-card";
import AddToCart from "@/components/add-to-cart";
import {
  formatPrice,
  getAllTees,
  getTeeBySlug,
  isPurchasable,
} from "@/lib/products";

export function generateStaticParams() {
  return getAllTees().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tee = getTeeBySlug(slug);
  if (!tee) return {};
  return {
    title: `${tee.brand} ${tee.model}`,
    description: `${tee.brand} ${tee.model} — ${tee.category ?? "rugby kicking tee"}. ${formatPrice(tee.priceGBP)}.`,
  };
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 border-b border-brand-silver/70 py-2.5 text-sm">
      <dt className="text-brand-grey">{label}</dt>
      <dd className="text-right font-semibold text-brand-navy">{value}</dd>
    </div>
  );
}

const CONFIDENCE_COPY: Record<string, string> = {
  confirmed: "Price confirmed directly with retailer",
  listed: "Price as listed by retailer",
  estimated: "Estimated price — converted or unconfirmed at source",
};

export default async function TeeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tee = getTeeBySlug(slug);
  if (!tee) notFound();

  const related = getAllTees()
    .filter((t) => t.slug !== tee.slug && t.brand === tee.brand)
    .slice(0, 4);

  const fallbackRelated =
    related.length > 0
      ? related
      : getAllTees()
          .filter((t) => t.slug !== tee.slug && t.category === tee.category)
          .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs text-brand-grey">
        <Link href="/shop" className="hover:text-brand-blue">
          Shop
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-brand-navy">{tee.brand} {tee.model}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-brand-silver/30">
          <ProductImage
            slug={tee.slug}
            alt={`${tee.brand} ${tee.model}`}
            brand={tee.brand}
            category={tee.category}
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
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

          <div className="mt-6">
            <AddToCart slug={tee.slug} purchasable={isPurchasable(tee)} />
          </div>

          {tee.notes && (
            <p className="mt-6 rounded-lg bg-brand-silver/40 p-4 text-sm leading-relaxed text-brand-navy/80">
              {tee.notes}
            </p>
          )}

          {tee.sourceUrl && (
            <p className="mt-4 text-xs text-brand-grey">
              Manufacturer reference:{" "}
              <a
                href={tee.sourceUrl.split(";")[0].trim()}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-brand-blue hover:underline"
              >
                {new URL(tee.sourceUrl.split(";")[0].trim()).hostname}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-brand-navy">
            Height &amp; fit
          </h2>
          <dl>
            <Spec label="Style / cut" value={tee.category} />
            <Spec label="Fixed height" value={tee.heightMm ? `${tee.heightMm} mm` : null} />
            <Spec
              label="Adjustable range"
              value={tee.adjustableRangeMm ? `${tee.adjustableRangeMm} mm` : null}
            />
            <Spec label="Adjustment mechanism" value={tee.mechanism ?? tee.mechanismFamily} />
            <Spec label="Ball cup angle" value={tee.cupAngleDeg ? `${tee.cupAngleDeg}°` : null} />
          </dl>
        </div>

        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-brand-navy">
            Build &amp; performance
          </h2>
          <dl>
            <Spec label="Base diameter" value={tee.baseDiameterMm ? `${tee.baseDiameterMm} mm (${tee.baseBand})` : tee.baseBand} />
            <Spec label="Weight" value={tee.weightG ? `${tee.weightG} g (${tee.weightBand})` : tee.weightBand} />
            <Spec label="Material" value={tee.material ?? tee.materialFamily} />
            <Spec label="Shore hardness" value={tee.shoreHardness} />
            <Spec label="Grip / base type" value={tee.gripType ?? tee.gripFamily} />
            <Spec
              label="Wind stability rating"
              value={tee.windRating ? `${tee.windRating} / 5` : "Independent testing pending"}
            />
            <Spec
              label="Wet-pitch grip rating"
              value={tee.wetRating ? `${tee.wetRating} / 5` : "Independent testing pending"}
            />
            <Spec label="Union / League" value={tee.code} />
          </dl>
        </div>
      </div>

      {fallbackRelated.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-4 font-display text-lg font-bold text-brand-navy">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {fallbackRelated.map((t) => (
              <ProductCard key={t.slug} tee={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
