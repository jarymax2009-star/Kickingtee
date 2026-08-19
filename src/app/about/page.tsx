import type { Metadata } from "next";
import Link from "next/link";
import { getBrands } from "@/lib/products";

const title = "About";
const description =
  "Why KickingTee.com exists, and how our spec-based filtering and independent testing method works.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about", images: ["/opengraph-image"] },
  twitter: { title, description },
};

export default function AboutPage() {
  const brands = getBrands();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
        Why KickingTee.com
      </h1>
      <p className="mt-4 text-brand-grey">
        No existing site lets a buyer filter rugby kicking tees across brands
        by height, adjustment mechanism, base diameter, cup angle, weight,
        material, grip type or independent field-performance. Retailers give
        you vague &ldquo;low / mid / high&rdquo; labels; single-brand sites
        only show their own range. We built the tool we wished existed.
      </p>

      <div className="mt-10 space-y-8">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-navy">
            Real specs, not marketing labels
          </h2>
          <p className="mt-2 text-brand-grey">
            Every tee in our range is logged with the same set of hard
            numbers — fixed height in mm, adjustable range, base diameter,
            cup angle, weight, material, shore hardness and grip type —
            gathered directly from manufacturer spec sheets and retailer
            listings. Where a figure isn&apos;t published, we say so rather
            than guessing.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-brand-navy">
            Independent performance testing
          </h2>
          <p className="mt-2 text-brand-grey">
            No manufacturer publishes wind stability or wet-pitch grip
            data. We&apos;re building that ourselves through hands-on field
            testing, rating every tee 1–5 on both. Ratings will appear on
            product pages and filters as testing completes.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-brand-navy">
            Honest pricing
          </h2>
          <p className="mt-2 text-brand-grey">
            Prices are gathered from manufacturers and retailers; some are
            confirmed directly, others are estimated or currency-converted
            where a brand doesn&apos;t publish a figure. We label which is
            which on every product page.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-brand-navy">
            Brands we carry
          </h2>
          <p className="mt-2 text-brand-grey">{brands.join(", ")}.</p>
        </div>
      </div>

      <Link
        href="/shop"
        className="mt-10 inline-block rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-brand-navy"
      >
        Start filtering tees
      </Link>
    </div>
  );
}
