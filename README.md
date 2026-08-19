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
- **Compare tool** (`/compare`) — pick up to 4 tees anywhere on the site
  (a "Compare" button sits on every product card and detail page) and see
  every spec side by side. Selection persists in `localStorage` via
  `src/lib/compare-context.tsx`.
- **Legal pages** (`/terms`, `/privacy`, `/returns`) — rough first-draft
  Terms, Privacy Policy, and Returns &amp; Refunds policy for a UK-based
  Stripe checkout. Each is flagged as a draft in the UI — **have a
  solicitor review them and fill in the `[bracketed placeholders]`**
  (company name, registered address, etc.) before relying on them.
- **Order tracking** — a Stripe webhook
  (`src/app/api/webhooks/stripe/route.ts`) records every completed order
  into a local SQLite database *and* a standalone Excel workbook
  (`data/orders.xlsx`, one row per tee + colour ordered), and emails a
  summary to the address in `ORDER_NOTIFICATION_EMAIL`. See
  [Order tracking](#order-tracking) below.
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

## Order tracking

When a Stripe Checkout session completes, Stripe calls
`/api/webhooks/stripe`, which:

1. Verifies the request really came from Stripe (`STRIPE_WEBHOOK_SECRET`).
2. Records the order + line items in a local SQLite database
   (`data/orders.db`, via `src/lib/db.ts` using Node's built-in
   `node:sqlite`) — idempotently, so a retried webhook delivery never
   double-records an order.
3. Appends the same order to a standalone Excel workbook,
   `data/orders.xlsx` (`src/lib/excel.ts`, via
   [exceljs](https://github.com/exceljs/exceljs)) — **one row per tee +
   colour ordered**, not per order, so every row directly answers "which
   tee and which colour." Multi-item orders share the same Order ID
   across their rows. This file lives outside the web app's own pages —
   open it directly in Excel, or point a synced folder (OneDrive/Dropbox/
   Google Drive desktop) at `data/` to keep a live copy elsewhere
   automatically. A failure writing to it never blocks the order from
   being recorded in the database.
4. Emails a summary of the order to `ORDER_NOTIFICATION_EMAIL` via the
   [Resend](https://resend.com) API (`src/lib/email.ts`). If
   `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` aren't set, this step is
   skipped with a console warning — it never blocks the order from being
   recorded.

To see recorded orders and which tees are selling, visit `/admin/orders`
— it's gated behind Basic Auth via `ADMIN_BASIC_AUTH_USER` /
`ADMIN_BASIC_AUTH_PASS` (set in `.env.local`; the route 503s until both
are set). A "Download orders (.xlsx)" button there streams the current
`data/orders.xlsx` (same Basic Auth protection, since it's under `/admin`).

**Local testing:** use the [Stripe CLI](https://stripe.com/docs/stripe-cli)
to forward webhook events to your dev server —
`stripe listen --forward-to localhost:3000/api/webhooks/stripe` — and copy
the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.

**Before deploying to a serverless platform** (Vercel, etc.): `data/orders.db`
is a plain file on local disk, which doesn't persist across serverless
function invocations. Swap `src/lib/db.ts` for a hosted database (Turso/
libSQL, Postgres, Supabase...) before relying on this in that kind of
deployment — it's fine as-is for a traditional always-on Node server.

This environment's network egress policy blocks `api.stripe.com` and
`api.resend.com`, so the webhook's signature verification and
event-filtering logic, the database layer, and the email module's
graceful "not configured" fallback were all tested directly — the actual
Stripe/Resend API calls could not be exercised end-to-end here and should
be smoke-tested once deployed somewhere with normal internet access.

## SEO & discoverability

- **Sitemap & robots** (`src/app/sitemap.ts`, `robots.ts`) — every
  indexable page (home, shop, about, all 33 product pages) is listed with
  a `lastModified` date. `/compare`, `/cart`, `/checkout/success` are
  excluded — they're personalised, `localStorage`-driven pages with
  nothing server-rendered for a crawler to see. `/terms`, `/privacy`,
  `/returns` are also excluded *for now*, since they're still drafts with
  `[bracketed placeholders]` instead of real company details — see the
  comment in `sitemap.ts` for exactly where to add them back once
  finalised.
- **Structured data (JSON-LD)** — `Organization` + `WebSite` sitewide
  (`layout.tsx`); `Product` (with `Offer`/price/availability, only when a
  price actually exists — never fabricated) + `BreadcrumbList` on every
  product page; `BreadcrumbList` on `/shop`. Validate with
  [Google's Rich Results Test](https://search.google.com/test/rich-results)
  after deploying — it couldn't be reached from this environment's
  network (see the note on the webhook further up for why).
- **Open Graph / Twitter Cards** — every indexable page has a real
  title/description/canonical/OG image, not just inherited defaults.
  **Watch out if you add more pages**: Next.js does *not* deep-merge
  `openGraph`/`twitter` objects between a layout and its children — if a
  page defines its own `openGraph`, it must also either supply `images`
  itself or explicitly reference `/opengraph-image`, or the page silently
  loses its social preview image. Every page here does one or the other;
  keep that pattern for new ones.
- **Dynamic OG images** (`next/og`, `ImageResponse`) — a branded card is
  generated at build time for the homepage, `/shop`, and **every single
  product page** (brand, model, price, category, union/league — see
  `src/app/tees/[slug]/opengraph-image.tsx`). These also double as the
  `image` in each product's structured data, which is genuinely useful
  since there's no real product photography yet (see
  [Product photography](#product-photography)) — Google requires an
  image for `Product` rich results, and this always exists.
- **Canonical URLs** on every indexable page, so query-string variants
  (e.g. `/shop?code=Union`) consolidate to one canonical `/shop` rather
  than reading as duplicate content.

## Performance, security & accessibility

A few things worth knowing about how the site is configured under the hood:

- **Images**: every product image goes through `next/image` (automatic
  resizing/format conversion, lazy-loaded below the fold) — the only
  reason it's invisible today is that there are no real product photos
  yet (see [Product photography](#product-photography) above).
- **Security headers** (`next.config.ts`): a static Content-Security-Policy,
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, and HSTS are set on every
  response. The CSP deliberately avoids nonces so pages can stay
  statically generated — this only works because checkout is a full-page
  redirect to a Stripe-hosted URL rather than an embedded iframe/Elements
  integration; revisit the policy if that ever changes.
- **SEO**: see [SEO & discoverability](#seo--discoverability) below.
- **Accessibility**: every page passes an automated WCAG 2 A/AA sweep
  (axe-core) with zero violations — including colour contrast (the hero's
  accent blue and the homepage brand strip needed adjusting; see
  `--color-blue-ondark` in `globals.css`) and links embedded in body text
  being distinguishable without relying on colour alone.

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
