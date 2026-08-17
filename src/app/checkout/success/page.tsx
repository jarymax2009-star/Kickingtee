"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";

function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-brand-navy">
        Order confirmed
      </h1>
      <p className="mt-2 text-brand-grey">
        Thanks for your order — a confirmation email is on its way from
        Stripe.
      </p>
      {sessionId && (
        <p className="mt-1 text-xs text-brand-grey">Reference: {sessionId}</p>
      )}
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-brand-navy"
      >
        Continue shopping
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
