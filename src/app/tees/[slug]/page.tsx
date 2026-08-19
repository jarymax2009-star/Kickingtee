import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product-card";
import TeePurchasePanel from "@/components/tee-purchase-panel";
import { formatPrice, getAllTees, getTeeBySlug } from "@/lib/products";

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

      <TeePurchasePanel tee={tee} />

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-brand-navy">
            Height &amp; fit
          </h2>
          <dl>
            <Spec label="Style / cut" value={tee.category} />
            <Spec label="Fixed height" value={tee.heightMm ? `${tee.heightMm} mm` : null} />
            <Spec label="Adjustable range" value={tee.adjustableRangeMm} />
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
