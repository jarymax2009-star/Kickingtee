import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Image
              src="/brand/mark-white.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              The independent, cross-brand marketplace for rugby kicking
              tees — filter by real specs, not marketing labels.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
              Shop
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-white">All tees</Link></li>
              <li><Link href="/shop?code=Union" className="hover:text-white">Union</Link></li>
              <li><Link href="/shop?code=League" className="hover:text-white">League</Link></li>
              <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
              Company
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white">About &amp; testing method</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
              Payments
            </h3>
            <p className="mt-4 text-sm text-white/70">
              Secure checkout powered by Stripe. All major cards accepted.
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
