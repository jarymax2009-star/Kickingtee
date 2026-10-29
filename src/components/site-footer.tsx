import Link from "next/link";
import Image from "next/image";
import { CHECKOUT_ENABLED } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Image
              src="/brand/mark-white.png"
              alt=""
              width={584}
              height={248}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              An independent, cross-brand comparison site for rugby kicking
              tees. We list the real numbers so you can compare properly.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
              Tees
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-white">All tees</Link></li>
              <li><Link href="/shop?code=Union" className="hover:text-white">Union</Link></li>
              <li><Link href="/shop?code=League" className="hover:text-white">League</Link></li>
              <li><Link href="/compare" className="hover:text-white">Compare</Link></li>
              {CHECKOUT_ENABLED && (
                <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
              Company
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white">About &amp; testing method</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              {CHECKOUT_ENABLED && (
                <li><Link href="/returns" className="hover:text-white">Returns &amp; Refunds</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
              {CHECKOUT_ENABLED ? "Payments" : "Independent"}
            </h3>
            <p className="mt-4 text-sm text-white/70">
              {CHECKOUT_ENABLED
                ? "Secure checkout powered by Stripe. All major cards accepted."
                : "We don't sell tees or take payment from brands for listings. Every tee is shown on the same specs."}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KickingTee.com. All rights reserved.</p>
          <p>
            Prices and specs are aggregated from manufacturers and retailers
            for comparison; some figures are estimated where not publicly
            confirmed.
          </p>
        </div>
      </div>
    </footer>
  );
}
