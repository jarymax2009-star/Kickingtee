# KickingTee.com

The independent, cross-brand marketplace for rugby kicking tees. Built with
Next.js (App Router) + Tailwind CSS.

## What's here

- **Catalog** — 33 kicking tees across 11 brands (Rugby Bricks, Gilbert,
  Optimum, Rhino Rugby, Dan Carter, Centurion, Canterbury, Steeden, KooGa,
  Ram Rugby, Precision), sourced from `src/lib/products-data.json`
  (generated from the `rugby_kicking_tee_market` research spreadsheet).
- **Filter taxonomy** (`/shop`) — height, adjustment mechanism, base
  diameter, weight, material, grip type, union/league, price band and
  pro-endorsement, matching the taxonomy defined during market research.
  Wind-stability and wet-pitch-grip ratings are wired into the data model
  but not yet populated — independent testing hasn't happened yet, so we
  say so rather than fabricating ratings.
- **Product pages** (`/tees/[slug]`) — full spec sheet, price with a
  confidence label (confirmed / listed / estimated), pro endorsements,
  and a link back to the manufacturer's own listing.
- **Cart + checkout** (`/cart`) — client-side cart (localStorage), backed
  by a real Stripe Checkout Session created in `src/app/api/checkout/route.ts`.
- **Brand kit** — logo, mark, and navy/blue/silver palette live in
  `public/brand/` and `src/app/globals.css`.

## Product photography

This build does not include real product photos: the manufacturer/retailer
domains needed to source them are outside this environment's network
egress allowlist. Every listing gracefully falls back to an on-brand
placeholder (brand name + category) via `src/components/product-image.tsx`
— drop a real photo into `public/products/<slug>.jpg` (or `.png`/`.webp`)
for any product and it will be picked up automatically. Slugs are visible
in `src/lib/products-data.json`.

Which slugs have a real photo is tracked in `src/lib/image-manifest.json`,
regenerated automatically by `scripts/generate-image-manifest.mjs` before
every `dev`/`build` run (or manually via `npm run images:manifest`) — this
is what lets the product image component render the real photo or the
placeholder immediately, without probing several file extensions over the
network on every page load.

## Payments

Checkout is real Stripe Checkout, not a mock. To enable it:

```bash
cp .env.example .env.local
# then fill in STRIPE_SECRET_KEY with a test-mode key from
# https://dashboard.stripe.com/test/apikeys
```

Without a key set, `/api/checkout` returns a clear "Stripe is not
configured yet" error instead of failing silently.

**Before taking real payments in production**, note that manufacturer
outreach for these 33 products was still "Not started" as of the research
spreadsheet this catalog was built from — confirm supply/fulfillment
arrangements (or dropship/wholesale terms) with each brand before going
live with a live (non-test) Stripe key.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
```
