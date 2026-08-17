"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CartButton from "./cart-button";

const NAV = [
  { href: "/shop", label: "Shop All Tees" },
  { href: "/shop?code=Union", label: "Union" },
  { href: "/shop?code=League", label: "League" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-silver bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/brand/mark.png"
            alt=""
            width={584}
            height={248}
            priority
            className="h-9 w-auto"
          />
          <span className="font-display text-lg font-bold tracking-tight text-brand-navy">
            Kicking<span className="text-brand-blue">Tee</span>.com
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-brand-navy/80 transition hover:text-brand-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartButton />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-navy md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-brand-silver bg-white px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm font-semibold text-brand-navy"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
