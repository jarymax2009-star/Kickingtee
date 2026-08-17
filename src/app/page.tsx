import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product-card";
import { getAllTees, getBrands } from "@/lib/products";

export default function Home() {
  const tees = getAllTees();
  const featured = tees.filter((t) => t.endorsement).slice(0, 8);
  const brands = getBrands();

  const stats = [
    { label: "Kicking tees", value: `${tees.length}+` },
    { label: "Brands compared", value: `${brands.length}` },
    { label: "Spec filters", value: "10" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-silver">
              The independent kicking tee marketplace
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Find the right kicking tee —{" "}
              <span className="text-brand-blue">by spec, not guesswork.</span>
            </h1>
            <p className="mt-5 max-w-lg text-white/70">
              Every major rugby kicking tee brand, filterable by height,
              adjustment mechanism, base width, cup angle, weight, material
              and grip — plus independent wind and wet-pitch testing as it
              lands.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-md bg-brand-blue px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-brand-navy"
              >
                Shop all tees
              </Link>
              <Link
                href="/about"
                className="rounded-md border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                How our filters work
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wide text-white/50">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-bold">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto hidden aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-transparent lg:flex">
            <Image
              src="/brand/mark-white.png"
              alt="KickingTee.com"
              width={320}
              height={140}
              className="h-auto w-3/4"
              priority
            />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Real spec filters",
              body: "Height in mm, cup angle, base diameter and more — not vague low/mid/high labels.",
            },
            {
              title: "Cross-brand comparison",
              body: `${brands.length} brands, one place — Rugby Bricks to Gilbert to Steeden.`,
            },
            {
              title: "Independent testing",
              body: "Wind stability and wet-pitch grip ratings, field-tested by us — rolling out now.",
            },
            {
              title: "Secure checkout",
              body: "Fast, secure payment powered by Stripe. Cards, Apple Pay & Google Pay.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-brand-silver p-6"
            >
              <h3 className="font-display text-base font-bold text-brand-navy">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-brand-grey">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick filters */}
      <section className="bg-brand-silver/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-brand-navy">
            Shop by code
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Link
              href="/shop?code=Union"
              className="group rounded-xl bg-brand-navy p-6 text-white transition hover:bg-brand-blue"
            >
              <p className="font-display text-lg font-bold">Rugby Union</p>
              <p className="mt-1 text-sm text-white/70 group-hover:text-white/90">
                Widest range — Gilbert, Rugby Bricks, Optimum &amp; more
              </p>
            </Link>
            <Link
              href="/shop?code=League"
              className="group rounded-xl bg-brand-navy p-6 text-white transition hover:bg-brand-blue"
            >
              <p className="font-display text-lg font-bold">Rugby League</p>
              <p className="mt-1 text-sm text-white/70 group-hover:text-white/90">
                NRL-approved from Steeden and more
              </p>
            </Link>
            <Link
              href="/shop"
              className="group rounded-xl bg-white p-6 ring-1 ring-brand-silver transition hover:ring-brand-blue"
            >
              <p className="font-display text-lg font-bold text-brand-navy">
                All tees
              </p>
              <p className="mt-1 text-sm text-brand-grey">
                Browse the full range with every filter
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured / pro-endorsed */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy">
                Trusted by the pros
              </h2>
              <p className="mt-1 text-sm text-brand-grey">
                Tees used by professional kickers and coaches
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {featured.map((tee) => (
              <ProductCard key={tee.slug} tee={tee} />
            ))}
          </div>
        </section>
      )}

      {/* Brands strip */}
      <section className="border-t border-brand-silver bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-wide text-brand-grey">
            Brands on KickingTee.com
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {brands.map((b) => (
              <span
                key={b}
                className="font-display text-sm font-bold text-brand-navy/60"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
