export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kickingtee.com";
export const SITE_NAME = "KickingTee.com";
export const CONTACT_EMAIL = "max.jary@kickingtee.com";

/**
 * Comparison-only mode is the default. The cart, Stripe checkout and
 * returns policy stay in the codebase but are hidden (and their routes
 * redirect to /shop, see src/proxy.ts) unless this is set to "true".
 * Only turn it on once supply terms are agreed with the brands, the
 * Stripe keys are set, and the terms of sale have been restored and
 * reviewed (the earlier draft is in git history: src/app/terms/page.tsx
 * before the "comparison-only launch" commit).
 */
export const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";
