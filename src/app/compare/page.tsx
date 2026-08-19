"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useCompare } from "@/lib/compare-context";
import { formatPrice, getTeeBySlug, type Tee } from "@/lib/products";
import ProductImage from "@/components/product-image";

interface Row {
  label: string;
  value: (t: Tee) => React.ReactNode;
}

const SECTIONS: { title: string; rows: Row[] }[] = [
  {
    title: "Overview",
    rows: [
      { label: "Price", value: (t) => formatPrice(t.priceGBP) },
      { label: "Style / cut", value: (t) => t.category ?? "—" },
      { label: "Union / League", value: (t) => t.code ?? "—" },
      { label: "Pro / coach endorsed", value: (t) => t.endorsement ?? "—" },
    ],
  },
  {
    title: "Height & fit",
    rows: [
      { label: "Fixed height", value: (t) => (t.heightMm ? `${t.heightMm} mm` : "—") },
      { label: "Adjustable range", value: (t) => t.adjustableRangeMm ?? "—" },
      { label: "Adjustment mechanism", value: (t) => t.mechanism ?? t.mechanismFamily },
      { label: "Ball cup angle", value: (t) => (t.cupAngleDeg ? `${t.cupAngleDeg}°` : "—") },
    ],
  },
  {
    title: "Build & performance",
    rows: [
      {
        label: "Base diameter",
        value: (t) =>
          t.baseDiameterMm ? `${t.baseDiameterMm} mm (${t.baseBand})` : (t.baseBand ?? "—"),
      },
      {
        label: "Weight",
        value: (t) => (t.weightG ? `${t.weightG} g (${t.weightBand})` : (t.weightBand ?? "—")),
      },
      { label: "Material", value: (t) => t.material ?? t.materialFamily },
      { label: "Shore hardness", value: (t) => t.shoreHardness ?? "—" },
      { label: "Grip / base type", value: (t) => t.gripType ?? t.gripFamily },
      {
        label: "Wind stability",
        value: (t) => (t.windRating ? `${t.windRating} / 5` : "Testing pending"),
      },
      {
        label: "Wet-pitch grip",
        value: (t) => (t.wetRating ? `${t.wetRating} / 5` : "Testing pending"),
      },
      {
        label: "Colours",
        value: (t) => (
          <div className="flex justify-end gap-1">
            {t.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-4 w-4 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        ),
      },
    ],
  },
];

export default function ComparePage() {
  const { slugs, remove, clear } = useCompare();
  const tees = slugs
    .map((s) => getTeeBySlug(s))
    .filter((t): t is Tee => !!t);

  if (tees.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-bold text-brand-navy">
          Nothing to compare yet
        </h1>
        <p className="mt-2 text-brand-grey">
          Tap &ldquo;Compare&rdquo; on any tee in the shop to add it here —
          you can compare up to 4 at once.
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-navy">
            Compare tees
          </h1>
          <p className="mt-1 text-brand-grey">
            {tees.length} tee{tees.length > 1 ? "s" : ""} side by side, spec for spec.
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-sm font-semibold text-brand-grey hover:text-red-600"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-brand-silver">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 bg-white p-4 text-left align-bottom text-xs font-bold uppercase tracking-wide text-brand-grey">
                &nbsp;
              </th>
              {tees.map((t) => (
                <th key={t.slug} className="min-w-[200px] border-l border-brand-silver p-4 align-bottom">
                  <div className="relative mx-auto mb-3 aspect-square w-24 overflow-hidden rounded-lg bg-brand-silver/30">
                    <ProductImage slug={t.slug} alt={`${t.brand} ${t.model}`} brand={t.brand} category={t.category} sizes="96px" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-grey">
                    {t.brand}
                  </p>
                  <Link
                    href={`/tees/${t.slug}`}
                    className="font-display text-sm font-bold text-brand-navy hover:text-brand-blue"
                  >
                    {t.model}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(t.slug)}
                    className="mt-2 block w-full text-[11px] font-semibold text-brand-grey hover:text-red-600"
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((section) => (
              <Fragment key={section.title}>
                <tr>
                  <td
                    colSpan={tees.length + 1}
                    className="sticky left-0 bg-brand-silver/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-navy"
                  >
                    {section.title}
                  </td>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.label} className="border-t border-brand-silver/70">
                    <th className="sticky left-0 z-10 bg-white p-4 text-left text-xs font-semibold text-brand-grey">
                      {row.label}
                    </th>
                    {tees.map((t) => (
                      <td
                        key={t.slug}
                        className="border-l border-brand-silver/70 p-4 text-right font-semibold text-brand-navy"
                      >
                        {row.value(t)}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-brand-grey">
        Wind stability and wet-pitch grip ratings are from our own
        independent testing programme, still rolling out — most tees will
        show &ldquo;testing pending&rdquo; until rated.
      </p>
    </div>
  );
}
